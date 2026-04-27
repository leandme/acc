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
                "https://aicaloriecounter.ai/",
                "https://aicaloriecounter.ai/about",
                "https://aicaloriecounter.ai/blog",
                "https://aicaloriecounter.ai/contact",
                "https://aicaloriecounter.ai/terms",
                "https://aicaloriecounter.ai/privacy",
              ],
            }),
          }}
        />
  );
}
