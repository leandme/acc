"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type AttractivenessBandKey =
  | "very-low"
  | "low"
  | "moderate"
  | "above-average"
  | "high"
  | "very-high"
  | "exceptional"
  | "uncertain";

export type AttractivenessResult = {
  score: number | null;
  band: AttractivenessBandKey;
  bandLabel: string;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  rationale: string | null;
  positiveCues: string[];
  styleTips: string[];
  retakeTips: string[];
  raw?: any;
};

type State = {
  result: AttractivenessResult | null;
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
    return "Attractiveness analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Attractiveness analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (lower.includes("timed out")) {
    return "This analysis timed out. Please retry with a clearer portrait.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function deriveBandFromScore(score: number | null): AttractivenessBandKey {
  if (score == null) return "uncertain";
  if (score <= 24) return "very-low";
  if (score <= 39) return "low";
  if (score <= 54) return "moderate";
  if (score <= 69) return "above-average";
  if (score <= 84) return "high";
  if (score <= 94) return "very-high";
  return "exceptional";
}

function normalizeBand(input: unknown, fallbackScore: number | null): AttractivenessBandKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return deriveBandFromScore(fallbackScore);
  if (raw.includes("very_low") || raw.includes("very low")) return "very-low";
  if (raw.includes("above_average") || raw.includes("above average")) return "above-average";
  if (raw === "low" || raw.includes(" low")) return "low";
  if (raw.includes("moderate") || raw.includes("average")) return "moderate";
  if (raw === "high" || raw.includes(" high")) return "high";
  if (raw.includes("very_high") || raw.includes("very high")) return "very-high";
  if (raw.includes("exceptional") || raw.includes("elite")) return "exceptional";
  if (raw.includes("uncertain")) return "uncertain";
  return deriveBandFromScore(fallbackScore);
}

function bandLabel(band: AttractivenessBandKey) {
  if (band === "very-low") return "Very Low";
  if (band === "low") return "Low";
  if (band === "moderate") return "Moderate";
  if (band === "above-average") return "Above Average";
  if (band === "high") return "High";
  if (band === "very-high") return "Very High";
  if (band === "exceptional") return "Exceptional";
  return "Uncertain";
}

function normalizeConfidence(input: unknown): "low" | "medium" | "high" {
  const value = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (value === "low" || value === "medium" || value === "high") return value;
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
  return 62;
}

function asStringArray(input: unknown, max = 6) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeResult(raw: any): AttractivenessResult {
  const assessment = raw?.attractiveness_assessment ?? raw?.assessment ?? raw;

  const scoreRaw = parseNumber(
    assessment?.attractiveness_score ?? assessment?.score ?? null
  );
  const score = scoreRaw == null ? null : clamp(Math.round(scoreRaw), 0, 100);

  const confidence = normalizeConfidence(
    assessment?.confidence_rating ?? assessment?.confidence ?? null
  );

  const confidenceScore = normalizeConfidenceScore(
    assessment?.confidence_score ?? null,
    confidence
  );

  const band = normalizeBand(
    assessment?.attractiveness_band ?? assessment?.band ?? null,
    score
  );

  return {
    score,
    band,
    bandLabel: bandLabel(band),
    confidence,
    confidenceScore,
    rationale:
      String(
        assessment?.attractiveness_rationale ??
          assessment?.rationale ??
          assessment?.score_rationale ??
          ""
      ).trim() || null,
    positiveCues: asStringArray(
      assessment?.positive_cues ?? assessment?.key_cues,
      6
    ),
    styleTips: asStringArray(
      assessment?.style_tips ?? assessment?.improvement_tips,
      8
    ),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    raw,
  };
}

export function useAttractivenessAnalysis(
  imageUrl: string | null,
  options?: { source?: AnalyzeSource }
) {
  const source: AnalyzeSource = options?.source ?? "upload";
  const [state, setState] = useState<State>({
    result: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!imageUrl) {
      setState({ result: null, loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const run = async () => {
      setState({ result: null, loading: true, error: null });

      try {
        const resolvedUrl = resolveToAbsoluteUrl(imageUrl);
        const response = await fetch(resolvedUrl, { cache: "no-store", signal });

        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) throw new Error(`Not an image: ${contentType}`);

        const blob = await response.blob();
        const base64WithMime = await blobToDataUrl(blob);

        const startRes = await fetch("/api/attractiveness", {
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
          throw new Error(`Attractiveness analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Attractiveness analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/attractiveness/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Attractiveness analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Attractiveness analysis failed");
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

        if (!finalResult) throw new Error("Attractiveness analysis timed out");

        const result = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Attractiveness", {
          attractiveness_score: result.score,
          attractiveness_band: result.bandLabel,
          confidence: result.confidence,
          confidence_score: result.confidenceScore,
          source,
        });

        setState({ result, loading: false, error: null });
      } catch (err: any) {
        if (signal.aborted) return;

        const rawMessage =
          err?.message ?? (typeof err === "string" ? err : "") ?? "Error";
        const friendly = buildFriendlyErrorMessage(rawMessage);

        console.error("Attractiveness analysis error:", err);

        trackEvent("Analyze Attractiveness Error", {
          error_type: isE005SensitiveFlag(rawMessage) ? "E005_sensitive" : "other",
          error_message: rawMessage.slice(0, 200),
          source,
        });

        setState({
          result: null,
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
