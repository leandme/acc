import Script from "next/script";

export function Ezoic() {
  return (
    <>
      <Script
        id="ezoic-privacy-min"
        strategy="beforeInteractive"
        data-cfasync="false"
        src="https://cmp.gatekeeperconsent.com/min.js"
      />
      <Script
        id="ezoic-privacy-cmp"
        strategy="beforeInteractive"
        data-cfasync="false"
        src="https://the.gatekeeperconsent.com/cmp.min.js"
      />
      <Script
        id="ezoic-header"
        strategy="beforeInteractive"
        src="https://www.ezojs.com/ezoic/sa.min.js"
      />
      <Script
        id="ezoic-standalone-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "window.ezstandalone = window.ezstandalone || {}; window.ezstandalone.cmd = window.ezstandalone.cmd || [];",
        }}
      />
      <Script
        id="ezoic-analytics"
        strategy="beforeInteractive"
        src="https://ezoicanalytics.com/analytics.js"
      />
    </>
  );
}
