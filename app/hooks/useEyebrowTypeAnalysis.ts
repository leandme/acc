"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type EyebrowTypeKey =
  | "straight"
  | "soft-angled"
  | "hard-angled"
  | "rounded"
  | "high-arched"
  | "s-shaped"
  | "flat"
  | "uncertain";

type ThicknessKey = "thin" | "medium" | "thick" | "uncertain";

export type EyebrowTypeAnalysisResult = {
  type: EyebrowTypeKey;
  typeLabel: string;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  archHeightScore: number | null;
  symmetryScore: number | null;
  thickness: ThicknessKey;
  rationale: string | null;
  observationNotes: string[];
  groomingSuggestions: string[];
  retakeTips: string[];
  alternatives: string[];
  raw?: any;
};

type State = {
  analysis: EyebrowTypeAnalysisResult | null;
  loading: boolean;
  error: string | null;
};

const resolveToAbsoluteUrl = (url: string) => {
  if (url.startsWith("/")) return `${window.location.origin}${url}`;
  return url;
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function parseNumber(input: unknown): number | null {
  const value = Array.isArray(input) ? input[0] : input;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isE005SensitiveFlag(msg: string) {
  const m = (msg || "").toLowerCase();
  return (
    m.includes("(e005)") ||
    m.includes("flagged as sensitive") ||
    m.includes("input or output was flagged as sensitive")
  );
}

function buildFriendlyErrorMessage(rawMsg: string) {
  const msg = rawMsg || "";
  const lower = msg.toLowerCase();

  if (lower.includes("monthly spend limit reached") || lower.includes("spend limit")) {
    return "Eyebrow analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Eyebrow analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This eyebrow analysis timed out. Please retry with a clearer face photo.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeTypeKey(input: unknown): EyebrowTypeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return "uncertain";
  if (raw.includes("soft") && raw.includes("angle")) return "soft-angled";
  if (raw.includes("hard") && raw.includes("angle")) return "hard-angled";
  if (raw.includes("high") && raw.includes("arch")) return "high-arched";
  if (raw.includes("s") && raw.includes("shape")) return "s-shaped";
  if (raw.includes("straight")) return "straight";
  if (raw.includes("round")) return "rounded";
  if (raw.includes("flat")) return "flat";
  return "uncertain";
}

function typeLabel(type: EyebrowTypeKey) {
  if (type === "straight") return "Straight";
  if (type === "soft-angled") return "Soft Angled";
  if (type === "hard-angled") return "Hard Angled";
  if (type === "rounded") return "Rounded";
  if (type === "high-arched") return "High Arched";
  if (type === "s-shaped") return "S-Shaped";
  if (type === "flat") return "Flat";
  return "Uncertain";
}

function normalizeThickness(input: unknown): ThicknessKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (raw.includes("thin")) return "thin";
  if (raw.includes("thick")) return "thick";
  if (raw.includes("medium")) return "medium";
  return "uncertain";
}

function normalizeConfidence(input: unknown): "low" | "medium" | "high" {
  const value = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (value === "high" || value === "medium" || value === "low") return value;
  return "medium";
}

function normalizeConfidenceScore(
  confidenceScoreInput: unknown,
  confidenceRating: "low" | "medium" | "high"
) {
  const raw = Array.isArray(confidenceScoreInput)
    ? confidenceScoreInput[0]
    : confidenceScoreInput;
  const parsed = Number(raw);
  if (Number.isFinite(parsed)) return clamp(Math.round(parsed), 0, 100);

  if (confidenceRating === "high") return 86;
  if (confidenceRating === "low") return 34;
  return 64;
}

function asStringArray(input: unknown, max = 6) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeResult(raw: any): EyebrowTypeAnalysisResult {
  const assessment = raw?.eyebrow_assessment ?? raw?.assessment ?? raw;

  const type = normalizeTypeKey(
    assessment?.primary_type ??
      assessment?.eyebrow_type ??
      assessment?.type ??
      null
  );

  const confidence = normalizeConfidence(
    assessment?.confidence_rating ??
      assessment?.confidence ??
      null
  );

  const confidenceScore = normalizeConfidenceScore(
    assessment?.confidence_score ?? null,
    confidence
  );

  const archHeightRaw = parseNumber(assessment?.arch_height_score ?? null);
  const archHeightScore =
    archHeightRaw == null ? null : clamp(Math.round(archHeightRaw), 0, 100);

  const symmetryRaw = parseNumber(assessment?.symmetry_score ?? null);
  const symmetryScore =
    symmetryRaw == null ? null : clamp(Math.round(symmetryRaw), 0, 100);

  return {
    type,
    typeLabel: typeLabel(type),
    confidence,
    confidenceScore,
    archHeightScore,
    symmetryScore,
    thickness: normalizeThickness(assessment?.thickness_category ?? null),
    rationale:
      String(
        assessment?.shape_rationale ??
          assessment?.rationale ??
          ""
      ).trim() || null,
    observationNotes: asStringArray(assessment?.observation_notes, 8),
    groomingSuggestions: asStringArray(assessment?.grooming_suggestions, 8),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    alternatives: asStringArray(assessment?.alternative_types, 5),
    raw,
  };
}

export function useEyebrowTypeAnalysis(
  imageUrl: string | null,
  options?: { source?: AnalyzeSource }
) {
  const source: AnalyzeSource = options?.source ?? "upload";
  const [state, setState] = useState<State>({
    analysis: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!imageUrl) {
      setState({ analysis: null, loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const run = async () => {
      setState({ analysis: null, loading: true, error: null });

      try {
        const resolvedUrl = resolveToAbsoluteUrl(imageUrl);
        const response = await fetch(resolvedUrl, { cache: "no-store", signal });

        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) throw new Error(`Not an image: ${contentType}`);

        const blob = await response.blob();
        const base64WithMime = await blobToDataUrl(blob);

        const startRes = await fetch("/api/eyebrow-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64WithMime }),
          signal,
        });

        if (!startRes.ok) {
          let startErrDetail = "";
          try {
            const startErr = await startRes.json();
            startErrDetail =
              startErr?.detail ||
              startErr?.error ||
              startErr?.message ||
              "";
          } catch {
            // ignore parse failures and fallback to status-only message
          }

          const detailPart = startErrDetail ? ` - ${startErrDetail}` : "";
          throw new Error(`Eyebrow analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Eyebrow analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/eyebrow-type/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Eyebrow analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Eyebrow analysis failed");
          }

          if (status === "succeeded") {
            finalResult = statusData?.result;
            if (!finalResult) {
              throw new Error("Model returned invalid JSON");
            }
            break;
          }

          await sleep(1000);
        }

        if (!finalResult) throw new Error("Eyebrow analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Eyebrow Type", {
          eyebrow_type: analysis.typeLabel,
          confidence: analysis.confidence,
          confidence_score: analysis.confidenceScore,
          source,
        });

        setState({ analysis, loading: false, error: null });
      } catch (err: any) {
        if (signal.aborted) return;

        const rawMessage =
          err?.message ?? (typeof err === "string" ? err : "") ?? "Error";
        const friendly = buildFriendlyErrorMessage(rawMessage);

        console.error("Eyebrow analysis error:", err);

        trackEvent("Analyze Eyebrow Type Error", {
          error_type: isE005SensitiveFlag(rawMessage) ? "E005_sensitive" : "other",
          error_message: rawMessage.slice(0, 200),
          source,
        });

        setState({
          analysis: null,
          loading: false,
          error: friendly,
        });
      }
    };

    run();
    return () => controller.abort();
  }, [imageUrl, source]);

  return state;
}
