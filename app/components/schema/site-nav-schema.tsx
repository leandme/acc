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
                "Home",
                "About",
                "Blog",
                "Contact",
                "Terms",
                "Privacy",
              ],
              url: [
                "https://ai-calorie-counter.com/",
                "https://ai-calorie-counter.com/about",
                "https://ai-calorie-counter.com/blog",
                "https://ai-calorie-counter.com/contact",
                "https://ai-calorie-counter.com/terms",
                "https://ai-calorie-counter.com/privacy",
              ],
            }),
          }}
        />
  );
}
