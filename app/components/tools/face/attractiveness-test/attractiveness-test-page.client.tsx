"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import RippleLoader from "@/app/components/common/loader";
import TryExamples from "@/app/components/common/try-examples";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import {
  AttractivenessBandKey,
  useAttractivenessAnalysis,
} from "@/app/hooks/useAttractivenessAnalysis";

type AttractivenessBandRow = {
  key: Exclude<AttractivenessBandKey, "uncertain">;
  label: string;
  min: number;
  max: number;
  colorClass: string;
  textClass: string;
  summary: string;
};

const ATTRACTIVENESS_BANDS: AttractivenessBandRow[] = [
  {
    key: "very-low",
    label: "Very Low",
    min: 0,
    max: 24,
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    summary: "The image had lower aesthetic alignment under this model and capture setup.",
  },
  {
    key: "low",
    label: "Low",
    min: 25,
    max: 39,
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    summary: "The photo showed multiple cues that reduced model-based attractiveness strength.",
  },
  {
    key: "moderate",
    label: "Moderate",
    min: 40,
    max: 54,
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    summary: "A balanced middle range where positive and limiting cues were mixed.",
  },
  {
    key: "above-average",
    label: "Above Average",
    min: 55,
    max: 69,
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    summary: "The portrait showed several favorable harmony and presentation cues.",
  },
  {
    key: "high",
    label: "High",
    min: 70,
    max: 84,
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    summary: "Strong visual alignment across multiple cues increased the score.",
  },
  {
    key: "very-high",
    label: "Very High",
    min: 85,
    max: 94,
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    summary: "Very strong model-based attractiveness pattern in this image.",
  },
  {
    key: "exceptional",
    label: "Exceptional",
    min: 95,
    max: 100,
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    summary: "Top-end range under this single-photo estimate and current model assumptions.",
  },
];

const FACE_EXAMPLES = [
  { id: "attract-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "attract-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "attract-c", label: "Example C", src: "/examples/man-selfie.webp" },
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
  return (
    ATTRACTIVENESS_BANDS.find((band) => score >= band.min && score <= band.max) ?? null
  );
}

function formatBandRange(min: number, max: number) {
  return `${min}-${max}`;
}

function confidenceBandLabel(score: number) {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Low";
}

