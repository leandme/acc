"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type AnalyzeSource = "example" | "upload";

export type HairTypeKey =
  | "1a"
  | "1b"
  | "1c"
  | "2a"
  | "2b"
  | "2c"
  | "3a"
  | "3b"
  | "3c"
  | "4a"
  | "4b"
  | "4c"
  | "uncertain";

type HairFamilyKey = "straight" | "wavy" | "curly" | "coily" | "uncertain";
type LevelKey = "low" | "medium" | "high" | "uncertain";
type StrandAppearanceKey = "fine" | "medium" | "coarse" | "mixed" | "uncertain";

export type HairTypeAnalysisResult = {
  type: HairTypeKey;
  typeLabel: string;
  family: HairFamilyKey;
  familyLabel: string;
  confidence: "low" | "medium" | "high";
  confidenceScore: number;
  patternTightness: LevelKey;
  strandAppearance: StrandAppearanceKey;
  volumeTendency: LevelKey;
  frizzTendency: LevelKey;
  shrinkageTendency: LevelKey;
  rationale: string | null;
  observationNotes: string[];
  careSuggestions: string[];
  retakeTips: string[];
  alternatives: string[];
  raw?: any;
};

type State = {
  analysis: HairTypeAnalysisResult | null;
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
    return "Hair-type analysis is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Hair-type analysis is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear front-facing face photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This hair-type analysis timed out. Please retry with a clearer photo.";
  }

  return msg || "Something went wrong. Please try a different image.";
}

function normalizeType(input: unknown): HairTypeKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (!raw) return "uncertain";

  const compact = raw.replace(/[^a-z0-9]/g, "");

  if (compact.includes("1a") || compact.includes("type1a")) return "1a";
  if (compact.includes("1b") || compact.includes("type1b")) return "1b";
  if (compact.includes("1c") || compact.includes("type1c")) return "1c";
  if (compact.includes("2a") || compact.includes("type2a")) return "2a";
  if (compact.includes("2b") || compact.includes("type2b")) return "2b";
  if (compact.includes("2c") || compact.includes("type2c")) return "2c";
  if (compact.includes("3a") || compact.includes("type3a")) return "3a";
  if (compact.includes("3b") || compact.includes("type3b")) return "3b";
  if (compact.includes("3c") || compact.includes("type3c")) return "3c";
  if (compact.includes("4a") || compact.includes("type4a")) return "4a";
  if (compact.includes("4b") || compact.includes("type4b")) return "4b";
  if (compact.includes("4c") || compact.includes("type4c")) return "4c";

  if (raw.includes("straight")) return "1b";
  if (raw.includes("wavy")) return "2b";
  if (raw.includes("curly")) return "3b";
  if (raw.includes("coily") || raw.includes("kinky")) return "4b";

  return "uncertain";
}

function typeLabel(type: HairTypeKey) {
  if (type === "1a") return "Type 1A";
  if (type === "1b") return "Type 1B";
  if (type === "1c") return "Type 1C";
  if (type === "2a") return "Type 2A";
  if (type === "2b") return "Type 2B";
  if (type === "2c") return "Type 2C";
  if (type === "3a") return "Type 3A";
  if (type === "3b") return "Type 3B";
  if (type === "3c") return "Type 3C";
  if (type === "4a") return "Type 4A";
  if (type === "4b") return "Type 4B";
  if (type === "4c") return "Type 4C";
  return "Uncertain";
}

function normalizeFamily(input: unknown, type: HairTypeKey): HairFamilyKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (raw.includes("straight")) return "straight";
  if (raw.includes("wavy")) return "wavy";
  if (raw.includes("curly")) return "curly";
  if (raw.includes("coily") || raw.includes("kinky")) return "coily";

  if (type.startsWith("1")) return "straight";
  if (type.startsWith("2")) return "wavy";
  if (type.startsWith("3")) return "curly";
  if (type.startsWith("4")) return "coily";
  return "uncertain";
}

