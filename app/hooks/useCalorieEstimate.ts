"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type EstimateSource = "example" | "upload";

type Confidence = "low" | "medium" | "high";

export type CalorieItem = {
  name: string;
  calories: number;
  portionNote: string;
};

export type MacroSplit = {
  protein: number;
  carbs: number;
  fat: number;
};

export type CalorieEstimateResult = {
  mealName: string | null;
  totalCalories: number | null;
  rangeMin: number | null;
  rangeMax: number | null;
  confidence: Confidence;
  detectedItems: CalorieItem[];
  macroSplit: MacroSplit | null;
  assumptions: string[];
  rationale: string | null;
  improvements: string[];
  raw?: any;
};

type State = {
  estimate: CalorieEstimateResult | null;
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
    return "Calorie estimation is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Calorie estimation is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "This image could not be processed.",
      "The moderation filter flagged it as sensitive.",
      "Try another clear meal photo and upload again.",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This estimation timed out. Please retry with a clearer image.";
  }

  return msg || "Something went wrong. Please try a different meal photo.";
}

function parseNumber(input: unknown): number | null {
  const value = Array.isArray(input) ? input[0] : input;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeConfidence(input: unknown): Confidence {
  const value = String(Array.isArray(input) ? input[0] : input ?? "")
    .trim()
    .toLowerCase();
  if (value === "low" || value === "medium" || value === "high") return value;
  return "medium";
}

function asStringArray(input: unknown, max = 6) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function normalizeDetectedItems(input: unknown): CalorieItem[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((row) => {
      const name = String((row as any)?.name ?? "").trim();
      const calories = parseNumber((row as any)?.estimated_calories_kcal);
      const portionNote = String((row as any)?.portion_note ?? "").trim();
      if (!name || calories == null || calories < 0) return null;
      return {
        name,
        calories: Math.round(calories),
        portionNote: portionNote || "Portion assumed from image scale.",
      };
    })
    .filter((row): row is CalorieItem => Boolean(row))
    .slice(0, 8);
}

function normalizeMacroSplit(input: unknown): MacroSplit | null {
  const protein = parseNumber((input as any)?.protein);
  const carbs = parseNumber((input as any)?.carbs);
  const fat = parseNumber((input as any)?.fat);

  if (protein == null || carbs == null || fat == null) return null;

  const rawTotal = protein + carbs + fat;
  if (!Number.isFinite(rawTotal) || rawTotal <= 0) return null;

  const normalizedProtein = Math.max(0, Math.round((protein / rawTotal) * 100));
  const normalizedCarbs = Math.max(0, Math.round((carbs / rawTotal) * 100));
  const normalizedFat = Math.max(0, 100 - normalizedProtein - normalizedCarbs);

  return {
    protein: normalizedProtein,
    carbs: normalizedCarbs,
    fat: normalizedFat,
  };
}

function normalizeResult(raw: any): CalorieEstimateResult {
  const meal = raw?.meal_assessment ?? raw?.assessment ?? raw;

  const totalCalories = parseNumber(meal?.calorie_estimate_kcal);
  const rangeMin = parseNumber(meal?.calorie_range_kcal?.min);
  const rangeMax = parseNumber(meal?.calorie_range_kcal?.max);

  return {
    mealName: String(meal?.meal_name ?? "").trim() || null,
    totalCalories: totalCalories == null ? null : Math.max(0, Math.round(totalCalories)),
    rangeMin: rangeMin == null ? null : Math.max(0, Math.round(rangeMin)),
    rangeMax: rangeMax == null ? null : Math.max(0, Math.round(rangeMax)),
    confidence: normalizeConfidence(meal?.confidence_rating),
    detectedItems: normalizeDetectedItems(meal?.detected_items),
    macroSplit: normalizeMacroSplit(meal?.macro_split_percent),
    assumptions: asStringArray(meal?.serving_assumptions, 6),
    rationale: String(meal?.estimate_rationale ?? "").trim() || null,
    improvements: asStringArray(meal?.accuracy_improvements, 8),
    raw,
  };
}

export function useCalorieEstimate(
  imageUrl: string | null,
  options?: { source?: EstimateSource }
) {
  const source: EstimateSource = options?.source ?? "upload";
  const [state, setState] = useState<State>({
    estimate: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!imageUrl) {
      setState({ estimate: null, loading: false, error: null });
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;

    const run = async () => {
      setState({ estimate: null, loading: true, error: null });

      try {
        const resolvedUrl = resolveToAbsoluteUrl(imageUrl);
        const response = await fetch(resolvedUrl, { cache: "no-store", signal });

        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) throw new Error(`Not an image: ${contentType}`);

        const blob = await response.blob();
        const base64WithMime = await blobToDataUrl(blob);

        const startRes = await fetch("/api/calorie-estimate", {
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
          throw new Error(`Calorie estimation start failed (${startRes.status})${detailPart}`);
        }

        const startData = await startRes.json();
        const getUrl = startData?.getUrl;

        if (!getUrl) throw new Error("Calorie estimation did not return getUrl");

        let finalResult: any = null;

        for (let i = 0; i < 240; i++) {
          if (signal.aborted) return;

          const statusRes = await fetch(
            `/api/calorie-estimate/status?getUrl=${encodeURIComponent(getUrl)}`,
            { cache: "no-store", signal }
          );

          if (!statusRes.ok) {
            throw new Error(`Calorie estimation status failed: ${statusRes.status}`);
          }

          const statusData = await statusRes.json();
          const status = statusData?.status;

          if (status === "failed" || status === "canceled") {
            throw new Error(statusData?.error || "Calorie estimation failed");
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

        if (!finalResult) throw new Error("Calorie estimation timed out");

        const estimate = normalizeResult(finalResult);
        if (estimate.totalCalories == null) throw new Error("Model returned no calorie estimate");

        if (signal.aborted) return;

        trackEvent("Estimate Meal Calories", {
          total_calories: estimate.totalCalories,
          confidence: estimate.confidence,
          source,
        });

        setState({ estimate, loading: false, error: null });
      } catch (err: any) {
        if (signal.aborted) return;

        const rawMessage =
          err?.message ?? (typeof err === "string" ? err : "") ?? "Error";
        const friendly = buildFriendlyErrorMessage(rawMessage);

        console.error("Calorie estimate error:", err);

        trackEvent("Calorie Estimate Error", {
          error_type: isE005SensitiveFlag(rawMessage) ? "E005_sensitive" : "other",
          error_message: rawMessage.slice(0, 200),
          source,
        });

        setState({
          estimate: null,
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

