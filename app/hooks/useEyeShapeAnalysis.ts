"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type EyeShapeKey =
  | "almond"
  | "round"
  | "hooded"
  | "monolid"
  | "upturned"
  | "downturned"
  | "deep-set"
  | "protruding"
  | "uncertain";

export type EyeColorKey =
  | "brown"
  | "hazel"
  | "blue"
  | "green"
  | "gray"
  | "amber"
  | "black"
  | "mixed"
  | "uncertain";

export type CanthalTiltKey = "positive" | "neutral" | "negative" | "uncertain";

export type EyeShapeAnalysisResult = {
  shape: EyeShapeKey;
  shapeLabel: string;
  eyeColor: EyeColorKey;
  eyeColorLabel: string;
  eyeColorConfidence: number;
  canthalTilt: CanthalTiltKey;
  canthalTiltLabel: string;
  canthalTiltAngle: number | null;
  canthalTiltConfidence: number;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  rationale: string | null;
  observationNotes: string[];
  styleSuggestions: string[];
  retakeTips: string[];
  alternatives: string[];
  secondaryTones: string[];
  raw?: any;
};

type State = {
  analysis: EyeShapeAnalysisResult | null;
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
    return "Eye analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Eye analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This eye analysis timed out. Please retry with a clearer face photo.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeShapeKey(input: unknown): EyeShapeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "uncertain";
  if (raw.includes("almond")) return "almond";
  if (raw.includes("round")) return "round";
  if (raw.includes("hooded")) return "hooded";
  if (raw.includes("monolid")) return "monolid";
  if (raw.includes("upturned")) return "upturned";
  if (raw.includes("downturned")) return "downturned";
  if (raw.includes("deep") && raw.includes("set")) return "deep-set";
  if (raw.includes("protruding")) return "protruding";
  return "uncertain";
}

function shapeLabel(shape: EyeShapeKey) {
  if (shape === "almond") return "Almond";
  if (shape === "round") return "Round";
  if (shape === "hooded") return "Hooded";
  if (shape === "monolid") return "Monolid";
  if (shape === "upturned") return "Upturned";
  if (shape === "downturned") return "Downturned";
  if (shape === "deep-set") return "Deep Set";
  if (shape === "protruding") return "Protruding";
  return "Uncertain";
}

function normalizeEyeColor(input: unknown): EyeColorKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "uncertain";
  if (raw.includes("brown")) return "brown";
  if (raw.includes("hazel")) return "hazel";
  if (raw.includes("blue")) return "blue";
  if (raw.includes("green")) return "green";
  if (raw.includes("gray") || raw.includes("grey")) return "gray";
  if (raw.includes("amber")) return "amber";
  if (raw.includes("black")) return "black";
  if (raw.includes("mixed") || raw.includes("hetero")) return "mixed";
  return "uncertain";
}

function eyeColorLabel(color: EyeColorKey) {
  if (color === "brown") return "Brown";
  if (color === "hazel") return "Hazel";
  if (color === "blue") return "Blue";
  if (color === "green") return "Green";
  if (color === "gray") return "Gray";
  if (color === "amber") return "Amber";
  if (color === "black") return "Black";
  if (color === "mixed") return "Mixed";
  return "Uncertain";
}

function normalizeTilt(input: unknown): CanthalTiltKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (!raw) return "uncertain";
  if (raw.includes("positive")) return "positive";
  if (raw.includes("neutral")) return "neutral";
  if (raw.includes("negative")) return "negative";
  return "uncertain";
}

function tiltLabel(tilt: CanthalTiltKey) {
  if (tilt === "positive") return "Positive";
  if (tilt === "neutral") return "Neutral";
  if (tilt === "negative") return "Negative";
  return "Uncertain";
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

function normalizeResult(raw: any): EyeShapeAnalysisResult {
  const assessment = raw?.eye_assessment ?? raw?.assessment ?? raw;
  const color = assessment?.eye_color ?? {};
  const tilt = assessment?.canthal_tilt ?? {};

  const shape = normalizeShapeKey(
    assessment?.primary_eye_shape ??
      assessment?.eye_shape ??
      null
  );

  const eyeColor = normalizeEyeColor(
    color?.primary ??
      assessment?.eye_color_primary ??
      null
  );

  const canthalTilt = normalizeTilt(
    tilt?.category ??
      assessment?.canthal_tilt_category ??
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

  const colorConfidenceRaw = parseNumber(color?.confidence_score ?? null);
  const eyeColorConfidence =
    colorConfidenceRaw == null ? confidenceScore : clamp(Math.round(colorConfidenceRaw), 0, 100);

  const tiltConfidenceRaw = parseNumber(tilt?.confidence_score ?? null);
  const canthalTiltConfidence =
    tiltConfidenceRaw == null ? confidenceScore : clamp(Math.round(tiltConfidenceRaw), 0, 100);

  const tiltAngleRaw = parseNumber(tilt?.angle_degrees ?? null);
  const canthalTiltAngle =
    tiltAngleRaw == null ? null : Number(clamp(tiltAngleRaw, -30, 30).toFixed(2));

  return {
    shape,
    shapeLabel: shapeLabel(shape),
    eyeColor,
    eyeColorLabel: eyeColorLabel(eyeColor),
    eyeColorConfidence,
    canthalTilt,
    canthalTiltLabel: tiltLabel(canthalTilt),
    canthalTiltAngle,
    canthalTiltConfidence,
    confidence,
    confidenceScore,
    rationale:
      String(
        assessment?.shape_rationale ??
          assessment?.rationale ??
          ""
      ).trim() || null,
    observationNotes: asStringArray(assessment?.observation_notes, 8),
    styleSuggestions: asStringArray(assessment?.style_suggestions, 8),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    alternatives: asStringArray(assessment?.alternative_eye_shapes, 6),
    secondaryTones: asStringArray(color?.secondary_tones, 6),
    raw,
  };
}

export function useEyeShapeAnalysis(
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

        const startRes = await fetch("/api/eye-shape", {
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
          throw new Error(`Eye analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Eye analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/eye-shape/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Eye analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Eye analysis failed");
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

        if (!finalResult) throw new Error("Eye analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Eye Shape", {
          eye_shape: analysis.shapeLabel,
          eye_color: analysis.eyeColorLabel,
          canthal_tilt: analysis.canthalTiltLabel,
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

        console.error("Eye analysis error:", err);

        trackEvent("Analyze Eye Shape Error", {
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
