// amplitude.ts
"use client";
import * as amplitude from "@amplitude/unified";

export function initAmplitude() {
  if (typeof window === "undefined") return;

  amplitude.initAll(process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY!, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });
}

export default amplitude;


// Track custom events across your app
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  amplitude.track(eventName, properties);
};
