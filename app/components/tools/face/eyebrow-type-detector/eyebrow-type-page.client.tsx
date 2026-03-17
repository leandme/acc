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
  EyebrowTypeKey,
  useEyebrowTypeAnalysis,
} from "@/app/hooks/useEyebrowTypeAnalysis";

type EyebrowRow = {
  key: Exclude<EyebrowTypeKey, "uncertain">;
  label: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  direction: string;
};

const EYEBROW_ROWS: EyebrowRow[] = [
  {
    key: "straight",
    label: "Straight",
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    pattern: "Low arch profile with flatter upper line and minimal apex rise.",
    direction: "Use subtle taper and light tail shaping to avoid harsh flattening.",
  },
  {
    key: "soft-angled",
    label: "Soft Angled",
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    pattern: "Gentle arch transition with rounded apex and balanced brow body.",
    direction: "Maintain soft peak placement and avoid over-sharpening the brow head.",
  },
  {
    key: "hard-angled",
    label: "Hard Angled",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    pattern: "More pronounced angular peak with stronger directional change at apex.",
    direction: "Keep the peak clean but avoid over-thinning beneath the arch.",
  },
  {
    key: "rounded",
    label: "Rounded",
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    pattern: "Smooth curved brow contour with minimal angular break.",
    direction: "Preserve curvature while maintaining balanced tail length.",
  },
  {
    key: "high-arched",
    label: "High Arched",
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    pattern: "Higher apex elevation with visible vertical lift through arch section.",
    direction: "Avoid over-lifting the arch to keep expression natural at rest.",
  },
  {
    key: "s-shaped",
    label: "S-Shaped",
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    pattern: "Subtle dual-curve pattern with contour shift before or after apex.",
    direction: "Use conservative cleanup to keep natural contour transitions intact.",
  },
  {
    key: "flat",
    label: "Flat",
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    pattern: "Very low-rise contour with minimal visible arch across the brow.",
    direction: "Light shaping and strategic fill can add balanced lift without harsh angles.",
  },
];

