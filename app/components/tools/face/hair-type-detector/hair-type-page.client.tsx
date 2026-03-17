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
  HairTypeKey,
  useHairTypeAnalysis,
} from "@/app/hooks/useHairTypeAnalysis";

type HairTypeRow = {
  key: Exclude<HairTypeKey, "uncertain">;
  label: string;
  family: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  direction: string;
};

const HAIR_TYPE_ROWS: HairTypeRow[] = [
  {
    key: "1a",
    label: "Type 1A",
    family: "Straight",
    colorClass: "bg-sky-50",
    textClass: "text-sky-900",
    pattern: "Very straight with minimal visible bend and lower natural volume.",
    direction: "Use lightweight hydration and avoid heavy stylers that flatten shape.",
  },
  {
    key: "1b",
    label: "Type 1B",
    family: "Straight",
    colorClass: "bg-blue-50",
    textClass: "text-blue-900",
    pattern: "Straight pattern with slight body and subtle bend through lengths.",
    direction: "Layer volume-focused products near roots and keep moisture balanced.",
  },
  {
    key: "1c",
    label: "Type 1C",
    family: "Straight",
    colorClass: "bg-cyan-50",
    textClass: "text-cyan-900",
    pattern: "Straight-to-soft-wave behavior with thicker appearance and more texture.",
    direction: "Use smoothing plus light hold to keep definition without stiffness.",
  },
  {
    key: "2a",
    label: "Type 2A",
    family: "Wavy",
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-900",
    pattern: "Loose S-wave shape, often finer and easier to straighten.",
    direction: "Use light mousse or spray to support wave pattern and reduce limpness.",
  },
  {
    key: "2b",
    label: "Type 2B",
    family: "Wavy",
    colorClass: "bg-green-50",
    textClass: "text-green-900",
    pattern: "Clearer S-waves starting mid-length with moderate frizz tendency.",
    direction: "Pair leave-in hydration with medium hold gel for stable wave definition.",
  },
  {
    key: "2c",
    label: "Type 2C",
    family: "Wavy",
    colorClass: "bg-lime-50",
    textClass: "text-lime-900",
    pattern: "Deep wave pattern that can border loose curls with higher volume.",
    direction: "Use moisture plus stronger hold to maintain definition and control puffiness.",
  },
  {
    key: "3a",
    label: "Type 3A",
    family: "Curly",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-900",
    pattern: "Large loose curls with visible loop pattern and moderate bounce.",
    direction: "Use curl creams with balanced hold and avoid over-brushing dry hair.",
  },
  {
    key: "3b",
    label: "Type 3B",
    family: "Curly",
    colorClass: "bg-amber-50",
    textClass: "text-amber-900",
    pattern: "Springier curls with smaller diameter and stronger definition needs.",
    direction: "Combine moisture-rich styling and section-based application for consistency.",
  },
  {
    key: "3c",
    label: "Type 3C",
    family: "Curly",
    colorClass: "bg-orange-100",
    textClass: "text-orange-900",
    pattern: "Tight corkscrew curls with high density appearance and shrinkage.",
    direction: "Prioritize slip, hydration, and gentle detangling to protect curl clumps.",
  },
  {
    key: "4a",
    label: "Type 4A",
    family: "Coily",
    colorClass: "bg-rose-100",
    textClass: "text-rose-900",
    pattern: "Coily pattern with visible small S-coils and notable shrinkage.",
    direction: "Use layered moisture and low-friction handling to keep coils defined.",
  },
  {
    key: "4b",
    label: "Type 4B",
    family: "Coily",
    colorClass: "bg-fuchsia-100",
    textClass: "text-fuchsia-900",
    pattern: "Tighter zig-zag or less uniform coil pattern with high volume potential.",
    direction: "Use rich conditioners and gentle sectioning to reduce breakage risk.",
  },
  {
    key: "4c",
    label: "Type 4C",
    family: "Coily",
    colorClass: "bg-violet-100",
    textClass: "text-violet-900",
    pattern: "Very tight coil profile with substantial shrinkage and dense appearance.",
    direction: "Focus on consistent hydration, protective styling, and low-manipulation routines.",
  },
];

