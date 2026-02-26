"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type EzoicPlaceholderConfig = {
  id: number;
  required?: boolean;
  sizes?: string | string[];
};

type EzoicStandalone = {
  cmd: Array<() => void>;
  config?: (options: Record<string, unknown>) => void;
  setEzoicAnchorAd?: (enabled: boolean) => void;
  showAds?: (
    ...placeholders: Array<number | EzoicPlaceholderConfig>
  ) => void;
  destroyPlaceholders?: (...placeholderIds: number[]) => void;
};

declare global {
  interface Window {
    ezstandalone?: EzoicStandalone;
  }
}

const GUIDE_PLACEHOLDER_IDS = [109, 111, 114] as const;

function isGuidesPath(pathname: string | null) {
  return pathname === "/guides" || pathname?.startsWith("/guides/") === true;
}

export function EzoicAdsRunner() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ez = window.ezstandalone;
    if (!ez?.cmd) return;

    ez.cmd.push(() => {
      ez.config?.({
        anchorAdExpansion: false,
        disableInterstitial: true,
        vignetteDesktop: false,
        vignetteMobile: false,
        vignetteTablet: false,
      });
      ez.setEzoicAnchorAd?.(false);

      if (isGuidesPath(pathname)) {
        ez.showAds?.(...GUIDE_PLACEHOLDER_IDS);
        return;
      }

      ez.destroyPlaceholders?.(...GUIDE_PLACEHOLDER_IDS);
    });
  }, [pathname]);

  return null;
}
