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
                "Age Guesser",
                "Face Shape Detector",
                "Face Symmetry Test",
                "Calorie Estimator",
                "Examples",
                "All Guides",
              ],
              url: [
                "https://bodyfatestimator.ai/estimate",
                "https://bodyfatestimator.ai/age-guesser",
                "https://bodyfatestimator.ai/face-shape-detector",
                "https://bodyfatestimator.ai/face-symmetry-test",
                "https://bodyfatestimator.ai/calorie-estimator",
                "https://bodyfatestimator.ai/examples",
                "https://bodyfatestimator.ai/guides",
              ],
            }),
          }}
        />
  );
}
