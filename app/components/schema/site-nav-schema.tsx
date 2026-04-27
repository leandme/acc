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
                "Body Fat Visualizer",
                "Jawline Check",
                "Skin Type Detector",
                "All Tools",
                "Examples",
                "Blog",
              ],
              url: [
                "https://aicaloriecounter.ai/body-visualizer",
                "https://aicaloriecounter.ai/jawline-check",
                "https://aicaloriecounter.ai/skin-type-detector",
                "https://aicaloriecounter.ai/tools",
                "https://aicaloriecounter.ai/examples",
                "https://aicaloriecounter.ai/blog",
              ],
            }),
          }}
        />
  );
}
