"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import RippleLoader from "@/app/components/common/loader";
import TryExamples from "@/app/components/common/try-examples";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import { useGoldenFaceRatioAnalysis } from "@/app/hooks/useGoldenFaceRatioAnalysis";

type GoldenBand = {
  key: string;
  label: string;
  min: number;
  max: number;
  colorClass: string;
  textClass: string;
  summary: string;
};

const GOLDEN_SCORE_BANDS: GoldenBand[] = [
  {
    key: "low",
    label: "Low Alignment",
    min: 0,
    max: 49,
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    summary: "Larger variation from golden-ratio style proportions in this image.",
  },
  {
    key: "moderate",
    label: "Moderate Alignment",
    min: 50,
    max: 64,
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    summary: "Mixed proportional alignment with some features closer to phi than others.",
  },
  {
    key: "good",
    label: "Good Alignment",
    min: 65,
    max: 79,
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    summary: "Several key facial proportions are close to the golden-ratio target.",
  },
  {
    key: "high",
    label: "High Alignment",
    min: 80,
    max: 89,
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    summary: "Most measured proportions are near the golden-ratio benchmark.",
  },
  {
    key: "very-high",
    label: "Very High Alignment",
    min: 90,
    max: 100,
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    summary: "Very close golden-ratio style alignment for this single-image estimate.",
  },
];

const FACE_EXAMPLES = [
  { id: "golden-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "golden-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "golden-c", label: "Example C", src: "/examples/boy-selfie.webp" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function findBand(score: number | null) {
  if (score == null) return null;
  return GOLDEN_SCORE_BANDS.find((band) => score >= band.min && score <= band.max) ?? null;
}

function GoldenScoreBar({ score }: { score: number }) {
  const safeScore = clamp(score, 0, 100);
  const activeBand = findBand(safeScore);

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="w-full px-6 pt-6 pb-5">
        <div className="relative">
          <div className="relative h-12 rounded-full overflow-hidden border border-black/10 bg-base-200 shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_rgba(0,0,0,0.16)]">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right,
                  #ef4444 0%,
                  #ef4444 22%,
                  #f97316 22%,
                  #f97316 42%,
                  #fde047 42%,
                  #fde047 62%,
                  #22c55e 62%,
                  #22c55e 82%,
                  #3b82f6 82%,
                  #3b82f6 100%
                )`,
              }}
            />
            <div className="absolute inset-0 bg-white/15" />
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${safeScore}%`, transform: "translateX(-50%)" }}
            aria-label="Golden ratio score marker"
            title={activeBand?.label ?? "Golden ratio score"}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid transparent",
                borderRight: "10px solid transparent",
                borderTop: "14px solid #111827",
                filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.25))",
              }}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between text-[11px] text-gray-600">
          {[0, 20, 40, 60, 80, 100].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-gray-500">
          <span>Low</span>
          <span>Moderate</span>
          <span>Good</span>
          <span>High</span>
          <span>Very High</span>
        </div>
      </div>
    </div>
  );
}

