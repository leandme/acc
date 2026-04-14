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
  SkinTypeKey,
  useSkinTypeAnalysis,
} from "@/app/hooks/useSkinTypeAnalysis";

type SkinTypeRow = {
  key: Exclude<SkinTypeKey, "uncertain">;
  label: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  direction: string;
};

type SkinToneDepthKey =
  | "very-fair"
  | "fair-light"
  | "light-medium"
  | "medium"
  | "tan-olive"
  | "deep"
  | "very-deep";

type SkinToneRow = {
  key: SkinToneDepthKey;
  label: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  direction: string;
};

const SKIN_TYPE_ROWS: SkinTypeRow[] = [
  {
    key: "normal",
    label: "Normal",
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    pattern: "Balanced oil and hydration with relatively even surface texture.",
    direction: "Use a maintenance routine with gentle cleansing, moisturizer, and daily SPF.",
  },
  {
    key: "combination",
    label: "Combination",
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    pattern: "Oilier T-zone with drier or balanced cheeks and mixed pore visibility.",
    direction: "Use zone-based products: lighter hydration in T-zone and richer support on dry areas.",
  },
  {
    key: "oily",
    label: "Oily",
    colorClass: "bg-cyan-50",
    textClass: "text-cyan-800",
    pattern: "Higher shine and sebum production, often with more visible pores.",
    direction: "Prefer lightweight non-comedogenic products and avoid over-stripping cleansers.",
  },
  {
    key: "dry",
    label: "Dry",
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    pattern: "Lower surface oil with tighter-feeling texture and possible flaking.",
    direction: "Prioritize barrier-supportive moisturizers and reduce harsh cleansing frequency.",
  },
  {
    key: "dehydrated",
    label: "Dehydrated",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    pattern: "Water-deficient appearance that can coexist with oily, dry, or normal skin.",
    direction: "Add humectants and hydration layers, then seal with barrier-supportive products.",
  },
  {
    key: "sensitive",
    label: "Sensitive",
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    pattern: "Higher visible reactivity signals such as redness or irritation tendency.",
    direction: "Keep routine minimal, avoid aggressive actives at first, and patch-test new products.",
  },
];

const SKIN_TONE_ROWS: SkinToneRow[] = [
  {
    key: "very-fair",
    label: "Very Fair",
    colorClass: "bg-slate-50",
    textClass: "text-slate-800",
    pattern: "Very light skin depth with low visible melanin concentration in the photo.",
    direction: "High-SPF daily sun protection is especially important for photodamage prevention.",
  },
  {
    key: "fair-light",
    label: "Fair / Light",
    colorClass: "bg-amber-50",
    textClass: "text-amber-800",
    pattern: "Light tone depth with moderate contrast between highlights and shadows.",
    direction: "Use broad-spectrum SPF and gradual actives to avoid barrier irritation.",
  },
  {
    key: "light-medium",
    label: "Light-Medium",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    pattern: "Balanced light-to-medium depth with moderate pigmentation expression.",
    direction: "Prioritize tone-evenness support and consistent UV protection over harsh exfoliation.",
  },
  {
    key: "medium",
    label: "Medium",
    colorClass: "bg-orange-100",
    textClass: "text-orange-900",
    pattern: "Mid-depth tone with stable melanin expression under neutral lighting.",
    direction: "Target discoloration management with gentle brightening and daily sunscreen.",
  },
  {
    key: "tan-olive",
    label: "Tan / Olive",
    colorClass: "bg-lime-100",
    textClass: "text-lime-900",
    pattern: "Deeper tan-to-olive profile with stronger undertone influence.",
    direction: "Choose sunscreen formulas that blend well to improve daily consistency.",
  },
  {
    key: "deep",
    label: "Deep",
    colorClass: "bg-amber-200",
    textClass: "text-amber-950",
    pattern: "Deep skin depth with higher visible melanin content.",
    direction: "Protect barrier and tone evenness with photoprotection and non-irritating actives.",
  },
  {
    key: "very-deep",
    label: "Very Deep",
    colorClass: "bg-amber-300",
    textClass: "text-amber-950",
    pattern: "Very deep tone with strong pigment richness in even light.",
    direction: "Focus on barrier-safe routines and hyperpigmentation prevention through UV control.",
  },
];

