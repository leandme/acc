import Script from "next/script";

export function WebsiteSchema() {
  return (
    <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Body Fat Estimator",
              alternateName: "BodyFatEstimator.ai",
              url: "https://bodyfatestimator.ai",
            }),
          }}
        />
  );
}
