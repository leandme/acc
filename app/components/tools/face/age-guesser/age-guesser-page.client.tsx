"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import RippleLoader from "@/app/components/common/loader";
import TryExamples from "@/app/components/common/try-examples";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import { AgeBandKey, useAgeGuessAnalysis } from "@/app/hooks/useAgeGuessAnalysis";

type AgeBandRow = {
  key: Exclude<AgeBandKey, "uncertain">;
  label: string;
  min: number;
  max: number;
  colorClass: string;
  textClass: string;
  summary: string;
};

const AGE_BAND_ROWS: AgeBandRow[] = [
  {
    key: "child",
    label: "Child",
    min: 0,
    max: 12,
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    summary: "Child-like facial proportions with high softness and low structural angularity.",
  },
  {
    key: "teen",
    label: "Teen",
    min: 13,
    max: 19,
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    summary: "Adolescent presentation with partial facial maturation and lower age-line visibility.",
  },
  {
    key: "young-adult",
    label: "Young Adult",
    min: 20,
    max: 34,
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    summary: "Mature facial structure with generally lower aging-marker prominence.",
  },
  {
    key: "adult",
    label: "Adult",
    min: 35,
    max: 49,
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    summary: "Stable adult morphology with increasing texture and contour definition cues.",
  },
  {
    key: "middle-aged",
    label: "Middle-Aged",
    min: 50,
    max: 64,
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    summary: "More visible age-related texture and shape transitions in common cue regions.",
  },
  {
    key: "senior",
    label: "Senior",
    min: 65,
    max: 100,
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    summary: "Higher age-marker presence in skin texture, contour depth, and facial structure changes.",
  },
];

const FACE_EXAMPLES = [
  { id: "age-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "age-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "age-c", label: "Example C", src: "/examples/man-selfie.webp" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function formatAgeRange(min: number | null, max: number | null) {
  if (min == null || max == null) return "Range unavailable";
  return `${min}-${max} years`;
}

function findBandByAge(age: number | null) {
  if (age == null) return null;
  return AGE_BAND_ROWS.find((row) => age >= row.min && age <= row.max) ?? null;
}

function AgeInterpretationBar({ age }: { age: number }) {
  const safeAge = clamp(age, 0, 100);

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="w-full px-6 pt-6 pb-5">
        <div className="relative">
          <div className="relative h-12 rounded-full overflow-hidden border border-black/10 bg-base-200 shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_rgba(0,0,0,0.16)]">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right,
                  #3b82f6 0%,
                  #3b82f6 16%,
                  #7c3aed 16%,
                  #7c3aed 32%,
                  #22c55e 32%,
                  #22c55e 48%,
                  #10b981 48%,
                  #10b981 64%,
                  #fde047 64%,
                  #fde047 80%,
                  #f97316 80%,
                  #f97316 100%
                )`,
              }}
            />
            <div className="absolute inset-0 bg-white/15" />
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${safeAge}%`, transform: "translateX(-50%)" }}
            aria-label="Age marker"
            title={`Estimated age ${safeAge}`}
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
          {[0, 10, 20, 35, 50, 65, 80, 100].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-gray-500">
          <span>Child</span>
          <span>Teen</span>
          <span>Young Adult</span>
          <span>Adult</span>
          <span>Middle-Aged</span>
          <span>Senior</span>
        </div>
      </div>
    </div>
  );
}

