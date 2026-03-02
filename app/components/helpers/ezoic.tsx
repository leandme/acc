export function Ezoic() {
  return (
    <>
      <script
        id="ezoic-privacy-min"
        data-cfasync="false"
        src="https://cmp.gatekeeperconsent.com/min.js"
      ></script>
      <script
        id="ezoic-privacy-cmp"
        data-cfasync="false"
        src="https://the.gatekeeperconsent.com/cmp.min.js"
      ></script>
      <script
        id="ezoic-header"
        async
        src="//www.ezojs.com/ezoic/sa.min.js"
      ></script>
      <script
        id="ezoic-standalone-init"
        dangerouslySetInnerHTML={{
          __html:
            "window.ezstandalone = window.ezstandalone || {}; window.ezstandalone.cmd = window.ezstandalone.cmd || [];",
        }}
      ></script>
      <script
        id="ezoic-analytics"
        src="https://ezoicanalytics.com/analytics.js"
      ></script>
    </>
  );
}
