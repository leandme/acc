export default function ToolExplainer() {
  return (
    <section className="mt-40">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            AI Body Fat Estimation from Photos
          </h2>

          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            BodyFatEstimator.ai is an AI tool that analyzes photos of people and
            estimates their body fat percentage. Instead of relying on formulas or
            manual measurements, it uses computer vision to evaluate visible body
            composition,
            fat distribution, and proportions directly.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed">
            Upload a photo and receive a visual body fat estimate in seconds. Unlike
            traditional body fat calculators that use fixed formulas,{" "}
            <a
              href="/guides/how-ai-body-fat-estimation-works"
              className="text-primary underline"
            >
              how AI body fat estimation works
            </a>{" "}
            focuses on how your body looks, making it especially useful for
            tracking changes over time.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.35)]">
          <div className="grid grid-cols-1 md:grid-cols-[230px_minmax(0,1fr)] gap-6 items-stretch">
            <div className="overflow-hidden rounded-2xl bg-slate-100">
              <img
                src="/examples/man-selfie.webp"
                alt="Example progress photo used for body fat estimation"
                className="h-full w-full object-cover aspect-[3/4]"
                loading="lazy"
              />
            </div>

            <div className="flex flex-col">
              <div className="w-full">
                <svg
                  viewBox="0 0 520 290"
                  className="w-full"
                  role="img"
                  aria-label="Body fat estimate preview gauge showing 12 percent"
                >
                  <defs>
                    <linearGradient
                      id="home-estimate-gauge-gradient"
                      x1="80"
                      y1="230"
                      x2="440"
                      y2="230"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#2D7FF9" />
                      <stop offset="26%" stopColor="#16C5D4" />
                      <stop offset="50%" stopColor="#3BCF4D" />
                      <stop offset="72%" stopColor="#F4C81E" />
                      <stop offset="100%" stopColor="#F24A44" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M80 230 A180 180 0 0 1 440 230"
                    fill="none"
                    stroke="url(#home-estimate-gauge-gradient)"
                    strokeWidth="24"
                    strokeLinecap="round"
                  />
                  <line x1="120" y1="145" x2="132" y2="161" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="166" y1="104" x2="173" y2="123" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="224" y1="74" x2="226" y2="95" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="294" y1="73" x2="291" y2="95" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="356" y1="103" x2="348" y2="123" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="404" y1="146" x2="390" y2="160" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />

                  <path d="M129 151 L147 156 L136 138 Z" fill="#111827" />

                  <text
                    x="260"
                    y="165"
                    textAnchor="middle"
                    className="fill-slate-900"
                    style={{ fontSize: 84, fontWeight: 700 }}
                  >
                    12
                  </text>
                  <text
                    x="320"
                    y="131"
                    textAnchor="middle"
                    className="fill-slate-900"
                    style={{ fontSize: 34, fontWeight: 700 }}
                  >
                    %
                  </text>
                  <text
                    x="260"
                    y="198"
                    textAnchor="middle"
                    className="fill-slate-500"
                    style={{ fontSize: 30, fontWeight: 500 }}
                  >
                    Body Fat Percentage
                  </text>
                </svg>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Category:</span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-semibold tracking-wide text-slate-700">
                    LEAN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">Accuracy:</span>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 font-semibold tracking-wide text-amber-800">
                    MEDIUM
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <a
                  href="/estimate"
                  className="block w-full rounded-xl bg-[#1679C4] px-5 py-3 text-center text-base sm:text-lg font-semibold text-white transition-colors hover:bg-[#1269AA]"
                >
                  Download Image
                </a>
                <a
                  href="/estimate"
                  className="block w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-base sm:text-lg font-semibold text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Estimate Again
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
