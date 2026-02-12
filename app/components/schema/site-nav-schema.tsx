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
                "Examples",
                "All Guides",
              ],
              url: [
                "https://bodyfatestimator.ai/estimate",
                "https://bodyfatestimator.ai/examples",
                "https://bodyfatestimator.ai/guides",
              ],
            }),
          }}
        />
  );
}
