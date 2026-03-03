"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";
type Confidence = "low" | "medium" | "high";

export type JawlineTypeKey =
  | "very-sharp"
  | "sharp"
  | "balanced"
  | "soft"
  | "rounded"
  | "uncertain";

export type ProfileQuality = "good" | "moderate" | "poor" | "uncertain";

export type LandmarkPoint = {
  x: number;
  y: number;
};

export type JawlineLandmarks = {
  ramusPoint: LandmarkPoint | null;
  gonionPoint: LandmarkPoint | null;
  mentonPoint: LandmarkPoint | null;
};

export type JawlineCheckResult = {
  jawlineType: JawlineTypeKey;
  jawlineTypeLabel: string;
  jawlineAngle: number | null;
  angleScore: number;
  confidence: Confidence;
  confidenceScore: number;
  sideProfileVisible: boolean;
  profileQuality: ProfileQuality;
  rationale: string | null;
  measurementNotes: string[];
  recommendations: string[];
  retakeTips: string[];
  alternatives: string[];
  landmarks: JawlineLandmarks;
  measurementAvailable: boolean;
  raw?: any;
};

type State = {
  analysis: JawlineCheckResult | null;
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
    return "Jawline analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Jawline analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear side-profile photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This jawline analysis timed out. Please retry with a clearer side-profile photo.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeConfidence(input: unknown): Confidence {
  const value = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (value === "high" || value === "medium" || value === "low") return value;
  return "medium";
}

function normalizeConfidenceScore(confidenceScoreInput: unknown, confidence: Confidence) {
  const raw = Array.isArray(confidenceScoreInput)
    ? confidenceScoreInput[0]
    : confidenceScoreInput;
  const parsed = Number(raw);
  if (Number.isFinite(parsed)) return clamp(Math.round(parsed), 0, 100);

  if (confidence === "high") return 86;
  if (confidence === "low") return 34;
  return 64;
}

function asStringArray(input: unknown, max = 8) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeProfileQuality(input: unknown): ProfileQuality {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (raw.includes("good") || raw.includes("high")) return "good";
  if (raw.includes("moderate") || raw.includes("medium") || raw.includes("fair")) {
    return "moderate";
  }
  if (raw.includes("poor") || raw.includes("low")) return "poor";
  return "uncertain";
}

function classifyJawlineByAngle(angle: number): JawlineTypeKey {
  if (angle <= 114) return "very-sharp";
  if (angle <= 124) return "sharp";
  if (angle <= 134) return "balanced";
  if (angle <= 145) return "soft";
  return "rounded";
}

function normalizeJawlineType(input: unknown, angle: number | null): JawlineTypeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");

  if (raw.includes("very") && raw.includes("sharp")) return "very-sharp";
  if (raw.includes("sharp") || raw.includes("defined")) return "sharp";
  if (raw.includes("balanced") || raw.includes("average")) return "balanced";
  if (raw.includes("soft") || raw.includes("mild")) return "soft";
  if (raw.includes("rounded") || raw.includes("obtuse") || raw.includes("broad")) {
    return "rounded";
  }
  if (raw.includes("uncertain") || raw.includes("unknown")) return "uncertain";

  if (angle != null) return classifyJawlineByAngle(angle);
  return "uncertain";
}

function jawlineTypeLabel(type: JawlineTypeKey) {
  if (type === "very-sharp") return "Very Sharp";
  if (type === "sharp") return "Sharp";
  if (type === "balanced") return "Balanced";
  if (type === "soft") return "Soft";
  if (type === "rounded") return "Rounded";
  return "Uncertain";
}

function normalizePoint(input: unknown): LandmarkPoint | null {
  if (!input || typeof input !== "object") return null;
  const candidate = input as Record<string, unknown>;

  const xRaw = parseNumber(candidate.x ?? candidate.X ?? candidate.left ?? null);
  const yRaw = parseNumber(candidate.y ?? candidate.Y ?? candidate.top ?? null);

  if (xRaw == null || yRaw == null) return null;

  return {
    x: Number(clamp(xRaw, 0, 1).toFixed(5)),
    y: Number(clamp(yRaw, 0, 1).toFixed(5)),
  };
}

function computeAngleFromLandmarks(landmarks: JawlineLandmarks): number | null {
  const ramus = landmarks.ramusPoint;
  const gonion = landmarks.gonionPoint;
  const menton = landmarks.mentonPoint;

  if (!ramus || !gonion || !menton) return null;

  const v1x = ramus.x - gonion.x;
  const v1y = ramus.y - gonion.y;
  const v2x = menton.x - gonion.x;
  const v2y = menton.y - gonion.y;

  const mag1 = Math.hypot(v1x, v1y);
  const mag2 = Math.hypot(v2x, v2y);

  if (mag1 < 0.01 || mag2 < 0.01) return null;

  const dot = v1x * v2x + v1y * v2y;
  const cosine = clamp(dot / (mag1 * mag2), -1, 1);
  const angle = (Math.acos(cosine) * 180) / Math.PI;

  if (!Number.isFinite(angle)) return null;
  return Number(clamp(angle, 80, 170).toFixed(1));
}

