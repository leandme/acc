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
                "Attractiveness Test",
                "Face Shape Detector",
                "Lip Shape Detector",
                "Jawline Check",
                "Face Symmetry Test",
                "Hair Type Detector",
                "Calorie Counter",
                "Examples",
                "All Guides",
              ],
              url: [
                "https://bodyfatestimator.ai/estimate",
                "https://bodyfatestimator.ai/age-guesser",
                "https://bodyfatestimator.ai/attractiveness-test",
                "https://bodyfatestimator.ai/face-shape-detector",
                "https://bodyfatestimator.ai/lip-shape-detector",
                "https://bodyfatestimator.ai/jawline-check",
                "https://bodyfatestimator.ai/face-symmetry-test",
                "https://bodyfatestimator.ai/hair-type-detector",
                "https://bodyfatestimator.ai/calorie-counter",
                "https://bodyfatestimator.ai/examples",
                "https://bodyfatestimator.ai/guides",
              ],
            }),
          }}
        />
  );
}
