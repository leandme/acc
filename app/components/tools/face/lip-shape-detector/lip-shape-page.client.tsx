"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import RippleLoader from "@/app/components/common/loader";
import TryExamples from "@/app/components/common/try-examples";
import FaqSection, { type FaqSectionItem } from "@/app/components/common/faq-section";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import {
  LipShapeKey,
  useLipShapeAnalysis,
} from "@/app/hooks/useLipShapeAnalysis";

type LipShapeRow = {
  key: Exclude<LipShapeKey, "uncertain">;
  label: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  direction: string;
};

type LipShapeVisual = {
  id: string;
  title: string;
  src: string;
  description: string;
  shapeKey?: LipShapeRow["key"];
};

const LIP_SHAPE_ROWS: LipShapeRow[] = [
  {
    key: "full",
    label: "Full",
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    pattern: "Upper and lower lips both show higher vermilion fullness.",
    direction: "Soft edge definition and balanced liner placement usually work well.",
  },
  {
    key: "thin",
    label: "Thin",
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    pattern: "Lower overall vermilion height with a narrower lip profile.",
    direction: "Subtle overline and mid-lip highlight can increase apparent fullness.",
  },
  {
    key: "top-heavy",
    label: "Top-Heavy",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    pattern: "Upper lip appears fuller than lower lip.",
    direction: "Bottom-lip brightness and center gloss can restore visual balance.",
  },
  {
    key: "bottom-heavy",
    label: "Bottom-Heavy",
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    pattern: "Lower lip appears fuller than upper lip.",
    direction: "Upper-lip edge definition can improve upper-lower proportion.",
  },
  {
    key: "heart-shaped",
    label: "Heart-Shaped",
    colorClass: "bg-rose-50",
    textClass: "text-rose-800",
    pattern: "More defined cupid's bow with central upper-lip emphasis.",
    direction: "Keep cupid's bow detail crisp and avoid over-rounding the center.",
  },
  {
    key: "wide",
    label: "Wide",
    colorClass: "bg-cyan-50",
    textClass: "text-cyan-800",
    pattern: "Commissure-to-commissure width appears larger relative to midface.",
    direction: "Focused center color can avoid over-extending horizontal width.",
  },
  {
    key: "round",
    label: "Round",
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    pattern: "Softer, curved border transitions with less angular edge definition.",
    direction: "Sharper border definition can add structure without over-darkening.",
  },
  {
    key: "downturned",
    label: "Downturned",
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    pattern: "Mouth corners trend lower at rest compared with the center line.",
    direction: "Corner-lift shading and controlled upper-edge lift can neutralize droop.",
  },
];

const LIP_SHAPE_VISUALS: LipShapeVisual[] = [
  {
    id: "full-lips",
    title: "Full Lips",
    src: "/tools/lip-shape-detector/full-lips.png",
    description:
      "Both lips appear fuller with prominent vermilion. This shape usually supports soft gradients and balanced definition.",
    shapeKey: "full",
  },
  {
    id: "thin-lips",
    title: "Thin Lips",
    src: "/tools/lip-shape-detector/thin-lips.png",
    description:
      "Lower vermilion height with a slimmer profile. Gentle overline and center highlight can add apparent volume.",
    shapeKey: "thin",
  },
  {
    id: "top-heavy-lips",
    title: "Top-Heavy Lips",
    src: "/tools/lip-shape-detector/top-heavy-lips.png",
    description:
      "Upper lip reads fuller than lower lip. Lower-lip brightness and center detail can visually rebalance proportions.",
    shapeKey: "top-heavy",
  },
  {
    id: "bottom-heavy-lips",
    title: "Bottom-Heavy Lips",
    src: "/tools/lip-shape-detector/bottom-heavy-lips.png",
    description:
      "Lower lip volume is more dominant. Slight upper-edge definition can improve top-to-bottom symmetry.",
    shapeKey: "bottom-heavy",
  },
  {
    id: "heart-shaped-lips",
    title: "Heart-Shaped Lips",
    src: "/tools/lip-shape-detector/heart-shaped-lips.png",
    description:
      "Defined cupid's bow and central upper-lip focus. Precision around the bow keeps this shape crisp.",
    shapeKey: "heart-shaped",
  },
  {
    id: "wide-lips",
    title: "Wide Lips",
    src: "/tools/lip-shape-detector/wide-lips.png",
    description:
      "Commissure-to-commissure width is more prominent. Center-focused color can avoid excess horizontal emphasis.",
    shapeKey: "wide",
  },
  {
    id: "round-lips",
    title: "Round Lips",
    src: "/tools/lip-shape-detector/round-lips.png",
    description:
      "Softer curved borders with less angular definition. Structured edge work can add shape clarity.",
    shapeKey: "round",
  },
  {
    id: "bow-shaped-lips",
    title: "Bow-Shaped Lips",
    src: "/tools/lip-shape-detector/bow-shaped-lips.png",
    description:
      "Pronounced upper-lip center contour resembling a bow. Keep liner clean around the cupid's bow peaks.",
    shapeKey: "heart-shaped",
  },
  {
    id: "asymmetrical-lips",
    title: "Asymmetrical Lips",
    src: "/tools/lip-shape-detector/asymmetrical-lips.png",
    description:
      "Left-right or upper-lower differences are visible. Controlled corner and edge placement helps create balance.",
  },
];

