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
              "name": "AI Calorie Counter",
              "alternateName": "AI Calorie Counter",
              "url": "https://ai-calorie-counter.com",
              "logo": "https://ai-calorie-counter.com/logo.png",
              "founder": {
                "@type": "Person",
                "name": "Matt Phelps"
              }
            })
          }}
        />
  );
}