function normalizeAngle(
  angleInput: unknown,
  landmarks: JawlineLandmarks
): number | null {
  const providedRaw = parseNumber(angleInput);
  const provided =
    providedRaw == null ? null : Number(clamp(providedRaw, 80, 170).toFixed(1));

  const computed = computeAngleFromLandmarks(landmarks);

  if (provided != null) {
    if (computed == null) return provided;

    // If values are very far apart, trust geometric landmark reconstruction.
    if (Math.abs(provided - computed) > 22) return computed;
    return provided;
  }

  return computed;
}

function deriveAngleScore(angle: number | null, type: JawlineTypeKey): number {
  if (angle != null) {
    const derived = ((160 - angle) / 52) * 100;
    return clamp(Math.round(derived), 0, 100);
  }

  if (type === "very-sharp") return 90;
  if (type === "sharp") return 76;
  if (type === "balanced") return 58;
  if (type === "soft") return 40;
  if (type === "rounded") return 24;
  return 0;
}

function normalizeAngleScore(
  angleScoreInput: unknown,
  angle: number | null,
  type: JawlineTypeKey
) {
  const parsed = parseNumber(angleScoreInput);
  if (parsed != null) return clamp(Math.round(parsed), 0, 100);
  return deriveAngleScore(angle, type);
}

function normalizeResult(raw: any): JawlineCheckResult {
  const assessment = raw?.jawline_assessment ?? raw?.assessment ?? raw;

  const landmarks: JawlineLandmarks = {
    ramusPoint: normalizePoint(
      assessment?.landmarks?.ramus_point ??
        assessment?.landmarks?.ramusPoint ??
        assessment?.ramus_point ??
        assessment?.ramusPoint ??
        null
    ),
    gonionPoint: normalizePoint(
      assessment?.landmarks?.gonion_point ??
        assessment?.landmarks?.gonionPoint ??
        assessment?.gonion_point ??
        assessment?.gonionPoint ??
        null
    ),
    mentonPoint: normalizePoint(
      assessment?.landmarks?.menton_point ??
        assessment?.landmarks?.mentonPoint ??
        assessment?.landmarks?.chin_point ??
        assessment?.menton_point ??
        assessment?.mentonPoint ??
        assessment?.chin_point ??
        null
    ),
  };

  const jawlineAngle = normalizeAngle(
    assessment?.jawline_angle_degrees ??
      assessment?.jawline_angle ??
      assessment?.angle_degrees ??
      assessment?.angle ??
      null,
    landmarks
  );

  const jawlineType = normalizeJawlineType(
    assessment?.jawline_type ?? assessment?.type ?? null,
    jawlineAngle
  );

  const confidence = normalizeConfidence(
    assessment?.confidence_rating ?? assessment?.confidence ?? null
  );

  const confidenceScore = normalizeConfidenceScore(
    assessment?.confidence_score ?? null,
    confidence
  );

  const angleScore = normalizeAngleScore(
    assessment?.angle_score ?? assessment?.jawline_score ?? null,
    jawlineAngle,
    jawlineType
  );

  const sideProfileVisibleRaw = assessment?.side_profile_visible;
  const sideProfileVisible =
    typeof sideProfileVisibleRaw === "boolean"
      ? sideProfileVisibleRaw
      : jawlineAngle != null || jawlineType !== "uncertain";

  const profileQuality = normalizeProfileQuality(assessment?.profile_quality ?? null);

  return {
    jawlineType,
    jawlineTypeLabel: jawlineTypeLabel(jawlineType),
    jawlineAngle,
    angleScore,
    confidence,
    confidenceScore,
    sideProfileVisible,
    profileQuality,
    rationale:
      String(
        assessment?.shape_rationale ??
          assessment?.rationale ??
          assessment?.summary ??
          ""
      ).trim() || null,
    measurementNotes: asStringArray(assessment?.measurement_notes, 8),
    recommendations: asStringArray(
      assessment?.style_recommendations ?? assessment?.recommendations,
      8
    ),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    alternatives: asStringArray(assessment?.alternative_types, 6),
    landmarks,
    measurementAvailable:
      sideProfileVisible && jawlineAngle != null && jawlineType !== "uncertain",
    raw,
  };
}

export function useJawlineCheckAnalysis(
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

        const startRes = await fetch("/api/jawline-check", {
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
          throw new Error(`Jawline analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Jawline analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/jawline-check/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Jawline analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Jawline analysis failed");
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

        if (!finalResult) throw new Error("Jawline analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Jawline Check", {
          jawline_type: analysis.jawlineTypeLabel,
          jawline_angle: analysis.jawlineAngle,
          angle_score: analysis.angleScore,
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

        console.error("Jawline check error:", err);

        trackEvent("Analyze Jawline Check Error", {
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

    return () => {
      controller.abort();
    };
  }, [imageUrl, source]);

  return state;
}
