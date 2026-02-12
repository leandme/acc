import Script from "next/script";

export function GoogleTag() {
  return (
    <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-BGE9PDQNWQ"
            strategy="afterInteractive"
    />
  );
}