const FACE_EXAMPLES = [
  { id: "lip-a", label: "Example A", src: "/tools/lip-shape-detector/lip-shape-example.jpg" },
  { id: "lip-b", label: "Example B", src: "/tools/eye-shape-detector/eyes-example-3.jpg" },
  { id: "lip-c", label: "Example C", src: "/tools/eye-shape-detector/eye-example-2.jpg" },
  { id: "lip-d", label: "Example D", src: "/tools/eye-shape-detector/eye-example-4.jpg" },
];

const LIP_SHAPE_FAQS: FaqSectionItem[] = [
  {
    question: "What is a lip shape detector?",
    answer:
      "A lip shape detector is an AI tool that estimates your lip-shape pattern from one photo. It looks at upper-lower lip balance, cupid's bow structure, mouth width tendency, and overall contour cues.",
  },
  {
    question: "How accurate are lip-shape results from one image?",
    answer:
      "Results are appearance-based estimates, not exact measurements. Accuracy is best when your photo is straight-on, well-lit, and free from heavy shadows or strong beauty filters.",
  },
  {
    question: "What photo gives the best lip-shape scan?",
    answer: (
      <ul className="list-disc pl-6 space-y-1">
        <li>Front-facing portrait with both lip corners visible</li>
        <li>Neutral expression (no strong smile, pout, or lip compression)</li>
        <li>Even lighting with minimal gloss glare</li>
        <li>No hands, hair, masks, or objects covering the mouth area</li>
      </ul>
    ),
  },
  {
    question: "Can lipstick or overlining affect the result?",
    answer:
      "Yes. Bold liner, strong overlining, and high-shine gloss can shift the detected border and fullness cues. For a cleaner baseline, upload a photo with minimal lip product.",
  },
  {
    question: "What is the difference between lip shape and lip volume?",
    answer:
      "Lip shape refers to structural pattern, like cupid's bow definition, corner tilt, and upper-lower balance. Lip volume is fullness level. You can have the same shape pattern with different fullness.",
  },
  {
    question: "Why does the tool show confidence levels?",
    answer:
      "Confidence reflects image clarity and landmark certainty. A medium or low confidence result means you should retest with better angle, lighting, and less occlusion before using the output for decisions.",
  },
  {
    question: "Can this tool diagnose a medical condition?",
    answer:
      "No. This is a visual appearance tool for styling and self-understanding. It is not medical advice and cannot diagnose health, dental, or neurological conditions.",
  },
  {
    question: "Is my uploaded image stored?",
    answer: (
      <>
        Image handling follows the current site policy. For details on storage and retention, review the {" "}
        <a className="text-primary underline" href="/privacy">Privacy Policy</a>.
      </>
    ),
  },
];

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function LipShapeTable({ activeShape }: { activeShape: LipShapeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Lip Shape
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Visual Pattern
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Styling Direction
            </th>
          </tr>
        </thead>
        <tbody>
          {LIP_SHAPE_ROWS.map((row) => {
            const isActive = activeShape === row.key;
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

function formatBalanceLabel(value: string) {
  if (value === "upper-dominant") return "Upper dominant";
  if (value === "lower-dominant") return "Lower dominant";
  if (value === "balanced") return "Balanced";
  return "Uncertain";
}

function formatCupidBowLabel(value: string) {
  if (value === "defined") return "Defined";
  if (value === "soft") return "Soft";
  if (value === "flat") return "Flat";
  return "Uncertain";
}

function formatWidthLabel(value: string) {
  if (value === "narrow") return "Narrow";
  if (value === "balanced") return "Balanced";
  if (value === "wide") return "Wide";
  return "Uncertain";
}

function LipShapePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useLipShapeAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const pClass = "text-lg leading-relaxed";

  const activeShape = analysis?.shape ?? null;

  const alternativesText = useMemo(() => {
    if (!analysis?.alternatives?.length) return null;
    return analysis.alternatives.slice(0, 2).join(" or ");
  }, [analysis?.alternatives]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Lip Shape Detector</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a clear portrait to detect your lip shape with AI, including upper-lower lip balance,
          cupid's bow definition, width tendency, and confidence scoring.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/lip-shape-detector" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/lip-shape-detector" examples={FACE_EXAMPLES} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for lip-shape analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Lip Shape Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing lip morphology...</p>
                        <p className="text-sm text-gray-600">
                          Estimating lip-shape pattern, upper-lower balance, cupid's bow definition, and width cues.
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
                      <p className="text-4xl lg:text-5xl font-bold text-primary">{analysis.shapeLabel}</p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          analysis.confidence
                        )}`}
                      >
                        {analysis.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    <p className="mt-3 text-lg text-gray-700">
                      Upper-Lower Balance:{" "}
                      <span className="font-semibold">{formatBalanceLabel(analysis.upperLowerBalance)}</span>
                      {" "}| Cupid's Bow:{" "}
                      <span className="font-semibold">{formatCupidBowLabel(analysis.cupidBowDefinition)}</span>
                      {" "}| Width:{" "}
                      <span className="font-semibold">{formatWidthLabel(analysis.mouthWidthCategory)}</span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Confidence: <span className="font-semibold">{analysis.confidenceScore}/100</span>
                      {analysis.symmetryScore != null ? (
                        <>
                          {" "}| Symmetry: <span className="font-semibold">{analysis.symmetryScore}/100</span>
                        </>
                      ) : null}
                      {analysis.fullnessScore != null ? (
                        <>
                          {" "}| Fullness: <span className="font-semibold">{analysis.fullnessScore}/100</span>
                        </>
                      ) : null}
                    </p>

                    {analysis.rationale ? (
                      <p className="mt-5 text-gray-700 leading-relaxed">{analysis.rationale}</p>
                    ) : null}

                    {alternativesText ? (
                      <p className="mt-3 text-sm text-gray-600">
                        Close alternatives:{" "}
                        <span className="font-semibold text-gray-800">{alternativesText}</span>
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
        <div className="w-full max-w-5xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
          <h2 className={h2Class}>How To Use Lip Shape Detector</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                1
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Upload a Clear Portrait</h3>
              <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                Use a front-facing image with visible lip borders and neutral expression so the detector can
                read shape cues accurately.
              </p>
            </article>
            <article className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                2
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Run AI Analysis</h3>
              <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                The model evaluates lip contour, upper-lower balance, cupid's bow shape, and mouth width
                signals from your image.
              </p>
            </article>
            <article className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                3
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Interpret and Apply</h3>
              <p className="mt-3 text-gray-700 text-lg leading-relaxed">
                Use your detected type, confidence score, and table match to guide makeup, styling, and photo
                setup decisions.
              </p>
            </article>
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20" id="what-is-my-lip-shape">
          <h2 className={h2Class}>What Is My Lip Shape?</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks the detected primary lip-shape category.
          </p>
          <LipShapeTable activeShape={activeShape} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Common Lip Shapes</h2>
          <p className="text-lg text-gray-700 text-center">
            Use these visual references to understand how each lip-shape pattern typically appears.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LIP_SHAPE_VISUALS.map((item) => {
              const isMatch = analysis?.shape != null && item.shapeKey === analysis.shape;

              return (
                <article
                  key={item.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${
                    isMatch ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                >
                  <div className="w-full overflow-hidden rounded-xl bg-gray-100">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-auto object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    {isMatch ? (
                      <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        Matches Your Result
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-lg text-gray-700 leading-relaxed">{item.description}</p>
                </article>
              );
            })}
          </div>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Why Knowing Your Lip Shape Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <article className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900">Better Makeup Placement</h3>
              <p className="mt-3 text-lg text-gray-700 leading-relaxed">
                Lip-shape context helps with liner placement, center highlight strategy, and corner correction,
                so you can enhance definition without overcorrecting natural structure.
              </p>
            </article>
            <article className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900">More Consistent Photos</h3>
              <p className="mt-3 text-lg text-gray-700 leading-relaxed">
                Understanding your pattern can improve pose and expression consistency across photos, especially
                when testing product looks or tracking style changes.
              </p>
            </article>
            <article className="rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900">Stronger Face Analysis Context</h3>
              <p className="mt-3 text-lg text-gray-700 leading-relaxed">
                Lip shape is one part of facial harmony. Pairing this with {" "}
                <a href="/face-shape-detector" className="text-primary underline">Face Shape Detector</a> and {" "}
                <a href="/eye-shape-detector" className="text-primary underline">Eye Shape Detector</a> can provide
                a broader styling context.
              </p>
            </article>
          </div>
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

        {analysis?.styleSuggestions?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Style Suggestions</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.styleSuggestions.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Lip Shape Detector Works</h2>
          <p className={pClass}>
            This detector estimates lip-shape geometry from one portrait image by mapping key mouth-region cues:
            vermilion contour pattern, upper-lower balance, cupid's bow definition, and width tendency. The output
            is a non-medical appearance estimate built for styling context.
          </p>
          <p className={pClass}>
            Results can shift with expression, lipstick overdraw, gloss reflections, angle, and lighting. For the
            most useful comparisons, keep photo setup consistent across scans and treat results as directional.
          </p>
          <p className={pClass}>
            For wider facial proportion context, compare this result with {" "}
            <a className="text-primary underline" href="/golden-face-ratio-analyzer">Golden Face Ratio Analyzer</a>{" "}
            and face-structure tools.
          </p>
        </div>

        <div className={sectionWrap} id="lip-shape-confidence-guide">
          <h2 className={h2Class}>Result Confidence Guide</h2>
          <p className="text-lg text-gray-700 text-center">
            Confidence indicates how clearly the model could resolve lip landmarks from your image.
          </p>
          <div className="overflow-hidden rounded-2xl border bg-base-100">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">Band</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">Score Range</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Interpretation</th>
                </tr>
              </thead>
              <tbody>
                <tr className={analysis?.confidence === "high" ? "bg-green-50" : "bg-white"}>
                  <td className="px-4 py-4 border-y border-gray-100">
                    <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">HIGH</span>
                  </td>
                  <td className="px-4 py-4 border-y border-gray-100 text-gray-700">75-100</td>
                  <td className="px-4 py-4 border-y border-gray-100 text-gray-700">
                    Lip borders and corners were clear. This result is usually stable under similar photo conditions.
                  </td>
                </tr>
                <tr className={analysis?.confidence === "medium" ? "bg-yellow-50" : "bg-white"}>
                  <td className="px-4 py-4 border-y border-gray-100">
                    <span className="inline-flex rounded-full border border-yellow-200 bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">MEDIUM</span>
                  </td>
                  <td className="px-4 py-4 border-y border-gray-100 text-gray-700">45-74</td>
                  <td className="px-4 py-4 border-y border-gray-100 text-gray-700">
                    Main features are visible but some cues were ambiguous. Retesting can improve certainty.
                  </td>
                </tr>
                <tr className={analysis?.confidence === "low" ? "bg-red-50" : "bg-white"}>
                  <td className="px-4 py-4 border-y border-gray-100">
                    <span className="inline-flex rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">LOW</span>
                  </td>
                  <td className="px-4 py-4 border-y border-gray-100 text-gray-700">0-44</td>
                  <td className="px-4 py-4 border-y border-gray-100 text-gray-700">
                    Important lip landmarks were unclear (angle, blur, reflections, occlusion). Upload a cleaner photo.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Scan Quality</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(analysis?.retakeTips?.length
              ? analysis.retakeTips
              : [
                  "Use a straight-on portrait with relaxed lips and neutral expression.",
                  "Avoid strong gloss glare and heavy lip overdraw for baseline scans.",
                  "Keep the full mouth region unobstructed by hair, hands, or filters.",
                  "Use even, front-facing light to keep lip borders clearly visible.",
                  "Avoid tilted camera angles that distort width and corner position.",
                ]).map((tip, idx) => (
              <li key={`${tip}-${idx}`}>{tip}</li>
            ))}
          </ul>
        </div>

        <FaqSection
          heading="FAQs"
          description="Common questions about AI lip-shape detection, accuracy, and result interpretation."
          items={LIP_SHAPE_FAQS}
          accordionName="lip-shape-detector-faq-accordion"
          className="pt-10 pb-10 lg:pt-20 lg:pb-20"
        />

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Labial morphology and 3D anthropometric methods (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/19686918/">
                Labial Morphology: A 3-Dimensional Anthropometric Study
              </a>
            </li>
            <li>
              Quantitative lip aesthetic preferences and facial attractiveness (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/28208179/">
                A Quantitative Approach to Ideal Female Lip Aesthetic
              </a>
            </li>
            <li>
              Lower-face and lip anthropometry systematic review (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/38467850/">
                Anthropometry and Aesthetic Concepts of the Lower Third and Lips
              </a>
            </li>
            <li>
              Core lip anatomy reference (NCBI Bookshelf):
              <a className="text-primary underline ml-1" href="https://www.ncbi.nlm.nih.gov/books/NBK507900/">
                Anatomy, Head and Neck, Lips
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "face-shape-detector",
              "eye-shape-detector",
              "nose-shape-detector",
              "eyebrow-type-detector",
              "face-symmetry-test",
              "golden-face-ratio-analyzer",
              "jawline-check",
              "skin-analyzer",
              "hair-type-detector",
              "hair-color-detector",
              "age-guesser",
              "attractiveness-test",
            ]}
            excludeSlug="lip-shape-detector"
          />
        </div>
      </section>
    </main>
  );
}

const LipShapePageClient = dynamic(() => Promise.resolve(LipShapePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default LipShapePageClient;