function AttractivenessInterpretationBar({ score }: { score: number }) {
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
                  #ef4444 14%,
                  #f97316 14%,
                  #f97316 28%,
                  #fde047 28%,
                  #fde047 42%,
                  #22c55e 42%,
                  #22c55e 56%,
                  #10b981 56%,
                  #10b981 70%,
                  #3b82f6 70%,
                  #3b82f6 84%,
                  #7c3aed 84%,
                  #7c3aed 100%
                )`,
              }}
            />
            <div className="absolute inset-0 bg-white/15" />
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${safeScore}%`, transform: "translateX(-50%)" }}
            aria-label="Attractiveness score marker"
            title={activeBand?.label ?? "Attractiveness score"}
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
          <span>Very Low</span>
          <span>Low</span>
          <span>Moderate</span>
          <span>Above Avg</span>
          <span>High</span>
          <span>Very High</span>
          <span>Exceptional</span>
        </div>

        {activeBand ? (
          <div className="mt-2 text-center text-[12px] font-semibold text-gray-700">
            <span className="inline-flex items-center gap-2" aria-label={`Band ${activeBand.label}`}>
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-primary" />
              {activeBand.label}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AttractivenessBandTable({ score }: { score: number | null }) {
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
              Band
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody>
          {ATTRACTIVENESS_BANDS.map((band) => {
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
                    {formatBandRange(band.min, band.max)}
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

function AttractivenessTestPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { result, loading, error } = useAttractivenessAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  const score = result?.score ?? null;
  const scoreBand = findBand(score);
  const topCues = useMemo(() => result?.positiveCues?.slice(0, 4) ?? [], [result?.positiveCues]);
  const confidenceBand = useMemo(() => {
    const value = result?.confidenceScore ?? 0;
    return confidenceBandLabel(value);
  }, [result?.confidenceScore]);

  const scoreLabel = useMemo(() => {
    if (score == null) return "No confident score";
    return `${score}/100`;
  }, [score]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Attractiveness Test</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          How attractive am I? Upload a clear portrait to get an AI attractiveness score,
          confidence rating, interpretation bar, and practical photo-quality guidance.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/attractiveness-test" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/attractiveness-test" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Best results come from a front-facing portrait, neutral expression, and even lighting.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded portrait for attractiveness analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Your Attractiveness Score</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing facial cues...</p>
                        <p className="text-sm text-gray-600">
                          Estimating image-based attractiveness from visual harmony and presentation features.
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
                      <p className="text-4xl lg:text-5xl font-bold text-primary">{scoreLabel}</p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          result.confidence
                        )}`}
                      >
                        {result.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    {scoreBand ? (
                      <p className="mt-3 text-lg text-gray-700">
                        Band: <span className={`font-semibold ${scoreBand.textClass}`}>{scoreBand.label}</span>
                      </p>
                    ) : null}

                    <p className="mt-2 text-sm text-gray-600">
                      Confidence score: <span className="font-semibold text-gray-800">{result.confidenceScore}/100</span>
                    </p>

                    {result.rationale ? (
                      <p className="mt-4 text-gray-700 leading-relaxed">{result.rationale}</p>
                    ) : null}

                    {topCues.length ? (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900">Top positive cues</h3>
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
        {typeof score === "number" ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Attractiveness Interpretation Bar</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Your score is marked on the same red-to-violet scale used across our face-analysis tools.
            </p>
            <div className="mt-8">
              <AttractivenessInterpretationBar score={score} />
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
            The highlighted row marks your current attractiveness score band.
          </p>
          <AttractivenessBandTable score={score} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This AI Attractiveness Test Works</h2>
          <p className={pClass}>
            This tool estimates perceived facial attractiveness from one image using visual cues such as
            symmetry signals, proportion balance, skin texture/clarity visibility, lighting consistency,
            and overall presentation quality.
          </p>
          <p className={pClass}>
            It returns a score, confidence, and interpretation band so you can benchmark photo sets,
            compare setups, and understand whether a result is stable enough to reuse.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How Attractive Am I? What the Score Means</h2>
          <p className={pClass}>
            The output is an appearance-based estimate, not a universal truth. It reflects how the face
            is perceived in this specific photo under this specific model. Different angles, lighting,
            expression, and camera distance can move the score up or down.
          </p>
          <p className={pClass}>
            Use the number as directional feedback for photo quality and presentation consistency,
            rather than as a fixed rating of personal worth.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What Influences the Result</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Face angle, head tilt, and camera lens distortion</li>
            <li>Lighting direction, shadow depth, and exposure</li>
            <li>Expression neutrality and eye-region clarity</li>
            <li>Grooming, hairstyle framing, and facial hair coverage</li>
            <li>Skin texture detail, makeup, filters, and retouching</li>
            <li>Image resolution, compression, and focus sharpness</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Get More Reliable Scores</h2>
          <p className={pClass}>
            Keep setup consistent: front camera at eye level, neutral expression, uniform lighting, and
            minimal post-processing. If you compare before/after photos, use the same distance,
            background, and time-of-day lighting so score changes are meaningful.
          </p>
          <p className={pClass}>
            When confidence is low, prioritize retaking the image before interpreting the number.
            Confidence is often a stronger quality signal than raw score alone.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations and Responsible Use</h2>
          <p className={pClass}>
            Attractiveness is culturally and personally subjective. AI can only approximate perceived
            cues from training data, and may reflect dataset bias, capture bias, and context limitations.
          </p>
          <p className={pClass}>
            This tool should not be used for medical, employment, legal, or identity decisions. It is a
            personal-photo analysis utility for curiosity, content workflows, and repeatable benchmarking.
          </p>
        </div>

        {result?.styleTips?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Style and Presentation Tips from Your Scan</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {result.styleTips.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {result?.retakeTips?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Retake Tips from Your Scan</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {result.retakeTips.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Little AC, Jones BC, DeBruine LM. Facial attractiveness: evolutionary based research.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21536551/">
                PubMed record
              </a>
            </li>
            <li>
              Langlois JH, Kalakanis L, Rubenstein AJ, et al. Maxims or myths of beauty? A
              meta-analytic and theoretical review.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10825783/">
                PubMed record
              </a>
            </li>
            <li>
              Zheng R, Ren D, Xie C, Pan J, Zhou G. Normality mediates the effect of symmetry on
              facial attractiveness.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/33933836/">
                PubMed record
              </a>
            </li>
            <li>
              Penton-Voak IS, Jones BC, Little AC, et al. Symmetry, sexual dimorphism in facial
              proportions and male facial attractiveness.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/11487409/">
                PubMed record
              </a>
            </li>
            <li>
              Rhodes G, Yoshikawa S, Palermo R, et al. Perceived health contributes to the
              attractiveness of facial symmetry, averageness, and sexual dimorphism.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/17972486/">
                PubMed record
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
              "face-symmetry-test",
              "face-shape-detector",
              "jawline-check",
              "age-guesser",
              "body-shape-analyzer",
              "body-shape-calculator",
              "estimate",
              "body-visualizer",
              "height-estimator",
              "calorie-counter",
            ]}
            excludeSlug="attractiveness-test"
          />
        </div>
      </section>
    </main>
  );
}

const AttractivenessTestPageClient = dynamic(
  () => Promise.resolve(AttractivenessTestPageContent),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    ),
  }
);

export default AttractivenessTestPageClient;
