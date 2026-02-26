"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type NoseShapeKey =
  | "straight"
  | "aquiline"
  | "button"
  | "nubian"
  | "snub"
  | "fleshy"
  | "wide"
  | "narrow"
  | "uncertain";

type BridgeKey = "straight" | "convex" | "concave" | "mixed" | "uncertain";
type TipKey = "upturned" | "neutral" | "downturned" | "uncertain";
type WidthKey = "narrow" | "balanced" | "wide" | "uncertain";

export type NoseShapeAnalysisResult = {
  shape: NoseShapeKey;
  shapeLabel: string;
  bridgeProfile: BridgeKey;
  tipDirection: TipKey;
  widthCategory: WidthKey;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  symmetryScore: number | null;
  projectionScore: number | null;
  rationale: string | null;
  observationNotes: string[];
  styleSuggestions: string[];
  retakeTips: string[];
  alternatives: string[];
  raw?: any;
};

type State = {
  analysis: NoseShapeAnalysisResult | null;
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
    return "Nose-shape analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Nose-shape analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This nose-shape analysis timed out. Please retry with a clearer face photo.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeShape(input: unknown): NoseShapeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "uncertain";
  if (raw.includes("straight")) return "straight";
  if (raw.includes("aquiline") || raw.includes("roman")) return "aquiline";
  if (raw.includes("button")) return "button";
  if (raw.includes("nubian")) return "nubian";
  if (raw.includes("snub")) return "snub";
  if (raw.includes("fleshy") || raw.includes("bulb")) return "fleshy";
  if (raw.includes("wide")) return "wide";
  if (raw.includes("narrow")) return "narrow";
  return "uncertain";
}

function shapeLabel(shape: NoseShapeKey) {
  if (shape === "straight") return "Straight";
  if (shape === "aquiline") return "Aquiline";
  if (shape === "button") return "Button";
  if (shape === "nubian") return "Nubian";
  if (shape === "snub") return "Snub";
  if (shape === "fleshy") return "Fleshy";
  if (shape === "wide") return "Wide";
  if (shape === "narrow") return "Narrow";
  return "Uncertain";
}

function normalizeBridge(input: unknown): BridgeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (raw.includes("straight")) return "straight";
  if (raw.includes("convex")) return "convex";
  if (raw.includes("concave")) return "concave";
  if (raw.includes("mixed")) return "mixed";
  return "uncertain";
}

function normalizeTip(input: unknown): TipKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (raw.includes("upturned")) return "upturned";
  if (raw.includes("downturned")) return "downturned";
  if (raw.includes("neutral")) return "neutral";
  return "uncertain";
}

function normalizeWidth(input: unknown): WidthKey {
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

function normalizeResult(raw: any): NoseShapeAnalysisResult {
  const assessment = raw?.nose_assessment ?? raw?.assessment ?? raw;

  const shape = normalizeShape(
    assessment?.primary_shape ??
      assessment?.nose_shape ??
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

  const projectionRaw = parseNumber(assessment?.projection_score ?? null);
  const projectionScore =
    projectionRaw == null ? null : clamp(Math.round(projectionRaw), 0, 100);

  return {
    shape,
    shapeLabel: shapeLabel(shape),
    bridgeProfile: normalizeBridge(assessment?.bridge_profile ?? null),
    tipDirection: normalizeTip(assessment?.tip_direction ?? null),
    widthCategory: normalizeWidth(assessment?.width_category ?? null),
    confidence,
    confidenceScore,
    symmetryScore,
    projectionScore,
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

export function useNoseShapeAnalysis(
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

        const startRes = await fetch("/api/nose-shape", {
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
          throw new Error(`Nose-shape analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Nose-shape analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/nose-shape/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Nose-shape analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Nose-shape analysis failed");
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

        if (!finalResult) throw new Error("Nose-shape analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Nose Shape", {
          nose_shape: analysis.shapeLabel,
          bridge_profile: analysis.bridgeProfile,
          tip_direction: analysis.tipDirection,
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

        console.error("Nose-shape analysis error:", err);

        trackEvent("Analyze Nose Shape Error", {
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