function GoldenBandTable({ score }: { score: number | null }) {
  const activeBand = findBand(score);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Score Range
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Category
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody>
          {GOLDEN_SCORE_BANDS.map((band) => {
            const isActive = activeBand?.key === band.key;
            const cellBase = "px-4 py-4 align-top";
            const activeCell = isActive
              ? "border-y-4 border-gray-900"
              : "border-y border-transparent";

            return (
              <tr key={band.key} className={band.colorClass}>
                <td
                  className={[
                    cellBase,
                    activeCell,
                    isActive ? "border-l-4 border-gray-900 rounded-l-xl" : "",
                  ].join(" ")}
                >
                  <span className="font-semibold tabular-nums text-gray-900">
                    {band.min}-{band.max}
                  </span>
                </td>
                <td className={[cellBase, activeCell].join(" ")}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-semibold ${band.textClass}`}>{band.label}</span>
                    {isActive ? (
                      <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-2 py-0.5 text-xs font-semibold text-gray-900">
                        Your Result
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-gray-700 sm:hidden">{band.summary}</p>
                </td>
                <td
                  className={[
                    cellBase,
                    activeCell,
                    "hidden sm:table-cell text-gray-700",
                    isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                  ].join(" ")}
                >
                  {band.summary}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ManualGoldenRatioCalculator() {
  const [faceLength, setFaceLength] = useState<number>(18);
  const [faceWidth, setFaceWidth] = useState<number>(11.3);
  const phi = 1.618;

  const ratio = faceLength / Math.max(faceWidth, 0.0001);
  const diffPercent = (Math.abs(ratio - phi) / phi) * 100;
  const score = clamp(Math.round(100 - diffPercent * 1.5), 0, 100);
  const activeBand = findBand(score);

  return (
    <div className="rounded-3xl border bg-white p-6 lg:p-8 shadow-sm">
      <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-center">
        Manual Golden Ratio Calculator
      </h3>
      <p className="mt-3 text-center text-gray-700">
        Enter face length and face width in the same unit to calculate ratio closeness to 1.618.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="rounded-xl border bg-base-100 p-4">
          <span className="text-sm font-semibold text-gray-700">Face Length</span>
          <input
            type="number"
            value={faceLength}
            min={1}
            step={0.1}
            onChange={(e) => setFaceLength(Number(e.target.value))}
            className="input input-bordered w-full mt-2"
          />
        </label>
        <label className="rounded-xl border bg-base-100 p-4">
          <span className="text-sm font-semibold text-gray-700">Face Width</span>
          <input
            type="number"
            value={faceWidth}
            min={1}
            step={0.1}
            onChange={(e) => setFaceWidth(Number(e.target.value))}
            className="input input-bordered w-full mt-2"
          />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        <div className="rounded-xl bg-base-200/60 p-3">
          <div className="text-xs text-gray-600">Calculated Ratio</div>
          <div className="text-lg font-semibold text-gray-900">{ratio.toFixed(3)}</div>
        </div>
        <div className="rounded-xl bg-base-200/60 p-3">
          <div className="text-xs text-gray-600">Difference From 1.618</div>
          <div className="text-lg font-semibold text-gray-900">{diffPercent.toFixed(2)}%</div>
        </div>
        <div className="rounded-xl bg-base-200/60 p-3">
          <div className="text-xs text-gray-600">Estimated Score</div>
          <div className="text-lg font-semibold text-gray-900">{score}/100</div>
        </div>
      </div>

      {activeBand ? (
        <p className="mt-4 text-center text-gray-700">
          Current manual result falls in <span className="font-semibold text-gray-900">{activeBand.label}</span>.
        </p>
      ) : null}

      <GoldenBandTable score={score} />
    </div>
  );
}

function GoldenFaceRatioPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { result, loading, error } = useGoldenFaceRatioAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  const strongestMeasurement = useMemo(() => {
    if (!result?.measurements?.length) return null;
    return result.measurements.reduce((best, row) => {
      if (!best) return row;
      const current = row.closenessScore ?? -1;
      const prev = best.closenessScore ?? -1;
      return current > prev ? row : best;
    }, result.measurements[0]);
  }, [result?.measurements]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Golden Face Ratio Analyzer</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a portrait to estimate golden-ratio style facial proportion alignment with AI, then compare
          it with a manual calculator below.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/golden-face-ratio-analyzer" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/golden-face-ratio-analyzer" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Best results usually come from a clear, front-facing image with neutral expression and even light.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded face image for golden ratio analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Golden Ratio Analysis</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing facial proportions...</p>
                        <p className="text-sm text-gray-600">
                          Estimating key facial ratio relationships and phi alignment.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="whitespace-pre-line text-red-700">{error}</p>
                  </div>
                ) : null}

                {!loading && !error && result ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-4xl lg:text-5xl font-bold text-primary">
                        {result.overallScore != null ? `${result.overallScore}/100` : "No confident score"}
                      </p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          result.confidence
                        )}`}
                      >
                        {result.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    <p className="mt-3 text-lg text-gray-700">
                      Estimated phi ratio:{" "}
                      <span className="font-semibold">
                        {result.estimatedPhiRatio != null ? result.estimatedPhiRatio.toFixed(3) : "Unavailable"}
                      </span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Difference from 1.618:{" "}
                      <span className="font-semibold text-gray-800">
                        {result.phiDifferencePercent != null ? `${result.phiDifferencePercent.toFixed(2)}%` : "Unavailable"}
                      </span>{" "}
                      | Confidence score:{" "}
                      <span className="font-semibold text-gray-800">{result.confidenceScore}/100</span>
                      {result.faceShapeHint ? (
                        <>
                          {" "}
                          | Face shape hint:{" "}
                          <span className="font-semibold text-gray-800">{result.faceShapeHint}</span>
                        </>
                      ) : null}
                    </p>

                    {result.summary ? (
                      <p className="mt-5 text-gray-700 leading-relaxed">{result.summary}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-6">
        {result?.overallScore != null ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Where Your Score Sits</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              The marker shows your current golden-ratio alignment score across interpretation bands.
            </p>
            <div className="mt-8">
              <GoldenScoreBar score={result.overallScore} />
              <GoldenBandTable score={result.overallScore} />
            </div>
          </div>
        ) : null}

        {result?.measurements?.length ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Key Measurement Ratios</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Ratio-level breakdown from the uploaded image.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                      Measurement
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                      Observed / Target
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
                      Closeness
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {result.measurements.map((row, idx) => {
                    const isStrongest =
                      strongestMeasurement &&
                      strongestMeasurement.measurement === row.measurement &&
                      strongestMeasurement.closenessScore === row.closenessScore;
                    return (
                      <tr key={`${row.measurement}-${idx}`} className={isStrongest ? "bg-primary/5" : "bg-white"}>
                        <td className={`px-4 py-4 align-top border-y ${isStrongest ? "border-primary" : "border-transparent"}`}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{row.measurement}</span>
                            {isStrongest ? (
                              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                Strongest
                              </span>
                            ) : null}
                          </div>
                          {row.note ? <p className="mt-1 text-sm text-gray-600">{row.note}</p> : null}
                        </td>
                        <td className={`px-4 py-4 align-top border-y text-gray-800 ${isStrongest ? "border-primary" : "border-transparent"}`}>
                          <span className="font-semibold">
                            {row.observedRatio != null ? row.observedRatio.toFixed(3) : "N/A"}
                          </span>{" "}
                          /{" "}
                          <span className="font-semibold">
                            {row.targetRatio != null ? row.targetRatio.toFixed(3) : "N/A"}
                          </span>
                        </td>
                        <td className={`px-4 py-4 align-top border-y hidden sm:table-cell text-gray-700 ${isStrongest ? "border-primary" : "border-transparent"}`}>
                          {row.closenessScore != null ? `${row.closenessScore}/100` : "N/A"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {result?.improvementTips?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Photo Quality Tips</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {result.improvementTips.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>Manual Golden Ratio Calculator</h2>
          <ManualGoldenRatioCalculator />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Golden Face Ratio Analyzer Works</h2>
          <p className={pClass}>
            This analyzer estimates facial proportion ratios from your portrait and compares them against
            golden-ratio style reference values. The output includes an overall score, ratio differences,
            and measurement-level closeness scores.
          </p>
          <p className={pClass}>
            This is an appearance-based estimate from one image, not a biometric identity test or medical
            assessment. Camera angle, lens distortion, expression, and lighting can all influence results.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How to Get More Stable Results</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Use a front-facing portrait with neutral expression and level head position.</li>
            <li>Keep the full face in frame with even, shadow-free lighting.</li>
            <li>Avoid wide-angle distortion by standing back and cropping instead of zooming close.</li>
            <li>Use the same photo conditions each time if you compare multiple analyses.</li>
          </ul>
        </div>
        <div className={sectionWrap}>
          <h2 className={h2Class}>Use This with Other Tools</h2>
          <p className={pClass}>
            Use this result as one signal, then run one complementary scan from the{" "}
            <a className="text-primary underline" href="/tools/face">
              Face Tools
            </a>{" "}
            page based on your goal.
          </p>
          <p className={pClass}>
            For broader progress tracking, pair with the{" "}
            <a className="text-primary underline" href="/estimate">
              Body Fat Estimator
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/body-shape-analyzer">
              Body Shape Analyzer
            </a>
            . If you want a metric-driven comparison, use{" "}
            <a className="text-primary underline" href="/body-visualizer">
              Body Visualizer
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Systematic review of golden ratio and facial attractiveness (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/35738927/">
                The Golden Ratio and Facial Aesthetics
              </a>
            </li>
            <li>
              Research update on neoclassical canons and golden ratio in facial analysis (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/36070018/">
                Neoclassical Canons and Golden Ratio in Facial Aesthetics
              </a>
            </li>
            <li>
              Clinical perspective on facial proportions and esthetic analysis (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/23477386/">
                Facial Proportions in Esthetic Treatment Planning
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "eyebrow-type-detector",
              "eye-shape-detector",
              "nose-shape-detector",
              "skin-type-detector",
              "hair-color-detector",
              "face-symmetry-test",
              "face-shape-detector",
              "attractiveness-test",
              "age-guesser",
              "body-shape-analyzer",
              "shoulder-to-waist-ratio-calculator",
            ]}
            excludeSlug="golden-face-ratio-analyzer"
          />
        </div>
      </section>
    </main>
  );
}

const GoldenFaceRatioPageClient = dynamic(() => Promise.resolve(GoldenFaceRatioPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default GoldenFaceRatioPageClient;
