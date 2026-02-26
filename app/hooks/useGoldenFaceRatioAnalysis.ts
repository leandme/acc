"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";
type Confidence = "low" | "medium" | "high";

export type GoldenRatioMeasurement = {
  measurement: string;
  observedRatio: number | null;
  targetRatio: number | null;
  closenessScore: number | null;
  note: string | null;
};

export type GoldenFaceRatioResult = {
  overallScore: number | null;
  estimatedPhiRatio: number | null;
  phiDifferencePercent: number | null;
  confidence: Confidence;
  confidenceScore: number;
  faceShapeHint: string | null;
  summary: string | null;
  measurements: GoldenRatioMeasurement[];
  improvementTips: string[];
  raw?: any;
};

type State = {
  result: GoldenFaceRatioResult | null;
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
    return "Golden ratio analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Golden ratio analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This golden ratio analysis timed out. Please retry with a clearer front-facing photo.";
  }

  return msg || "Something went wrong. Please try a different face photo.";
}

function normalizeConfidence(input: unknown): Confidence {
  const value = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (value === "low" || value === "medium" || value === "high") return value;
  return "medium";
}

function normalizeConfidenceScore(confidenceScoreInput: unknown, confidence: Confidence) {
  const raw = Array.isArray(confidenceScoreInput)
    ? confidenceScoreInput[0]
    : confidenceScoreInput;
  const parsed = Number(raw);
  if (Number.isFinite(parsed)) return clamp(Math.round(parsed), 0, 100);

  if (confidence === "high") return 85;
  if (confidence === "low") return 35;
  return 65;
}

function asStringArray(input: unknown, max = 8) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeMeasurement(input: any): GoldenRatioMeasurement | null {
  if (!input || typeof input !== "object") return null;

  const measurement = String(input.measurement ?? input.name ?? "").trim();
  if (!measurement) return null;

  const observedRatio = parseNumber(input.observed_ratio ?? input.observedRatio ?? null);
  const targetRatio = parseNumber(input.target_ratio ?? input.targetRatio ?? null);
  const closenessRaw = parseNumber(input.closeness_score ?? input.closenessScore ?? null);
  const closenessScore =
    closenessRaw == null ? null : clamp(Math.round(closenessRaw), 0, 100);

  return {
    measurement,
    observedRatio: observedRatio == null ? null : Number(observedRatio.toFixed(3)),
    targetRatio: targetRatio == null ? null : Number(targetRatio.toFixed(3)),
    closenessScore,
    note: String(input.note ?? "").trim() || null,
  };
}

function normalizeMeasurements(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => normalizeMeasurement(item))
    .filter((item): item is GoldenRatioMeasurement => Boolean(item))
    .slice(0, 10);
}

function normalizeResult(raw: any): GoldenFaceRatioResult {
  const assessment = raw?.golden_ratio_assessment ?? raw?.assessment ?? raw;

  const confidence = normalizeConfidence(assessment?.confidence_rating);
  const confidenceScore = normalizeConfidenceScore(
    assessment?.confidence_score,
    confidence
  );

  const estimatedPhiRatioRaw = parseNumber(
    assessment?.estimated_phi_ratio ?? assessment?.phi_ratio ?? null
  );
  const estimatedPhiRatio =
    estimatedPhiRatioRaw == null ? null : Number(estimatedPhiRatioRaw.toFixed(3));

  const providedDifference = parseNumber(
    assessment?.phi_difference_percent ?? assessment?.phi_difference_pct ?? null
  );

  const computedDifference =
    estimatedPhiRatio == null
      ? null
      : (Math.abs(estimatedPhiRatio - 1.618) / 1.618) * 100;

  const phiDifferencePercentRaw = providedDifference ?? computedDifference;
  const phiDifferencePercent =
    phiDifferencePercentRaw == null
      ? null
      : Number(clamp(phiDifferencePercentRaw, 0, 200).toFixed(2));

  const measurements = normalizeMeasurements(
    assessment?.key_measurements ?? assessment?.measurements ?? []
  );

  const overallScoreRaw = parseNumber(
    assessment?.overall_score ?? assessment?.golden_ratio_score ?? null
  );
  const averageMeasurementScore =
    measurements.length > 0
      ? measurements
          .map((m) => m.closenessScore)
          .filter((v): v is number => typeof v === "number")
          .reduce((sum, v, _, arr) => sum + v / arr.length, 0)
      : null;

  const overallScoreValue =
    overallScoreRaw ?? (averageMeasurementScore != null ? averageMeasurementScore : null);
  const overallScore =
    overallScoreValue == null ? null : clamp(Math.round(overallScoreValue), 0, 100);

  return {
    overallScore,
    estimatedPhiRatio,
    phiDifferencePercent,
    confidence,
    confidenceScore,
    faceShapeHint:
      String(assessment?.face_shape_hint ?? assessment?.face_shape ?? "").trim() || null,
    summary:
      String(
        assessment?.analysis_summary ??
          assessment?.summary ??
          assessment?.golden_ratio_summary ??
          ""
      ).trim() || null,
    measurements,
    improvementTips: asStringArray(assessment?.improvement_tips, 10),
    raw,
  };
}

export function useGoldenFaceRatioAnalysis(
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

        const startRes = await fetch("/api/golden-face-ratio", {
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
          throw new Error(`Golden ratio analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Golden ratio analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/golden-face-ratio/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Golden ratio status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Golden ratio analysis failed");
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

        if (!finalResult) throw new Error("Golden ratio analysis timed out");

        const result = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Golden Face Ratio", {
          overall_score: result.overallScore,
          confidence: result.confidence,
          source,
        });

        setState({ result, loading: false, error: null });
      } catch (err: any) {
        if (signal.aborted) return;

        const rawMessage =
          err?.message ?? (typeof err === "string" ? err : "") ?? "Error";
        const friendly = buildFriendlyErrorMessage(rawMessage);

        console.error("Golden ratio analysis error:", err);

        trackEvent("Analyze Golden Face Ratio Error", {
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
