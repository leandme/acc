import Script from "next/script";

export function OrgSchema() {
  return (
    <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Body Fat Estimator",
              "alternateName": "BodyFatEstimator.ai",
              "url": "https://bodyfatestimator.ai",
              "logo": "https://bodyfatestimator.ai/logo.png",
              "founder": {
                "@type": "Person",
                "name": "Matt Phelps"
              }
            })
          }}
        />
  );
}
