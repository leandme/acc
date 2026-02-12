import Script from "next/script";

export function GoogleAnalytics() {
  return (
    <Script
                id="ga-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-BGE9PDQNWQ', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
    />
  );
}