function AgeBandTable({ age }: { age: number | null }) {
  const activeBand = findBandByAge(age);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Age Band
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Typical Range
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody>
          {AGE_BAND_ROWS.map((row) => {
            const isActive = activeBand?.key === row.key;
            const cellBase = "px-4 py-4 align-top";
            const activeCell = isActive
              ? "border-y-4 border-gray-900"
              : "border-y border-transparent";

            return (
              <tr key={row.key} className={row.colorClass}>
                <td
                  className={[
                    cellBase,
                    activeCell,
                    isActive ? "border-l-4 border-gray-900 rounded-l-xl" : "",
                  ].join(" ")}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-semibold ${row.textClass}`}>{row.label}</span>
                    {isActive ? (
                      <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-2 py-0.5 text-xs font-semibold text-gray-900">
                        Your Result
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className={[cellBase, activeCell].join(" ")}>
                  <span className="font-medium text-gray-700">
                    {row.min}-{row.max} years
                  </span>
                  <p className="mt-1 text-sm text-gray-700 sm:hidden">{row.summary}</p>
                </td>
                <td
                  className={[
                    cellBase,
                    activeCell,
                    "hidden sm:table-cell text-gray-700",
                    isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                  ].join(" ")}
                >
                  {row.summary}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AgeGuesserPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { result, loading, error } = useAgeGuessAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  const topCues = useMemo(() => result?.cues?.slice(0, 4) ?? [], [result?.cues]);
  const confidenceBand = useMemo(() => {
    const score = result?.confidenceScore ?? 0;
    if (score >= 85) return "Very High";
    if (score >= 70) return "High";
    if (score >= 55) return "Moderate";
    if (score >= 35) return "Low";
    return "Very Low";
  }, [result?.confidenceScore]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>How Old Do I Look?</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a portrait to estimate apparent age with AI and get an age range, confidence score,
          and practical quality tips for more stable results.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/age-guesser" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/age-guesser" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Use a clear, front-facing image with even light and minimal heavy filters.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for apparent age analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Estimated Apparent Age</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing face-age cues...</p>
                        <p className="text-sm text-gray-600">
                          Estimating apparent age from visible facial features and texture patterns.
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
                        {typeof result.perceivedAge === "number"
                          ? `${result.perceivedAge}`
                          : "No confident age"}
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
                      Estimated range:{" "}
                      <span className="font-semibold">
                        {formatAgeRange(result.ageRangeMin, result.ageRangeMax)}
                      </span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Age band:{" "}
                      <span className="font-semibold text-gray-800">{result.ageBandLabel}</span>{" "}
                      | Confidence score:{" "}
                      <span className="font-semibold text-gray-800">{result.confidenceScore}/100</span>
                    </p>

                    {result.rationale ? (
                      <p className="mt-5 text-gray-700 leading-relaxed">{result.rationale}</p>
                    ) : null}

                    {topCues.length ? (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900">Top visual cues</h3>
                        <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                          {topCues.map((cue, idx) => (
                            <li key={`${cue}-${idx}`}>{cue}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-6">
        {typeof result?.perceivedAge === "number" ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Age Interpretation Bar</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Your estimated apparent age is marked on the same color language used across our tools.
            </p>
            <div className="mt-8">
              <AgeInterpretationBar age={result.perceivedAge} />
            </div>
          </div>
        ) : null}

        {typeof result?.confidenceScore === "number" ? (
          <div className="w-full max-w-3xl mx-auto mt-10">
            <p className="text-center text-sm text-gray-600">
              Confidence band: <span className="font-semibold text-gray-800">{confidenceBand}</span>
            </p>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your current estimated age band.
          </p>
          <AgeBandTable age={result?.perceivedAge ?? null} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Age Guesser Works</h2>
          <p className={pClass}>
            This AI age guesser estimates apparent age from visual facial cues only. It uses visible
            structure, skin texture, contour depth, and feature distribution to produce a likely age,
            age range, and confidence score.
          </p>
          <p className={pClass}>
            The output is appearance-based, which means it is useful for curiosity, content, and trend
            comparisons, but should not be treated as an identity or medical-age determination.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What Affects Accuracy</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Lighting quality and shadow direction</li>
            <li>Camera distance and lens distortion</li>
            <li>Expression, angle, and partial occlusion</li>
            <li>Makeup, filters, and retouching effects</li>
            <li>Image resolution and compression quality</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Your Result</h2>
          <p className={pClass}>
            Use a front-facing portrait with neutral expression, no heavy shadows, and enough detail in
            the eye and skin regions. Keep camera height near eye level and avoid strong wide-angle
            distortion.
          </p>
          <p className={pClass}>
            If confidence is low, retake the photo before interpreting the number too strictly.
            Repeatability is best when setup stays consistent.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How Old Do I Look? What The Number Means</h2>
          <p className={pClass}>
            The estimated age represents apparent age, not chronological age. Apparent age is how old
            someone looks under the conditions of this specific image. Two photos of the same person can
            produce different values if light, pose, or camera changes.
          </p>
          <p className={pClass}>
            Treat this as a directional visual estimate for fun or repeatable content workflows, not as
            a definitive statement about real age.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            AI age estimation can vary by data distribution, camera setup, and photo quality. This tool
            does not verify identity and is not designed for legal, medical, or employment decisions.
          </p>
          <p className={pClass}>
            If no clear face is visible, the result may be uncertain and confidence should be considered
            low.
          </p>
        </div>

        {result?.retakeTips?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Retake Tips From Your Scan</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {result.retakeTips.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}
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
              Rothe R, Timofte R, Van Gool L. DEX: Deep EXpectation of apparent age from a single image.
              <a
                className="text-primary underline ml-1"
                href="https://openaccess.thecvf.com/content_iccv_2015_workshops/w11/html/Rothe_DEX_Deep_EXpectation_ICCV_2015_paper.html"
              >
                ICCV Workshop paper
              </a>
            </li>
            <li>
              Ngan M, Grother P. Face Recognition Vendor Test (FRVT): Performance of age estimation algorithms.
              <a className="text-primary underline ml-1" href="https://doi.org/10.6028/NIST.IR.7995">
                NIST report
              </a>
            </li>
            <li>
              APPA-REAL dataset for apparent and real age estimation benchmarks.
              <a
                className="text-primary underline ml-1"
                href="https://chalearnlap.cvc.uab.cat/dataset/26/description/"
              >
                ChaLearn dataset page
              </a>
            </li>
            <li>
              Research overview on perceived age as a biomarker and outcome signal.
              <a
                className="text-primary underline ml-1"
                href="https://pubmed.ncbi.nlm.nih.gov/?term=perceived+age+biomarker"
              >
                PubMed search
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "golden-face-ratio-analyzer",
              "eyebrow-type-detector",
              "eye-shape-detector",
              "nose-shape-detector",
              "skin-analyzer",
              "hair-color-detector",
              "hair-type-detector",
              "face-shape-detector",
              "jawline-check",
              "face-symmetry-test",
              "attractiveness-test",
              "body-shape-analyzer",
              "body-shape-calculator",
              "estimate",
              "height-estimator",
              "calorie-counter",
              "ffmi-calculator",
            ]}
            excludeSlug="age-guesser"
          />
        </div>
      </section>
    </main>
  );
}

const AgeGuesserPageClient = dynamic(() => Promise.resolve(AgeGuesserPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default AgeGuesserPageClient;
