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
  NoseShapeKey,
  useNoseShapeAnalysis,
} from "@/app/hooks/useNoseShapeAnalysis";

type NoseRow = {
  key: Exclude<NoseShapeKey, "uncertain">;
  label: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  direction: string;
};

type NoseShapeVisual = {
  id: string;
  title: string;
  src: string;
  description: string;
  shapeKey?: NoseRow["key"];
};

const NOSE_ROWS: NoseRow[] = [
  {
    key: "straight",
    label: "Straight",
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    pattern: "Bridge line appears relatively straight from radix to tip.",
    direction: "Most frontal and profile styling balances naturally with this shape.",
  },
  {
    key: "aquiline",
    label: "Aquiline",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    pattern: "Bridge shows convex contour with stronger profile prominence.",
    direction: "Side lighting and contour placement can emphasize or soften bridge line.",
  },
  {
    key: "button",
    label: "Button",
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    pattern: "Smaller nose profile with compact tip and softer bridge transition.",
    direction: "Balanced definition near alar base can maintain natural proportion.",
  },
  {
    key: "nubian",
    label: "Nubian",
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    pattern: "Longer bridge with broader base and lower tip orientation tendency.",
    direction: "Vertical-light balance and soft contouring can refine shape emphasis.",
  },
  {
    key: "snub",
    label: "Snub",
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    pattern: "Shorter bridge with slight upward tip orientation.",
    direction: "Keep highlight placement controlled to avoid over-emphasizing tip lift.",
  },
  {
    key: "fleshy",
    label: "Fleshy",
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    pattern: "Rounder, fuller tip with softer tissue contours.",
    direction: "Subtle contour and alar-edge definition can improve perceived structure.",
  },
  {
    key: "wide",
    label: "Wide",
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    pattern: "Broader alar base relative to midface width.",
    direction: "Centerline highlight and controlled side contour can narrow perception.",
  },
  {
    key: "narrow",
    label: "Narrow",
    colorClass: "bg-cyan-50",
    textClass: "text-cyan-800",
    pattern: "Slimmer bridge and alar base relative to facial width.",
    direction: "Balanced side highlight avoids over-thinning in strong lighting.",
  },
];

const NOSE_SHAPE_VISUALS: NoseShapeVisual[] = [
  {
    id: "greek",
    title: "Greek Nose",
    src: "/tools/nose-shape-detector/greek-nose-shape.png",
    description:
      "Usually appears with a straighter bridge profile and cleaner radix-to-tip line.",
    shapeKey: "straight",
  },
  {
    id: "roman",
    title: "Roman Nose",
    src: "/tools/nose-shape-detector/roman-nose-shape.png",
    description:
      "Often shows a convex bridge contour and stronger profile projection.",
    shapeKey: "aquiline",
  },
  {
    id: "hawk",
    title: "Hawk Nose",
    src: "/tools/nose-shape-detector/hawk-nose-shape.png",
    description:
      "Tends to present a more pronounced bridge curve and forward profile emphasis.",
    shapeKey: "aquiline",
  },
  {
    id: "button",
    title: "Button Nose",
    src: "/tools/nose-shape-detector/button-nose-shape.png",
    description:
      "Compact profile with softer bridge-to-tip transition and smaller tip structure.",
    shapeKey: "button",
  },
  {
    id: "nubian",
    title: "Nubian Nose",
    src: "/tools/nose-shape-detector/nubian-nose-shape.png",
    description:
      "Often appears longer with a broader base and lower tip tendency.",
    shapeKey: "nubian",
  },
  {
    id: "snub",
    title: "Snub Nose",
    src: "/tools/nose-shape-detector/snub-nose-shape.png",
    description:
      "Shorter bridge shape with a mildly lifted tip direction.",
    shapeKey: "snub",
  },
  {
    id: "turned-up",
    title: "Turned-Up Nose",
    src: "/tools/nose-shape-detector/turned_up-nose-shape.png",
    description:
      "Upward tip orientation with shorter visual bridge length.",
    shapeKey: "snub",
  },
  {
    id: "fleshy",
    title: "Fleshy Nose",
    src: "/tools/nose-shape-detector/fleshy-nose-shape.png",
    description:
      "Rounder, fuller soft-tissue appearance around the tip and lower third.",
    shapeKey: "fleshy",
  },
  {
    id: "bulbous",
    title: "Bulbous Nose",
    src: "/tools/nose-shape-detector/bulbous-nose-shape.png",
    description:
      "Broader, rounder tip structure that typically resembles fleshy-type patterns.",
    shapeKey: "fleshy",
  },
  {
    id: "flat",
    title: "Flat Nose",
    src: "/tools/nose-shape-detector/flat-nose-shape.png",
    description:
      "Lower bridge projection and softer dorsal contour with wider base tendency.",
    shapeKey: "wide",
  },
];

