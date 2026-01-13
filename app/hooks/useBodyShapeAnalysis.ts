"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/app/libs/amplitude";

type State = {
  shape: string;
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

export function useBodyShapeAnalysis(imageUrl: string | null) {
  const [state, setState] = useState<State>({
    shape: "...",
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!imageUrl) return;

    let cancelled = false;

    const run = async () => {
      setState({ shape: "...", loading: true, error: null });

      try {
        const resolvedUrl = resolveToAbsoluteUrl(imageUrl);
        const response = await fetch(resolvedUrl, { cache: "no-store" });

        if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`);

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.startsWith("image/")) throw new Error(`Not an image: ${contentType}`);

        const blob = await response.blob();
        const base64WithMime = await blobToDataUrl(blob);

        const res = await fetch("/api/body-shape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64WithMime }),
        });

        const data = await res.json();

        const shapeText =
          data?.shape
            ? (Array.isArray(data.shape) ? data.shape.join(" ") : String(data.shape)).trim()
            : null;

        if (!shapeText) throw new Error("No shape returned");

        if (!cancelled) {
          trackEvent("Analyze Body Shape", { shape: shapeText });
          setState({ shape: shapeText, loading: false, error: null });
        }
      } catch (err: any) {
        console.error("Body shape error:", err);
        if (!cancelled) setState({ shape: "Error", loading: false, error: err?.message ?? "Error" });
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return state;
}