const FACE_EXAMPLES = [
  { id: "hair-type-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "hair-type-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "hair-type-c", label: "Example C", src: "/examples/boy-selfie.webp" },
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

function levelText(level: "low" | "medium" | "high" | "uncertain") {
  if (level === "uncertain") return "Uncertain";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function strandText(strand: "fine" | "medium" | "coarse" | "mixed" | "uncertain") {
  if (strand === "fine") return "Fine";
  if (strand === "medium") return "Medium";
  if (strand === "coarse") return "Coarse";
  if (strand === "mixed") return "Mixed";
  return "Uncertain";
}

function HairTypeConfidenceBar({ score }: { score: number }) {
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
            aria-label="Hair type confidence marker"
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

function HairTypeTable({ activeType }: { activeType: HairTypeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Hair Type
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Pattern Clues
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Care Direction
            </th>
          </tr>
        </thead>
        <tbody>
          {HAIR_TYPE_ROWS.map((row) => {
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
                    <span className="inline-flex rounded-full border border-black/10 bg-white/50 px-2 py-0.5 text-xs font-semibold text-gray-700">
                      {row.family}
                    </span>
                    {isActive ? (
                      <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-2 py-0.5 text-xs font-semibold text-gray-900">
                        Your Result
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className={[cellBase, activeCell].join(" ")}>
                  <p className="text-gray-700">{row.pattern}</p>
                  <p className="mt-1 text-sm text-gray-700 sm:hidden">{row.direction}</p>
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

function HairTypePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useHairTypeAnalysis(imageUrl, { source });

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
        <H1>Hair Type Detector</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a clear portrait to detect likely hair type (1A to 4C) with AI confidence scoring,
          pattern interpretation, and care-direction context.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/hair-type-detector" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/hair-type-detector" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Best results come from front-facing photos where hair texture is visible without hats,
              heavy filters, or strong motion blur.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for hair-type analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Hair Type Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing hair pattern...</p>
                        <p className="text-sm text-gray-600">
                          Estimating curl family, subtype, pattern tightness, and confidence.
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
                      <p className="text-4xl lg:text-5xl font-bold text-primary">{analysis.typeLabel}</p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          analysis.confidence
                        )}`}
                      >
                        {analysis.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    <p className="mt-3 text-lg text-gray-700">
                      Confidence score: <span className="font-semibold">{analysis.confidenceScore}/100</span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Family: <span className="font-semibold">{analysis.familyLabel}</span>
                      {" "}| Pattern tightness: <span className="font-semibold">{levelText(analysis.patternTightness)}</span>
                      {" "}| Strand appearance: <span className="font-semibold">{strandText(analysis.strandAppearance)}</span>
                    </p>

                    <p className="mt-1 text-sm text-gray-600">
                      Volume tendency: <span className="font-semibold">{levelText(analysis.volumeTendency)}</span>
                      {" "}| Frizz tendency: <span className="font-semibold">{levelText(analysis.frizzTendency)}</span>
                      {" "}| Shrinkage tendency: <span className="font-semibold">{levelText(analysis.shrinkageTendency)}</span>
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
              The confidence bar shows how strongly your uploaded photo matches the detected hair type.
            </p>
            <div className="mt-8">
              <HairTypeConfidenceBar score={analysis.confidenceScore} />
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Hair Type Chart (1A to 4C)</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your detected hair type and family.
          </p>
          <HairTypeTable activeType={activeType} />
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

        {analysis?.careSuggestions?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Care Suggestions</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.careSuggestions.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Hair Type Detector Works</h2>
          <p className={pClass}>
            This hair type detector is an AI appearance classifier that estimates visible curl pattern from one
            portrait image. It maps what it sees to common hair type categories (1A to 4C), then returns a
            confidence score, alternative candidates, and practical routine context.
          </p>
          <p className={pClass}>
            Because this is image-based, results can shift with lighting, humidity, product build-up, heat styling,
            brushing state, and camera angle. For trend tracking, compare photos captured under similar conditions.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Hair Type Detector vs Hair Quiz or Hair Test</h2>
          <p className={pClass}>
            A classic hair type quiz asks subjective questions. This tool is different: it uses visual pattern cues
            from your uploaded image to generate a direct AI estimate. That makes it a useful alternative when you
            want a fast second opinion before building a routine.
          </p>
          <p className={pClass}>
            The best workflow is to use both: take your visual AI result, compare it with your wash-day behavior,
            and adjust based on real-world response over multiple weeks.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Hair Type vs Texture, Density, and Porosity</h2>
          <p className={pClass}>
            Hair type describes visible pattern shape. It does not fully capture strand diameter, overall density,
            porosity behavior, scalp oil production, or chemical-treatment history. Two people with the same type
            can still need very different routines.
          </p>
          <p className={pClass}>
            Use this result as your starting point, then personalize around how your hair actually responds to
            cleansing frequency, conditioning weight, and hold level.
          </p>
          <p className={pClass}>
            If you wear extensions, matching extension texture to your detected hair type can improve blend and
            maintenance; see{" "}
            <a className="text-primary underline" href="https://www.perfectlocks.com/">
              human hair extensions
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Scan Quality</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(analysis?.retakeTips?.length
              ? analysis.retakeTips
              : [
                  "Use neutral daylight or balanced white indoor lighting.",
                  "Show visible hair texture without hats, heavy shadows, or motion blur.",
                  "Avoid strong beauty filters and extreme smoothing effects.",
                  "If possible, capture hair in its natural state instead of freshly heat-styled form.",
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
            For a fuller appearance workflow, pair this with the{" "}
            <a className="text-primary underline" href="/hair-color-detector">
              Hair Color Detector
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/skin-analyzer">
              Skin Analyzer
            </a>
            . You can also combine with{" "}
            <a className="text-primary underline" href="/face-shape-detector">
              Face Shape Detector
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/face-symmetry-test">
              Face Symmetry Test
            </a>{" "}
            for broader styling context.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Curly hair biology and structure review (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/31824224/">
                The what, why and how of curly hair: a review
              </a>
            </li>
            <li>
              Human hair morphology and curvature variation methods (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/34075066/">
                Quantifying human scalp hair fiber morphology
              </a>
            </li>
            <li>
              Population variation in hair fiber shape and pigmentation (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/26955790/">
                Human scalp hair fiber shape and pigmentation variation
              </a>
            </li>
            <li>
              Hair curvature research overview (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/24617997/">
                Hair curvature and fiber morphology review
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "hair-color-detector",
              "skin-analyzer",
              "eyebrow-type-detector",
              "eye-shape-detector",
              "nose-shape-detector",
              "face-shape-detector",
              "jawline-check",
              "face-symmetry-test",
              "golden-face-ratio-analyzer",
              "age-guesser",
              "attractiveness-test",
            ]}
            excludeSlug="hair-type-detector"
          />
        </div>
      </section>
    </main>
  );
}

const HairTypePageClient = dynamic(() => Promise.resolve(HairTypePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default HairTypePageClient;