function familyLabel(family: HairFamilyKey) {
  if (family === "straight") return "Straight";
  if (family === "wavy") return "Wavy";
  if (family === "curly") return "Curly";
  if (family === "coily") return "Coily";
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

function normalizeStrandAppearance(input: unknown): StrandAppearanceKey {
  const raw = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();

  if (raw.includes("fine")) return "fine";
  if (raw.includes("coarse") || raw.includes("thick")) return "coarse";
  if (raw.includes("medium")) return "medium";
  if (raw.includes("mixed")) return "mixed";
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

function normalizeAlternatives(input: unknown, primaryType: HairTypeKey) {
  const items = asStringArray(input, 6)
    .map((item) => normalizeType(item))
    .filter((type) => type !== "uncertain" && type !== primaryType)
    .map((type) => typeLabel(type));

  return Array.from(new Set(items)).slice(0, 4);
}

function normalizeResult(raw: any): HairTypeAnalysisResult {
  const assessment = raw?.hair_type_assessment ?? raw?.assessment ?? raw;

  const type = normalizeType(
    assessment?.primary_type ?? assessment?.hair_type ?? assessment?.type ?? null
  );

  const confidence = normalizeConfidence(
    assessment?.confidence_rating ?? assessment?.confidence ?? null
  );

  const confidenceScore = normalizeConfidenceScore(
    assessment?.confidence_score ?? null,
    confidence
  );

  const family = normalizeFamily(
    assessment?.type_family ?? assessment?.family ?? null,
    type
  );

  return {
    type,
    typeLabel: typeLabel(type),
    family,
    familyLabel: familyLabel(family),
    confidence,
    confidenceScore,
    patternTightness: normalizeLevel(assessment?.pattern_tightness ?? null),
    strandAppearance: normalizeStrandAppearance(assessment?.strand_appearance ?? null),
    volumeTendency: normalizeLevel(assessment?.volume_tendency ?? null),
    frizzTendency: normalizeLevel(assessment?.frizz_tendency ?? null),
    shrinkageTendency: normalizeLevel(assessment?.shrinkage_tendency ?? null),
    rationale:
      String(assessment?.type_rationale ?? assessment?.rationale ?? "").trim() || null,
    observationNotes: asStringArray(assessment?.observation_notes, 8),
    careSuggestions: asStringArray(assessment?.care_suggestions, 8),
    retakeTips: asStringArray(assessment?.retake_tips, 8),
    alternatives: normalizeAlternatives(assessment?.alternative_types, type),
    raw,
  };
}

export function useHairTypeAnalysis(
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

        const startRes = await fetch("/api/hair-type", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64WithMime }),
          signal,
        });

        if (!startRes.ok) {
          let startErrDetail = "";
          try {
            const startErr = await startRes.json();
            startErrDetail = startErr?.detail || startErr?.error || startErr?.message || "";
          } catch {
            // ignore parse failures and fallback to status-only message
          }

          const detailPart = startErrDetail ? ` - ${startErrDetail}` : "";
          throw new Error(`Hair-type analysis start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Hair-type analysis did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/hair-type/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Hair-type analysis status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Hair-type analysis failed");
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

        if (!finalResult) throw new Error("Hair-type analysis timed out");

        const analysis = normalizeResult(finalResult);

        if (signal.aborted) return;

        trackEvent("Analyze Hair Type", {
          hair_type: analysis.typeLabel,
          hair_family: analysis.familyLabel,
          confidence: analysis.confidence,
          confidence_score: analysis.confidenceScore,
          source,
        });

        setState({ analysis, loading: false, error: null });
      } catch (err: any) {
        if (signal.aborted) return;

        const rawMessage = err?.message ?? (typeof err === "string" ? err : "") ?? "Error";
        const friendly = buildFriendlyErrorMessage(rawMessage);

        console.error("Hair-type analysis error:", err);

        trackEvent("Analyze Hair Type Error", {
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
