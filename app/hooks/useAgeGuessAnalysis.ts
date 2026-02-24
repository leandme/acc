"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type AgeBandKey =
  | "child"
  | "teen"
  | "young-adult"
  | "adult"
  | "middle-aged"
  | "senior"
  | "uncertain";

export type AgeGuessResult = {
  perceivedAge: number | null;
  ageRangeMin: number | null;
  ageRangeMax: number | null;
  ageBand: AgeBandKey;
  ageBandLabel: string;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  rationale: string | null;
  cues: string[];
  retakeTips: string[];
  raw?: any;
};

type State = {
  result: AgeGuessResult | null;
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
    return "Age analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Age analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This analysis timed out. Please retry with a clearer face image.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function deriveBandFromAge(age: number | null): AgeBandKey {
  if (age == null) return "uncertain";
  if (age <= 12) return "child";
  if (age <= 19) return "teen";
  if (age <= 34) return "young-adult";
  if (age <= 49) return "adult";
  if (age <= 64) return "middle-aged";
  return "senior";
}

function normalizeAgeBand(input: unknown, fallbackAge: number | null): AgeBandKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return deriveBandFromAge(fallbackAge);
  if (raw.includes("child") || raw.includes("kid")) return "child";
  if (raw.includes("teen")) return "teen";
  if (raw.includes("young_adult") || raw.includes("young adult")) return "young-adult";
  if (raw === "adult" || raw.includes("adult")) return "adult";
  if (raw.includes("middle_aged") || raw.includes("middle aged")) return "middle-aged";
  if (raw.includes("senior") || raw.includes("older")) return "senior";
  if (raw.includes("uncertain")) return "uncertain";
  return deriveBandFromAge(fallbackAge);
}

function ageBandLabel(band: AgeBandKey) {
  if (band === "child") return "Child";
  if (band === "teen") return "Teen";
  if (band === "young-adult") return "Young Adult";
  if (band === "adult") return "Adult";
  if (band === "middle-aged") return "Middle-Aged";
  if (band === "senior") return "Senior";
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
  return 64;
}

function asStringArray(input: unknown, max = 6) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeResult(raw: any): AgeGuessResult {
  const assessment = raw?.age_assessment ?? raw?.assessment ?? raw;

  const perceivedAgeRaw = parseNumber(assessment?.perceived_age ?? assessment?.age ?? null);
  const perceivedAge =
    perceivedAgeRaw == null ? null : clamp(Math.round(perceivedAgeRaw), 0, 100);

  const ageRangeMinRaw = parseNumber(
    assessment?.age_range?.min ?? assessment?.age_min ?? null
  );
  const ageRangeMaxRaw = parseNumber(
    assessment?.age_range?.max ?? assessment?.age_max ?? null
  );

  const ageRangeMin =
    ageRangeMinRaw == null ? null : clamp(Math.round(ageRangeMinRaw), 0, 100);
  const ageRangeMax =
    ageRangeMaxRaw == null ? null : clamp(Math.round(ageRangeMaxRaw), 0, 100);

  const confidence = normalizeConfidence(
    assessment?.confidence_rating ?? assessment?.confidence ?? null
  );

  const confidenceScore = normalizeConfidenceScore(
    assessment?.confidence_score ?? null,
    confidence
  );

  const ageBand = normalizeAgeBand(assessment?.age_band, perceivedAge);

  return {
    perceivedAge,
    ageRangeMin,
    ageRangeMax,
    ageBand,
    ageBandLabel: ageBandLabel(ageBand),
    confidence,
    confidenceScore,
    rationale:
      String(
        assessment?.age_rationale ??
          assessment?.rationale ??
          assessment?.estimation_rationale ??
          ""
      ).trim() || null,
    cues: asStringArray(assessment?.contributing_cues, 6),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    raw,
  };
}

export function useAgeGuessAnalysis(
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

        const startRes = await fetch("/api/age-guesser", {
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
          throw new Error(`Age analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Age analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/age-guesser/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Age analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Age analysis failed");
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

        if (!finalResult) throw new Error("Age analysis timed out");

        const result = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Age Guess", {
          perceived_age: result.perceivedAge,
          age_band: result.ageBandLabel,
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

        console.error("Age analysis error:", err);

        trackEvent("Analyze Age Guess Error", {
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
