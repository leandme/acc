"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type SkinTypeKey =
  | "dry"
  | "oily"
  | "combination"
  | "normal"
  | "sensitive"
  | "dehydrated"
  | "uncertain";

type LevelKey = "low" | "medium" | "high" | "uncertain";

export type SkinTypeAnalysisResult = {
  type: SkinTypeKey;
  typeLabel: string;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  sebumLevel: LevelKey;
  hydrationLevel: LevelKey;
  poreVisibility: LevelKey;
  rednessLevel: LevelKey;
  barrierSupport: LevelKey;
  rationale: string | null;
  observationNotes: string[];
  careSuggestions: string[];
  retakeTips: string[];
  alternatives: string[];
  raw?: any;
};

type State = {
  analysis: SkinTypeAnalysisResult | null;
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
    return "Skin-type analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Skin-type analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This skin-type analysis timed out. Please retry with a clearer face photo.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeTypeKey(input: unknown): SkinTypeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return "uncertain";
  if (raw.includes("combination") || raw.includes("combo")) return "combination";
  if (raw.includes("oily") || raw.includes("oil")) return "oily";
  if (raw.includes("dry")) return "dry";
  if (raw.includes("sensitive")) return "sensitive";
  if (raw.includes("dehydrated")) return "dehydrated";
  if (raw.includes("normal") || raw.includes("balanced")) return "normal";
  return "uncertain";
}

function typeLabel(type: SkinTypeKey) {
  if (type === "dry") return "Dry";
  if (type === "oily") return "Oily";
  if (type === "combination") return "Combination";
  if (type === "normal") return "Normal";
  if (type === "sensitive") return "Sensitive";
  if (type === "dehydrated") return "Dehydrated";
  return "Uncertain";
}

function normalizeLevel(input: unknown): LevelKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (raw.includes("high")) return "high";
  if (raw.includes("low")) return "low";
  if (raw.includes("medium") || raw.includes("moderate")) return "medium";
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

function normalizeResult(raw: any): SkinTypeAnalysisResult {
  const assessment = raw?.skin_assessment ?? raw?.assessment ?? raw;

  const type = normalizeTypeKey(
    assessment?.primary_type ?? assessment?.skin_type ?? assessment?.type ?? null
  );

  const confidence = normalizeConfidence(
    assessment?.confidence_rating ?? assessment?.confidence ?? null
  );

  const confidenceScore = normalizeConfidenceScore(
    assessment?.confidence_score ?? null,
    confidence
  );

  return {
    type,
    typeLabel: typeLabel(type),
    confidence,
    confidenceScore,
    sebumLevel: normalizeLevel(assessment?.sebum_level ?? null),
    hydrationLevel: normalizeLevel(assessment?.hydration_level ?? null),
    poreVisibility: normalizeLevel(assessment?.pore_visibility ?? null),
    rednessLevel: normalizeLevel(assessment?.redness_level ?? null),
    barrierSupport: normalizeLevel(assessment?.barrier_support ?? null),
    rationale:
      String(assessment?.type_rationale ?? assessment?.rationale ?? "").trim() || null,
    observationNotes: asStringArray(assessment?.observation_notes, 8),
    careSuggestions: asStringArray(assessment?.care_suggestions, 8),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    alternatives: asStringArray(assessment?.alternative_types, 6),
    raw,
  };
}

export function useSkinTypeAnalysis(
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

        const startRes = await fetch("/api/skin-type", {
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
              startErr?.detail || startErr?.error || startErr?.message || "";
          } catch {
            // ignore parse failures and fallback to status-only message
          }

          const detailPart = startErrDetail ? ` - ${startErrDetail}` : "";
          throw new Error(`Skin-type analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Skin-type analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/skin-type/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Skin-type analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Skin-type analysis failed");
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

        if (!finalResult) throw new Error("Skin-type analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Skin Type", {
          skin_type: analysis.typeLabel,
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

        console.error("Skin-type analysis error:", err);

        trackEvent("Analyze Skin Type Error", {
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
