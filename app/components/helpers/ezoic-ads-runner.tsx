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

const KNOWN_PLACEHOLDER_IDS = [109, 111, 114, 112, 113] as const;

function getOrCreateEzoicStandalone() {
  if (typeof window === "undefined") return undefined;

  if (!window.ezstandalone) {
    window.ezstandalone = { cmd: [] };
  }

  if (!window.ezstandalone.cmd) {
    window.ezstandalone.cmd = [];
  }

  return window.ezstandalone;
}

function getMountedPlaceholderIds() {
  if (typeof document === "undefined") return [] as number[];

  return KNOWN_PLACEHOLDER_IDS.filter((id) =>
    Boolean(document.getElementById(`ezoic-pub-ad-placeholder-${id}`))
  );
}

function refreshMountedPlaceholders(ez: EzoicStandalone) {
  ez.config?.({
    anchorAdExpansion: false,
    disableInterstitial: true,
    vignetteDesktop: false,
    vignetteMobile: false,
    vignetteTablet: false,
  });
  ez.setEzoicAnchorAd?.(false);

  const mounted = getMountedPlaceholderIds();
  if (!mounted.length) {
    ez.destroyPlaceholders?.(...KNOWN_PLACEHOLDER_IDS);
    return;
  }

  const mountedSet = new Set<number>(mounted);
  const unmounted = KNOWN_PLACEHOLDER_IDS.filter((id) => !mountedSet.has(id));
  if (unmounted.length) {
    ez.destroyPlaceholders?.(...unmounted);
  }

  ez.showAds?.(...mounted);
}

export function EzoicAdsRunner() {
  const pathname = usePathname();

  useEffect(() => {
    const ez = getOrCreateEzoicStandalone();
    if (!ez) return;

    const runWhenDomSettles = () => {
      if (typeof window === "undefined") return;
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          refreshMountedPlaceholders(ez);
        }, 120);
      });
    };

    // If Ezoic is already initialized, run immediately.
    if (typeof ez.showAds === "function") {
      runWhenDomSettles();
      return;
    }

    // Otherwise, queue for Ezoic init.
    ez.cmd.push(runWhenDomSettles);
  }, [pathname]);

  return null;
}
