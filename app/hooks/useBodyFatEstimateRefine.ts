"use client";

import { useRef, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type EstimateResult = {
  bodyFat: number | null;
  perceivedAge: number | null;
  perceivedGender: string | null;
  accuracy: "low" | "medium" | "high" | null;
  rationale: string | null;
  improve: string[];
  raw?: any;
};

type State = {
  estimate: EstimateResult | null;
  loading: boolean;
  error: string | null;
};

export type RefineInput = {
  imageUrl: string;
  units: "metric" | "imperial";
  age: number;
  height: number;
  weight: number;
  waist?: number | null;

  extraImageFiles?: File[]; // ✅ canonical name
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

const resolveToAbsoluteUrl = (url: string) => {
  if (url.startsWith("/")) return `${window.location.origin}${url}`;
  return url;
};

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
    return "Refined estimation is temporarily unavailable because the Replicate monthly spend limit was reached. Increase billing limit in Replicate and retry.";
  }

  if (lower.includes("insufficient credits")) {
    return "Refined estimation is temporarily unavailable due to insufficient Replicate credits.";
  }

  if (isE005SensitiveFlag(msg)) {
    return [
      "Ugh! Our AI can’t process this photo.",
      "It thinks that it's nudity.",
      "Try again with another image?",
    ].join("\n");
  }

  if (msg.toLowerCase().includes("timed out")) {
    return "This one took too long to process. Please try again.";
  }

  return msg || "Something went wrong. Please try again.";
}

export function useBodyFatEstimateRefine() {
  const [state, setState] = useState<State>({
    estimate: null,
    loading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  async function refine(input: RefineInput) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const { signal } = controller;

    setState({ estimate: null, loading: true, error: null });

    trackEvent("Refine Estimate", {
      source: "upload",
      units: input.units,
      age: input.age,
      height: input.height,
      weight: input.weight,
      waist: input.waist ?? null,
      "extra images count": input.extraImageFiles?.length ?? 0,
    });

    try {
      // 1) Original image → base64
      const resolvedUrl = resolveToAbsoluteUrl(input.imageUrl);
      const response = await fetch(resolvedUrl, { cache: "no-store", signal });
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const imageBase64 = await blobToDataUrl(blob);

      // 2) Extra images → base64
      const extraImagesBase64 = await Promise.all(
        (input.extraImageFiles ?? []).map(fileToDataUrl)
      );

      // 3) Start refined prediction
      const startRes = await fetch("/api/estimate/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal,
        body: JSON.stringify({
          imageBase64,
          extraImages: extraImagesBase64,
          units: input.units,
          age: input.age,
          height: input.height,
          weight: input.weight,
          waist: input.waist ?? null,
        }),
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
        throw new Error(`Refine start failed (${startRes.status})${detailPart}`);
      }

      const startData = await startRes.json();
      const getUrl = startData?.getUrl;
      if (!getUrl) throw new Error("Missing getUrl");

      // 4) Poll
      let finalEstimate: any = null;
      for (let i = 0; i < 240; i++) {
        if (signal.aborted) return;

        const statusRes = await fetch(
          `/api/estimate/status?getUrl=${encodeURIComponent(getUrl)}`,
          { cache: "no-store", signal }
        );

        const statusData = await statusRes.json();
        if (statusData.status === "failed") {
          throw new Error(statusData.error || "Prediction failed");
        }

        if (statusData.status === "succeeded") {
          finalEstimate = statusData.estimate;
          break;
        }

        await sleep(1000);
      }

      if (!finalEstimate) throw new Error("Prediction timed out");

      const normalized: EstimateResult = {
        bodyFat: finalEstimate?.estimation?.body_fat_percent ?? null,
        perceivedAge: Number(finalEstimate?.photo_assessment?.perceived_age) ?? null,
        perceivedGender: finalEstimate?.photo_assessment?.perceived_gender ?? null,
        accuracy: finalEstimate?.estimation?.accuracy_rating ?? null,
        rationale: finalEstimate?.estimation?.estimation_rationale ?? null,
        improve: finalEstimate?.estimation?.accuracy_improvements ?? [],
        raw: finalEstimate,
      };

      if (normalized.bodyFat == null) {
        throw new Error("Model returned no body fat estimate");
      }

      trackEvent("Estimate Body Fat Percentage", {
        'body fat': normalized.bodyFat,
        'perceived age': normalized.perceivedAge,
        'perceived gender': normalized.perceivedGender,
        accuracy: normalized.accuracy,
        source: "upload",
        type: "refine"
      });

      setState({ estimate: normalized, loading: false, error: null });
    } catch (err: any) {
      if (signal.aborted) return;

      const raw = err?.message ?? String(err);
      const friendly = buildFriendlyErrorMessage(raw);

      trackEvent("Estimate Error", {
        'error type': isE005SensitiveFlag(raw) ? "E005_sensitive" : "other",
        'error message': raw.slice(0, 200),
         source: 'upload',
        'estimate type': 'refined'
      });

      setState({ estimate: null, loading: false, error: friendly });
    }
  }

  function cancel() {
    abortRef.current?.abort();
  }

  return { ...state, refine, cancel };
}