const FACE_EXAMPLES = [
  { id: "skin-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "skin-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "skin-c", label: "Example C", src: "/examples/man-selfie.webp" },
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

function undertoneLabel(undertone: "warm" | "cool" | "neutral" | "olive" | "mixed" | "uncertain") {
  if (undertone === "uncertain") return "Uncertain";
  return undertone.charAt(0).toUpperCase() + undertone.slice(1);
}

function skinToneDepthLabel(
  toneDepth:
    | "very-fair"
    | "fair-light"
    | "light-medium"
    | "medium"
    | "tan-olive"
    | "deep"
    | "very-deep"
    | "uncertain"
) {
  if (toneDepth === "very-fair") return "Very Fair";
  if (toneDepth === "fair-light") return "Fair / Light";
  if (toneDepth === "light-medium") return "Light-Medium";
  if (toneDepth === "medium") return "Medium";
  if (toneDepth === "tan-olive") return "Tan / Olive";
  if (toneDepth === "deep") return "Deep";
  if (toneDepth === "very-deep") return "Very Deep";
  return "Uncertain";
}

function SkinConfidenceBar({ score }: { score: number }) {
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
            aria-label="Skin confidence marker"
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

function SkinTypeTable({ activeType }: { activeType: SkinTypeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Skin Type
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Visual Pattern
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Care Direction
            </th>
          </tr>
        </thead>
        <tbody>
          {SKIN_TYPE_ROWS.map((row) => {
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

function SkinToneTable({
  activeTone,
}: {
  activeTone:
    | "very-fair"
    | "fair-light"
    | "light-medium"
    | "medium"
    | "tan-olive"
    | "deep"
    | "very-deep"
    | "uncertain"
    | null;
}) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Tone Depth
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Appearance Pattern
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Practical Direction
            </th>
          </tr>
        </thead>
        <tbody>
          {SKIN_TONE_ROWS.map((row) => {
            const isActive = activeTone === row.key;
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

function SkinAnalyzerPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useSkinTypeAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const pClass = "text-lg leading-relaxed";

  const activeType = analysis?.type ?? null;
  const activeTone = analysis?.skinToneDepth ?? null;

  const alternativesText = useMemo(() => {
    if (!analysis?.alternatives?.length) return null;
    return analysis.alternatives.slice(0, 2).join(" or ");
  }, [analysis?.alternatives]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Skin Analyzer</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a clear face photo to analyze skin type, tone depth, undertone, hydration cues,
          and practical skincare direction using AI.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/skin-analyzer" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/skin-analyzer" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Best results come from makeup-light photos with even lighting and visible forehead,
              nose, cheeks, and chin.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for skin analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Skin Analysis Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing skin profile...</p>
                        <p className="text-sm text-gray-600">
                          Estimating skin type, tone depth, undertone, hydration pattern, and barrier cues.
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
                      Tone depth: <span className="font-semibold">{skinToneDepthLabel(analysis.skinToneDepth)}</span>
                      {" "}| Undertone: <span className="font-semibold">{undertoneLabel(analysis.undertone)}</span>
                      {" "}| Tone evenness: <span className="font-semibold">{levelText(analysis.toneEvenness)}</span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Sebum: <span className="font-semibold">{levelText(analysis.sebumLevel)}</span>
                      {" "}| Hydration: <span className="font-semibold">{levelText(analysis.hydrationLevel)}</span>
                      {" "}| Pores: <span className="font-semibold">{levelText(analysis.poreVisibility)}</span>
                      {" "}| Redness: <span className="font-semibold">{levelText(analysis.rednessLevel)}</span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Pigmentation visibility: <span className="font-semibold">{levelText(analysis.pigmentationVisibility)}</span>
                      {" "}| Texture uniformity: <span className="font-semibold">{levelText(analysis.textureUniformity)}</span>
                      {" "}| Barrier support estimate: <span className="font-semibold">{levelText(analysis.barrierSupport)}</span>
                    </p>

                    {analysis.rationale ? (
                      <p className="mt-5 text-gray-700 leading-relaxed">{analysis.rationale}</p>
                    ) : null}

                    {analysis.colorRationale ? (
                      <p className="mt-3 text-gray-700 leading-relaxed">{analysis.colorRationale}</p>
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
              The confidence bar reflects how strongly the current image matches the detected skin profile.
            </p>
            <div className="mt-8">
              <SkinConfidenceBar score={analysis.confidenceScore} />
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Skin Type Fits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your detected primary skin-type category.
          </p>
          <SkinTypeTable activeType={activeType} />
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Skin Tone Depth Fits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your detected skin-tone depth category.
          </p>
          <SkinToneTable activeTone={activeTone} />
        </div>

        {analysis ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Skin Coloring Snapshot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-gray-500">Undertone</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{undertoneLabel(analysis.undertone)}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-gray-500">Tone Depth</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{skinToneDepthLabel(analysis.skinToneDepth)}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-gray-500">Tone Evenness</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{levelText(analysis.toneEvenness)}</p>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <p className="text-sm text-gray-500">Pigmentation Visibility</p>
                <p className="text-xl font-semibold text-gray-900 mt-1">{levelText(analysis.pigmentationVisibility)}</p>
              </div>
            </div>
          </div>
        ) : null}

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
            <h2 className={h2Class}>Routine Direction Based on Your Scan</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.careSuggestions.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Skin Analyzer Measures</h2>
          <p className={pClass}>
            This skin analyzer estimates visible skin behavior from one portrait image. It evaluates shine
            distribution, hydration cues, pore visibility, texture uniformity, redness patterns, tone evenness,
            and color-depth signals, then maps those cues to likely skin categories.
          </p>
          <p className={pClass}>
            The output is an appearance-based planning aid for skincare and product selection. It is not
            a diagnosis, and results can shift with lighting, camera settings, climate, sleep, makeup,
            current products, and recent irritation.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use Skin Type and Skin Coloring Together</h2>
          <p className={pClass}>
            Skin type tells you how your skin behaves (oil, hydration, reactivity). Skin coloring metrics
            tell you how tone and undertone appear in the current image. Combine both for better decisions:
            type for routine structure, and coloring for product shades and irritation-safe brightening strategy.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>
              <span className="font-semibold">Type first:</span> build cleanser, moisturizer, and SPF around
              your primary type.
            </li>
            <li>
              <span className="font-semibold">Tone/undertone second:</span> choose cosmetic shades and avoid
              products that create visible cast.
            </li>
            <li>
              <span className="font-semibold">Evenness and pigmentation:</span> use gradual routines and daily
              sun protection before increasing active intensity.
            </li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What Each Skin Type Usually Means</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li><span className="font-semibold">Normal:</span> balanced oil/water profile and generally stable tolerance.</li>
            <li><span className="font-semibold">Combination:</span> mixed oil behavior by region, often oily T-zone with drier cheeks.</li>
            <li><span className="font-semibold">Oily:</span> stronger sebum production and persistent shine through the day.</li>
            <li><span className="font-semibold">Dry:</span> lower oil support and tighter texture, especially after cleansing.</li>
            <li><span className="font-semibold">Dehydrated:</span> water-deficient state that can occur with any base skin type.</li>
            <li><span className="font-semibold">Sensitive:</span> higher reactivity profile and lower tolerance for aggressive formulas.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Skin Analyzer Accuracy</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(analysis?.retakeTips?.length
              ? analysis.retakeTips
              : [
                  "Use front-facing daylight or neutral white light.",
                  "Avoid heavy foundation, beauty filters, and smoothing effects.",
                  "Keep forehead, nose, cheeks, and chin visible with minimal occlusion.",
                  "Use a recent photo on relatively clean skin before rich occlusives.",
                ]).map((tip, idx) => (
              <li key={`${tip}-${idx}`}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations and Safety Notes</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>This tool does not diagnose skin disease and should not replace professional care.</li>
            <li>Medical concerns such as persistent rashes, severe acne, or suspicious lesions require a clinician.</li>
            <li>Photo quality strongly affects confidence and category stability.</li>
            <li>If results are low-confidence, retake with neutral light and no beauty filters.</li>
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
              American Academy of Dermatology guidance on understanding skin type:
              <a className="text-primary underline ml-1" href="https://www.aad.org/public/everyday-care/skin-care-basics/dry/skin-type">
                AAD Skin Type Basics
              </a>
            </li>
            <li>
              DermNet overview of dry skin patterns and barrier context:
              <a className="text-primary underline ml-1" href="https://dermnetnz.org/topics/dry-skin">
                DermNet Dry Skin
              </a>
            </li>
            <li>
              DermNet overview of oily skin and sebum-related presentation:
              <a className="text-primary underline ml-1" href="https://dermnetnz.org/topics/oily-skin">
                DermNet Oily Skin
              </a>
            </li>
            <li>
              Review on Fitzpatrick skin phototype and pigmentation context:
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/books/NBK557626/">
                Fitzpatrick Skin Type (NCBI Bookshelf)
              </a>
            </li>
            <li>
              PubMed research index on skin barrier and stratum corneum function:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/?term=stratum+corneum+barrier+function">
                Skin Barrier Research Search
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
              "hair-type-detector",
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
            excludeSlug="skin-analyzer"
          />
        </div>
      </section>
    </main>
  );
}

const SkinAnalyzerPageClient = dynamic(() => Promise.resolve(SkinAnalyzerPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default SkinAnalyzerPageClient;
