"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type LipShapeKey =
  | "full"
  | "thin"
  | "top-heavy"
  | "bottom-heavy"
  | "heart-shaped"
  | "wide"
  | "round"
  | "downturned"
  | "uncertain";

type UpperLowerBalanceKey =
  | "balanced"
  | "upper-dominant"
  | "lower-dominant"
  | "uncertain";

type CupidBowDefinitionKey = "defined" | "soft" | "flat" | "uncertain";

type MouthWidthKey = "narrow" | "balanced" | "wide" | "uncertain";

export type LipShapeAnalysisResult = {
  shape: LipShapeKey;
  shapeLabel: string;
  upperLowerBalance: UpperLowerBalanceKey;
  cupidBowDefinition: CupidBowDefinitionKey;
  mouthWidthCategory: MouthWidthKey;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  symmetryScore: number | null;
  fullnessScore: number | null;
  rationale: string | null;
  observationNotes: string[];
  styleSuggestions: string[];
  retakeTips: string[];
  alternatives: string[];
  raw?: any;
};

type State = {
  analysis: LipShapeAnalysisResult | null;
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
    return "Lip-shape analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Lip-shape analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This lip-shape analysis timed out. Please retry with a clearer face photo.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeShape(input: unknown): LipShapeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return "uncertain";
  if ((raw.includes("top") && raw.includes("heavy")) || raw.includes("top_heavy")) {
    return "top-heavy";
  }
  if ((raw.includes("bottom") && raw.includes("heavy")) || raw.includes("bottom_heavy")) {
    return "bottom-heavy";
  }
  if (raw.includes("heart") || raw.includes("cupid")) return "heart-shaped";
  if (raw.includes("downturned") || (raw.includes("down") && raw.includes("turned"))) {
    return "downturned";
  }
  if (raw.includes("thin")) return "thin";
  if (raw.includes("wide")) return "wide";
  if (raw.includes("round")) return "round";
  if (raw.includes("full") || raw.includes("plump")) return "full";
  return "uncertain";
}

function shapeLabel(shape: LipShapeKey) {
  if (shape === "full") return "Full";
  if (shape === "thin") return "Thin";
  if (shape === "top-heavy") return "Top-Heavy";
  if (shape === "bottom-heavy") return "Bottom-Heavy";
  if (shape === "heart-shaped") return "Heart-Shaped";
  if (shape === "wide") return "Wide";
  if (shape === "round") return "Round";
  if (shape === "downturned") return "Downturned";
  return "Uncertain";
}

function normalizeUpperLowerBalance(input: unknown): UpperLowerBalanceKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (raw.includes("upper")) return "upper-dominant";
  if (raw.includes("lower")) return "lower-dominant";
  if (raw.includes("balanced")) return "balanced";
  return "uncertain";
}

function normalizeCupidBow(input: unknown): CupidBowDefinitionKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (raw.includes("defined")) return "defined";
  if (raw.includes("soft")) return "soft";
  if (raw.includes("flat")) return "flat";
  return "uncertain";
}

function normalizeMouthWidth(input: unknown): MouthWidthKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (raw.includes("narrow")) return "narrow";
  if (raw.includes("wide")) return "wide";
  if (raw.includes("balanced")) return "balanced";
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

function normalizeResult(raw: any): LipShapeAnalysisResult {
  const assessment = raw?.lip_assessment ?? raw?.assessment ?? raw;

  const shape = normalizeShape(
    assessment?.primary_shape ??
      assessment?.lip_shape ??
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

  const symmetryRaw = parseNumber(assessment?.symmetry_score ?? null);
  const symmetryScore =
    symmetryRaw == null ? null : clamp(Math.round(symmetryRaw), 0, 100);

  const fullnessRaw = parseNumber(assessment?.fullness_score ?? null);
  const fullnessScore =
    fullnessRaw == null ? null : clamp(Math.round(fullnessRaw), 0, 100);

  return {
    shape,
    shapeLabel: shapeLabel(shape),
    upperLowerBalance: normalizeUpperLowerBalance(assessment?.upper_lower_balance ?? null),
    cupidBowDefinition: normalizeCupidBow(assessment?.cupid_bow_definition ?? null),
    mouthWidthCategory: normalizeMouthWidth(assessment?.mouth_width_category ?? null),
    confidence,
    confidenceScore,
    symmetryScore,
    fullnessScore,
    rationale:
      String(
        assessment?.shape_rationale ??
          assessment?.rationale ??
          ""
      ).trim() || null,
    observationNotes: asStringArray(assessment?.observation_notes, 8),
    styleSuggestions: asStringArray(assessment?.style_suggestions, 8),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    alternatives: asStringArray(assessment?.alternative_shapes, 6),
    raw,
  };
}

export function useLipShapeAnalysis(
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

        const startRes = await fetch("/api/lip-shape", {
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
          throw new Error(`Lip-shape analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Lip-shape analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/lip-shape/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Lip-shape analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Lip-shape analysis failed");
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

        if (!finalResult) throw new Error("Lip-shape analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Lip Shape", {
          lip_shape: analysis.shapeLabel,
          upper_lower_balance: analysis.upperLowerBalance,
          cupid_bow_definition: analysis.cupidBowDefinition,
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

        console.error("Lip-shape analysis error:", err);

        trackEvent("Analyze Lip Shape Error", {
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
