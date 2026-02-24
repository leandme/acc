"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type FaceShapeKey =
  | "oval"
  | "round"
  | "square"
  | "oblong"
  | "heart"
  | "diamond"
  | "uncertain";

export type FaceShapeAnalysisResult = {
  shape: FaceShapeKey;
  shapeLabel: string;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  rationale: string | null;
  proportionNotes: string[];
  recommendations: string[];
  alternatives: string[];
  raw?: any;
};

type State = {
  analysis: FaceShapeAnalysisResult | null;
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
    return "Face-shape analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Face-shape analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This analysis timed out. Please retry with a clearer image.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeShapeKey(input: unknown): FaceShapeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return "uncertain";
  if (raw.includes("oval")) return "oval";
  if (raw.includes("round") || raw.includes("circle")) return "round";
  if (raw.includes("square")) return "square";
  if (
    raw.includes("oblong") ||
    raw.includes("rectangle") ||
    raw.includes("rectangular") ||
    raw.includes("long")
  ) {
    return "oblong";
  }
  if (raw.includes("heart") || raw.includes("inverted triangle")) return "heart";
  if (raw.includes("diamond")) return "diamond";
  return "uncertain";
}

function shapeLabel(shape: FaceShapeKey) {
  if (shape === "oval") return "Oval";
  if (shape === "round") return "Round";
  if (shape === "square") return "Square";
  if (shape === "oblong") return "Oblong";
  if (shape === "heart") return "Heart";
  if (shape === "diamond") return "Diamond";
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

  if (confidenceRating === "high") return 88;
  if (confidenceRating === "low") return 38;
  return 66;
}

function asStringArray(input: unknown, max = 6) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeResult(raw: any): FaceShapeAnalysisResult {
  const shape = normalizeShapeKey(
    raw?.face_shape_assessment?.primary_face_shape ??
      raw?.primary_face_shape ??
      raw?.face_shape ??
      raw?.shape ??
      null
  );

  const confidence = normalizeConfidence(
    raw?.face_shape_assessment?.confidence_rating ??
      raw?.face_shape_assessment?.confidence ??
      raw?.confidence_rating ??
      raw?.confidence ??
      null
  );

  const confidenceScore = normalizeConfidenceScore(
    raw?.face_shape_assessment?.confidence_score ?? raw?.confidence_score ?? null,
    confidence
  );

  const rationale =
    raw?.face_shape_assessment?.shape_rationale ??
    raw?.shape_rationale ??
    raw?.rationale ??
    null;

  const proportionNotes = asStringArray(
    raw?.face_shape_assessment?.proportion_notes ?? raw?.proportion_notes
  );

  const recommendations = asStringArray(
    raw?.face_shape_assessment?.styling_recommendations ??
      raw?.face_shape_assessment?.recommendations ??
      raw?.styling_recommendations ??
      raw?.recommendations
  );

  const alternatives = asStringArray(
    raw?.face_shape_assessment?.alternative_face_shapes ??
      raw?.alternative_face_shapes
  );

  return {
    shape,
    shapeLabel: shapeLabel(shape),
    confidence,
    confidenceScore,
    rationale: typeof rationale === "string" && rationale.trim() ? rationale.trim() : null,
    proportionNotes,
    recommendations,
    alternatives,
    raw,
  };
}

export function useFaceShapeAnalysis(
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

        const startRes = await fetch("/api/face-shape", {
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
          throw new Error(`Face-shape analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Face-shape analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/face-shape/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Face-shape analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Face-shape analysis failed");
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

        if (!finalResult) throw new Error("Face-shape analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Face Shape", {
          face_shape: analysis.shapeLabel,
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

        console.error("Face shape error:", err);

        trackEvent("Analyze Face Shape Error", {
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
