import Script from "next/script";

export function SiteNavSchema() {
  return (
    <Script
          id="site-navigation-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: [
                "Estimate Body Fat",
                "Body Visualizer",
                "Jawline Check",
                "Skin Type Detector",
                "All Tools",
                "Examples",
                "All Guides",
              ],
              url: [
                "https://bodyfatestimator.ai/estimate",
                "https://bodyfatestimator.ai/body-visualizer",
                "https://bodyfatestimator.ai/jawline-check",
                "https://bodyfatestimator.ai/skin-type-detector",
                "https://bodyfatestimator.ai/tools",
                "https://bodyfatestimator.ai/examples",
                "https://bodyfatestimator.ai/guides",
              ],
            }),
          }}
        />
  );
}