const FACE_EXAMPLES = [
  { id: "brow-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "brow-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "brow-c", label: "Example C", src: "/examples/boy-selfie.webp" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function confidenceBandLabel(score: number) {
  if (score >= 90) return "Very High";
  if (score >= 75) return "High";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Low";
}

function EyebrowConfidenceBar({ score }: { score: number }) {
  const safe = clamp(score, 0, 100);
  const label = confidenceBandLabel(safe);

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
            style={{ left: `${safe}%`, transform: "translateX(-50%)" }}
            aria-label="Eyebrow confidence marker"
            title={`Confidence ${safe}`}
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
          <span>Fair</span>
          <span>Good</span>
          <span>High</span>
          <span>Very High</span>
        </div>

        <div className="mt-2 text-center text-[12px] font-semibold text-gray-700">
          Confidence Band: {label}
        </div>
      </div>
    </div>
  );
}

function EyebrowTypeTable({ activeType }: { activeType: EyebrowTypeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Eyebrow Type
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Visual Pattern
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Grooming Direction
            </th>
          </tr>
        </thead>
        <tbody>
          {EYEBROW_ROWS.map((row) => {
            const isActive = activeType === row.key;
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
                  <p className="text-gray-700">{row.pattern}</p>
                  <p className="mt-1 text-sm text-gray-700 sm:hidden">
                    {row.direction}
                  </p>
                </td>
                <td
                  className={[
                    cellBase,
                    activeCell,
                    "hidden sm:table-cell text-gray-700",
                    isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                  ].join(" ")}
                >
                  {row.direction}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function EyebrowTypePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useEyebrowTypeAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const pClass = "text-lg leading-relaxed";

  const activeType = analysis?.type ?? null;
  const alternativesText = useMemo(() => {
    if (!analysis?.alternatives?.length) return null;
    return analysis.alternatives.slice(0, 2).join(" or ");
  }, [analysis?.alternatives]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Eyebrow Type Detector</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a clear portrait to detect eyebrow type with AI, confidence scoring, symmetry context,
          and grooming-oriented interpretation.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/eyebrow-type-detector" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/eyebrow-type-detector" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Best results come from front-facing portraits with visible brows, neutral expression, and even lighting.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for eyebrow-type analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Your Eyebrow Type Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing eyebrow contours...</p>
                        <p className="text-sm text-gray-600">
                          Estimating arch profile, angle transitions, thickness, and symmetry.
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

                {!loading && !error && analysis ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-4xl lg:text-5xl font-bold text-primary">
                        {analysis.typeLabel}
                      </p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          analysis.confidence
                        )}`}
                      >
                        {analysis.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    <p className="mt-3 text-lg text-gray-700">
                      Confidence score:{" "}
                      <span className="font-semibold">{analysis.confidenceScore}/100</span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Thickness: <span className="font-semibold capitalize">{analysis.thickness}</span>
                      {analysis.archHeightScore != null ? (
                        <>
                          {" "}
                          | Arch score: <span className="font-semibold">{analysis.archHeightScore}/100</span>
                        </>
                      ) : null}
                      {analysis.symmetryScore != null ? (
                        <>
                          {" "}
                          | Symmetry score: <span className="font-semibold">{analysis.symmetryScore}/100</span>
                        </>
                      ) : null}
                    </p>

                    {analysis.rationale ? (
                      <p className="mt-5 text-gray-700 leading-relaxed">{analysis.rationale}</p>
                    ) : null}

                    {alternativesText ? (
                      <p className="mt-3 text-sm text-gray-600">
                        Close alternatives: <span className="font-semibold text-gray-800">{alternativesText}</span>
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-6">
        {analysis?.confidenceScore != null ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Confidence Interpretation</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              The confidence bar shows how strongly the current photo matches the detected eyebrow type.
            </p>
            <div className="mt-8">
              <EyebrowConfidenceBar score={analysis.confidenceScore} />
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your detected eyebrow type.
          </p>
          <EyebrowTypeTable activeType={activeType} />
        </div>

        {analysis?.observationNotes?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Key Observation Notes</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.observationNotes.map((note, idx) => (
                <li key={`${note}-${idx}`}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis?.groomingSuggestions?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Grooming Suggestions</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.groomingSuggestions.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Eyebrow Type Detector Works</h2>
          <p className={pClass}>
            This eyebrow type detector estimates brow contour patterns from one portrait image. It analyzes
            arch position, angle transitions, brow body curvature, and left-right balance, then maps the
            result to a primary eyebrow type with confidence scoring.
          </p>
          <p className={pClass}>
            This is an appearance-based classification tool, not a medical diagnostic system. Lighting,
            camera angle, makeup, and hair occlusion can affect the result.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Get Better Results</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(analysis?.retakeTips?.length
              ? analysis.retakeTips
              : [
                  "Use a front-facing photo with both eyebrows fully visible.",
                  "Avoid heavy shadows across brow ridge and forehead.",
                  "Keep expression neutral and forehead relaxed.",
                  "Avoid strong beauty filters that alter brow edges.",
                ]).map((tip, idx) => (
              <li key={`${tip}-${idx}`}>{tip}</li>
            ))}
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
              Anthropometric standards of female facial soft tissue (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10686898/">
                Anthropometric facial measurements for aesthetic analysis
              </a>
            </li>
            <li>
              3D facial anthropometry and landmark reproducibility (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/22373917/">
                Three-dimensional facial landmark reliability
              </a>
            </li>
            <li>
              Review of eyebrow aesthetics and shaping principles (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/29291272/">
                Eyebrow design and aesthetic considerations
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "face-shape-detector",
              "jawline-check",
              "face-symmetry-test",
              "eye-shape-detector",
              "nose-shape-detector",
              "skin-analyzer",
              "hair-color-detector",
              "hair-type-detector",
              "golden-face-ratio-analyzer",
              "age-guesser",
              "attractiveness-test",
            ]}
            excludeSlug="eyebrow-type-detector"
          />
        </div>
      </section>
    </main>
  );
}

const EyebrowTypePageClient = dynamic(() => Promise.resolve(EyebrowTypePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default EyebrowTypePageClient;