const FACE_EXAMPLES = [
  { id: "nose-a", label: "Example A", src: "/tools/lip-shape-detector/lip-shape-example.jpg" },
  { id: "nose-b", label: "Example B", src: "/tools/eye-shape-detector/eyes-example-3.jpg" },
  { id: "nose-c", label: "Example C", src: "/tools/eye-shape-detector/eye-example-2.jpg" },
  { id: "nose-d", label: "Example D", src: "/tools/eye-shape-detector/eye-example-4.jpg" },
];

const NOSE_SHAPE_FAQS: FaqSectionItem[] = [
  {
    question: "What is a nose shape detector?",
    answer:
      "A nose shape detector is an AI tool that estimates your visible nose-shape pattern from one portrait image. It analyzes cues like bridge contour, tip direction, and relative width.",
  },
  {
    question: "How accurate is nose-shape detection from one photo?",
    answer:
      "It is a visual estimate, not a clinical measurement. Accuracy is generally best with front-facing photos, neutral expression, and even lighting. Distortion from angle or lens choice can reduce reliability.",
  },
  {
    question: "What photo gives the best result?",
    answer: (
      <ul className="list-disc pl-6 space-y-1">
        <li>Front-facing portrait with the full nose region visible</li>
        <li>Level head position and neutral expression</li>
        <li>Even lighting without strong side shadows</li>
        <li>No heavy filters, overlays, or partial occlusion</li>
      </ul>
    ),
  },
  {
    question: "Can makeup, contouring, or camera lens affect the output?",
    answer:
      "Yes. Nose contouring, highlights, strong beauty filters, and wide-angle close shots can change the apparent bridge and width. For baseline scans, use a natural photo with minimal editing.",
  },
  {
    question: "What does confidence mean in my result?",
    answer:
      "Confidence reflects how clearly the model could identify nose landmarks and shape cues in your image. Low confidence usually means one or more quality issues such as shadows, blur, angle, or occlusion.",
  },
  {
    question: "Why might I get different results across photos?",
    answer:
      "Small changes in camera height, focal length, lighting, and expression can significantly affect perceived nose geometry. Consistent setup is essential if you compare repeat scans over time.",
  },
  {
    question: "Is this tool medical or diagnostic?",
    answer:
      "No. This tool is for appearance-based analysis and styling context only. It does not diagnose breathing issues, sinus conditions, trauma, or any medical concern.",
  },
  {
    question: "Should I use this result alone for styling decisions?",
    answer:
      "It works best as one input among several. Pair it with overall face-context tools like Face Shape Detector or Face Symmetry Test to make more balanced styling decisions.",
  },
  {
    question: "Is my uploaded photo stored?",
    answer: (
      <>
        Image handling follows current site policy. For details on retention and sharing, see the{" "}
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

function NoseShapeTable({ activeShape }: { activeShape: NoseShapeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Nose Shape
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
          {NOSE_ROWS.map((row) => {
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

function NoseShapePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useNoseShapeAnalysis(imageUrl, { source });

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
        <H1>Nose Shape Detector</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a clear portrait to detect nose shape with AI, including bridge profile, tip direction,
          and confidence scoring.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/nose-shape-detector" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/nose-shape-detector" examples={FACE_EXAMPLES} />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for nose-shape analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Nose Shape Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing nose morphology...</p>
                        <p className="text-sm text-gray-600">
                          Estimating shape profile, bridge contour, tip orientation, and width category.
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
                        {analysis.shapeLabel}
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
                      Bridge: <span className="font-semibold capitalize">{analysis.bridgeProfile}</span>
                      {" "} | Tip: <span className="font-semibold capitalize">{analysis.tipDirection}</span>
                      {" "} | Width: <span className="font-semibold capitalize">{analysis.widthCategory}</span>
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Confidence: <span className="font-semibold">{analysis.confidenceScore}/100</span>
                      {analysis.symmetryScore != null ? (
                        <>
                          {" "} | Symmetry: <span className="font-semibold">{analysis.symmetryScore}/100</span>
                        </>
                      ) : null}
                      {analysis.projectionScore != null ? (
                        <>
                          {" "} | Projection: <span className="font-semibold">{analysis.projectionScore}/100</span>
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
        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
          <h2 className={h2Class}>Where Your Result Fits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks the detected primary nose-shape category.
          </p>
          <NoseShapeTable activeShape={activeShape} />
        </div>

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
          <h2 className={h2Class}>Common Nose Shapes</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            Quick visual examples of common nose-shape patterns.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {NOSE_SHAPE_VISUALS.map((visual) => {
              const isActive = visual.shapeKey != null && activeShape === visual.shapeKey;
              return (
                <article
                  key={visual.id}
                  className={[
                    "overflow-hidden rounded-2xl border bg-white shadow-sm",
                    isActive ? "ring-2 ring-gray-900 border-gray-900/40" : "border-gray-200",
                  ].join(" ")}
                >
                  <div className="h-72 sm:h-80 bg-base-100 p-4 flex items-center justify-center">
                    <img
                      src={visual.src}
                      alt={`${visual.title} example`}
                      className="max-h-full w-auto max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl lg:text-2xl font-semibold text-gray-900">{visual.title}</h4>
                      {isActive ? (
                        <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-3 py-1 text-sm font-semibold text-gray-900">
                          Your Result
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-lg text-gray-700 leading-relaxed">{visual.description}</p>
                  </div>
                </article>
              );
            })}
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

        <FaqSection
          heading="Nose Shape Detector FAQ"
          description="Common questions about AI nose-shape detection, confidence, and interpretation."
          items={NOSE_SHAPE_FAQS}
          accordionName="nose-shape-detector-faq-accordion"
          className="pt-10 pb-10 lg:pt-20 lg:pb-20"
        />

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Anthropometric proportions in nasal analysis (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/27105816/">
                Nasal Anthropometry and Facial Proportion Studies
              </a>
            </li>
            <li>
              Clinical review of nasal shape analysis in facial aesthetics (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/28009704/">
                Nasal Aesthetic Analysis Concepts
              </a>
            </li>
            <li>
              Three-dimensional facial soft-tissue norms and reproducibility (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/22373917/">
                Reliability of 3D Facial Landmarks
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "eye-shape-detector",
              "eyebrow-type-detector",
              "skin-analyzer",
              "hair-color-detector",
              "hair-type-detector",
              "face-shape-detector",
              "jawline-check",
              "face-symmetry-test",
              "golden-face-ratio-analyzer",
              "age-guesser",
              "attractiveness-test",
            ]}
            excludeSlug="nose-shape-detector"
          />
        </div>
      </section>
    </main>
  );
}

const NoseShapePageClient = dynamic(() => Promise.resolve(NoseShapePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default NoseShapePageClient;
