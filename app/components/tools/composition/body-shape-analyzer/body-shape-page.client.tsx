"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import TryExamples from "@/app/components/common/try-examples";
import FaqSection, { type FaqSectionItem } from "@/app/components/common/faq-section";
import LoadingStatus, { type LoadingStatusMessage } from "@/app/components/common/loading-status";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import {
  BodyDetectedGender,
  BodyShapeKey,
  useBodyShapeAnalysis,
} from "@/app/hooks/useBodyShapeAnalysis";

type ShapeRow = {
  key: Exclude<BodyShapeKey, "uncertain">;
  label: string;
  emoji: string;
  colorClass: string;
  textClass: string;
  proportionPattern: string;
  commonFitDirection: string;
};

type BodyTypeVisual = {
  id: string;
  title: string;
  src: string;
  description: string;
  shapeKey?: ShapeRow["key"];
};

const SHAPE_ROWS: ShapeRow[] = [
  {
    key: "hourglass",
    label: "Hourglass",
    emoji: "⌛",
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    proportionPattern: "Shoulders and hips are similar width with a clearly defined waist.",
    commonFitDirection: "Define and frame the waist while keeping top and bottom balanced.",
  },
  {
    key: "pear",
    label: "Pear (Triangle)",
    emoji: "🍐",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    proportionPattern: "Hips are visually wider than shoulders with a narrower upper torso.",
    commonFitDirection: "Add structure or visual width up top and keep clean lines below.",
  },
  {
    key: "rectangle",
    label: "Rectangle",
    emoji: "▭",
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    proportionPattern: "Shoulders, waist, and hips read relatively straight with less waist contrast.",
    commonFitDirection: "Create shape through waist definition, layering, and silhouette contrast.",
  },
  {
    key: "inverted-triangle",
    label: "Inverted Triangle",
    emoji: "🔻",
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    proportionPattern: "Shoulders/chest appear broader than hips and lower body.",
    commonFitDirection: "Soften upper width and add balance through lower-body volume/structure.",
  },
  {
    key: "apple",
    label: "Apple (Oval)",
    emoji: "🍎",
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    proportionPattern: "Midsection appears fuller relative to shoulders/hips, often with less waist indentation.",
    commonFitDirection: "Use vertical lines and structured drape to simplify the torso silhouette.",
  },
];

const WOMEN_BODY_TYPE_VISUALS: BodyTypeVisual[] = [
  {
    id: "women-hourglass",
    title: "Hourglass",
    src: "/tools/body-shape-analyzer/hourglass-body-type.png",
    description: "Balanced shoulder and hip width with more visible waist definition.",
    shapeKey: "hourglass",
  },
  {
    id: "women-triangle",
    title: "Triangle (Pear)",
    src: "/tools/body-shape-analyzer/triangle-body-type.png",
    description: "Lower body reads wider than upper body.",
    shapeKey: "pear",
  },
  {
    id: "women-rectangle",
    title: "Rectangle",
    src: "/tools/body-shape-analyzer/rectangle-body-type.png",
    description: "Straighter silhouette with less waist contrast.",
    shapeKey: "rectangle",
  },
  {
    id: "women-inverted-triangle",
    title: "Inverted Triangle",
    src: "/tools/body-shape-analyzer/inverted-triangle-body-type.png",
    description: "Upper body appears broader than hips.",
    shapeKey: "inverted-triangle",
  },
  {
    id: "women-oval",
    title: "Oval (Apple)",
    src: "/tools/body-shape-analyzer/oval-body-type.png",
    description: "More visual fullness around the midsection.",
    shapeKey: "apple",
  },
];

const MEN_BODY_TYPE_VISUALS: BodyTypeVisual[] = [
  {
    id: "men-trapezoid",
    title: "Trapezoid",
    src: "/tools/body-shape-analyzer/male-trapezoid-body-type.jpg",
    description: "Balanced shoulders and hips with moderate waist taper.",
    shapeKey: "hourglass",
  },
  {
    id: "men-triangle",
    title: "Triangle",
    src: "/tools/body-shape-analyzer/male-triangle-body-type.jpg",
    description: "Lower body and waist read wider than upper torso.",
    shapeKey: "pear",
  },
  {
    id: "men-rectangle",
    title: "Rectangle",
    src: "/tools/body-shape-analyzer/male-rectangle-body-type.jpg",
    description: "Straight shoulder-to-waist silhouette with less taper.",
    shapeKey: "rectangle",
  },
  {
    id: "men-inverted-triangle",
    title: "Inverted Triangle",
    src: "/tools/body-shape-analyzer/male-inverted-triangle-body-type.jpg",
    description: "Upper torso appears wider than hips with stronger V-taper.",
    shapeKey: "inverted-triangle",
  },
  {
    id: "men-oval",
    title: "Oval",
    src: "/tools/body-shape-analyzer/male-oval-body-type.jpg",
    description: "Visual fullness concentrated more in the midsection.",
    shapeKey: "apple",
  },
];

const BODY_SHAPE_FAQS: FaqSectionItem[] = [
  {
    question: "How does the Body Shape Analyzer work?",
    answer: (
      <>
        <p>
          This tool uses visual proportion cues from your uploaded image to classify your likely body
          type. The model evaluates upper-body width, waist definition, and hip balance, then maps your
          silhouette into common categories like hourglass, pear, rectangle, inverted triangle, and apple.
        </p>
        <p className="mt-3">
          You also get confidence and explanation output so you can understand why the model picked that
          category.
        </p>
      </>
    ),
  },
  {
    question: "What does the Body Shape Analyzer actually detect?",
    answer:
      "It estimates visible silhouette pattern from one front-facing photo, focusing on shoulder-to-waist-to-hip balance. The output is a visual category estimate (such as hourglass, pear, rectangle, inverted triangle, or apple), not a clinical measurement.",
  },
  {
    question: "How accurate is body-shape detection from one image?",
    answer:
      "It is directionally useful, but not perfect. Accuracy depends heavily on photo quality, camera height, clothing fit, and pose. For most people, it works best as a practical guide rather than a strict label.",
  },
  {
    question: "What photo setup gives the best result?",
    answer: (
      <ul className="list-disc pl-6 space-y-1">
        <li>Full-body front photo with head-to-feet visible</li>
        <li>Camera around torso height, not steeply above or below</li>
        <li>Neutral stance with arms relaxed</li>
        <li>Even lighting and minimal shadow</li>
        <li>Fitted clothing so body lines are visible</li>
      </ul>
    ),
  },
  {
    question: "Why can results change between photos?",
    answer:
      "Small differences in pose, camera distance, lens distortion, and clothing can shift how proportions appear. A single bent hip or camera tilt can change waist and hip perception enough to affect category output.",
  },
  {
    question: "Should I trust confidence or category more?",
    answer:
      "Read them together. Category tells what pattern was selected; confidence tells how clear the signal was. If confidence is low, retake with better setup before treating the classification as meaningful.",
  },
  {
    question: "Can this replace tape measurements?",
    answer:
      "No. For measurement-based analysis, use bust/chest, waist, and hip circumferences with a measurement calculator. This tool is a visual estimate, not a substitute for direct measurements.",
  },
  {
    question: "Is this tool useful for progress tracking?",
    answer:
      "Yes, if you keep setup consistent. Use similar camera position, clothing type, lighting, and pose each time. Compare trend direction across scans instead of reacting to one-off changes.",
  },
  {
    question: "Does body fat level affect body-shape output?",
    answer:
      "Yes. Changes in body-fat distribution can alter silhouette cues, especially around waist and hips, which may shift the detected category over time.",
  },
  {
    question: "Is this a health or medical diagnosis?",
    answer:
      "No. This is a non-medical appearance tool designed for fit/styling and proportion context. It should not be used to diagnose disease, endocrine issues, or health risk on its own.",
  },
  {
    question: "Are uploaded photos stored?",
    answer: (
      <>
        Image handling follows the current site policy. For details on storage and retention, review the{" "}
        <a className="text-primary underline" href="/privacy">Privacy Policy</a>.
      </>
    ),
  },
  {
    question: "How can I get better Body Shape Analyzer results?",
    answer: (
      <>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use a full-body front photo from head to feet.</li>
          <li>Keep camera height around torso level to reduce distortion.</li>
          <li>Wear fitted clothing so natural shape lines are visible.</li>
          <li>
            Use even lighting and avoid heavy shadows to{" "}
            <a className="text-primary underline" href="https://www.adobe.com/express/feature/image/enhance">
              enhance photos
            </a>{" "}
            and improve overall clarity.
          </li>
          <li>Stand in a neutral pose with arms relaxed at your sides.</li>
        </ul>
        <p className="mt-3 text-lg leading-relaxed">
          Prefer a manual method? Use the{" "}
          <a className="text-primary underline" href="/body-shape-calculator">
            Body Shape Calculator
          </a>{" "}
          to estimate body type from bust/chest, waist, and hip measurements.
        </p>
      </>
    ),
  },
];

const BODY_SHAPE_LOADING_MESSAGES: LoadingStatusMessage[] = [
  {
    title: "Image preparation and framing",
    body: "Normalizing orientation, framing, and scale so proportions are read consistently.",
  },
  {
    title: "Silhouette landmark mapping",
    body: "Tracing shoulder, waist, and hip contours from the uploaded full-body photo.",
  },
  {
    title: "Body-shape pattern analysis",
    body: "Comparing upper-body, waist, and lower-body balance against learned shape patterns.",
  },
  {
    title: "Confidence and ambiguity checks",
    body: "Testing alternative patterns and evaluating overlap before finalizing confidence.",
  },
  {
    title: "Result and guidance assembly",
    body: "Building your body type result, proportion notes, and styling direction guidance.",
  },
];

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-blue-100 text-blue-800 border-blue-200";
}

function shapeOneLiner(shape: BodyShapeKey) {
  if (shape === "hourglass") return "Balanced upper/lower proportions with a more defined waist.";
  if (shape === "pear") return "Lower body appears wider than upper body.";
  if (shape === "rectangle") return "More straight-line proportions with less waist contrast.";
  if (shape === "inverted-triangle") return "Upper body appears broader than lower body.";
  if (shape === "apple") return "Fullness appears more concentrated around the midsection.";
  return "The image was not clear enough for a confident shape classification.";
}

function shapeEmoji(shape: BodyShapeKey) {
  if (shape === "hourglass") return "⌛";
  if (shape === "pear") return "🍐";
  if (shape === "rectangle") return "▭";
  if (shape === "inverted-triangle") return "🔻";
  if (shape === "apple") return "🍎";
  return "❔";
}

function BodyShapeTable({ activeShape }: { activeShape: BodyShapeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Body Type
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Visual Pattern
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Fit Direction
            </th>
          </tr>
        </thead>
        <tbody>
          {SHAPE_ROWS.map((row) => {
            const isActive = activeShape === row.key;
            const cellBase = "px-4 py-4 align-top";
            const activeCell = isActive ? "border-y-4 border-gray-900" : "border-y border-transparent";

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
                    <span className="text-base" aria-hidden="true">{row.emoji}</span>
                    <span className={`font-semibold ${row.textClass}`}>{row.label}</span>
                    {isActive ? (
                      <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-2 py-0.5 text-xs font-semibold text-gray-900">
                        Your Result
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className={[cellBase, activeCell].join(" ")}>
                  <p className="text-gray-700">{row.proportionPattern}</p>
                  <p className="mt-1 text-sm text-gray-700 sm:hidden">{row.commonFitDirection}</p>
                </td>
                <td
                  className={[
                    cellBase,
                    activeCell,
                    "hidden sm:table-cell text-gray-700",
                    isActive ? "border-r-4 border-gray-900 rounded-r-xl" : "",
                  ].join(" ")}
                >
                  {row.commonFitDirection}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function BodyTypeVisualGrid({
  title,
  visuals,
  activeShape,
}: {
  title: string;
  visuals: BodyTypeVisual[];
  activeShape: BodyShapeKey | null;
}) {
  return (
    <div>
      <h3 className="mt-2 text-2xl lg:text-3xl font-semibold text-gray-900 text-center">{title}</h3>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {visuals.map((visual) => {
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
                  alt={`${visual.title} body type example`}
                  className="max-h-full w-auto max-w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 flex-wrap">
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
  );
}

function BodyShapePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useBodyShapeAnalysis(imageUrl, { source });

  const activeShape = analysis?.shape ?? null;
  const activeShapeLabel = analysis?.shapeLabel ?? "—";
  const detectedGender: BodyDetectedGender = analysis?.detectedGender ?? "unknown";

  const contentWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 pt-10 pb-10 lg:pt-20 lg:pb-20 leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const pClass = "text-lg leading-relaxed";
  const showWomenTypes = !imageUrl || detectedGender === "female" || detectedGender === "unknown";
  const showMenTypes = !imageUrl || detectedGender === "male" || detectedGender === "unknown";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Body Shape Analyzer</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a full-body photo to detect your body type and get practical guidance based on your visual proportions.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/body-shape-analyzer" buttonLabel="Upload Full-Body Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/body-shape-analyzer" />
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            {loading ? (
              <LoadingStatus
                imageUrl={imageUrl}
                title="Analyzing Body Shape"
                messages={BODY_SHAPE_LOADING_MESSAGES}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
                <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                  <img
                    src={imageUrl}
                    alt="Uploaded image for body-shape analysis"
                    className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                  />
                </div>

                <div className="w-full rounded-2xl bg-white p-6 lg:p-8 shadow-sm">
                  {error ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="whitespace-pre-line text-red-700">{error}</p>
                    </div>
                  ) : null}

                  {!error && analysis ? (
                    <div>
                      <a
                        href="#where-your-result-fits"
                        className="inline-flex items-center text-3xl lg:text-4xl font-bold text-primary no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 rounded-md"
                        aria-label={`Jump to Your Body Shape section for ${activeShapeLabel}`}
                      >
                        <span className="mr-2" aria-hidden="true">{shapeEmoji(analysis.shape)}</span>
                        {activeShapeLabel}
                      </a>

                      <p className="mt-4 text-lg text-gray-700">{shapeOneLiner(analysis.shape)}</p>

                      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm font-semibold">
                        <a
                          href="#result-confidence"
                          className={`inline-flex items-center rounded-full border px-3 py-1 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 ${confidenceBadgeClass(
                            analysis.confidence
                          )}`}
                        >
                          Confidence: {analysis.confidence.toUpperCase()}
                        </a>
                        {analysis.proportionNotes.length ? (
                          <a
                            href="#proportion-notes"
                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-gray-800 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                          >
                            Proportion Notes
                          </a>
                        ) : null}
                        {analysis.recommendations.length ? (
                          <a
                            href="#styling-guide"
                            className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-gray-800 no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
                          >
                            Styling Guide
                          </a>
                        ) : null}
                      </div>

                      {analysis.rationale ? (
                        <p className="mt-5 text-gray-700 leading-relaxed">{analysis.rationale}</p>
                      ) : null}

                    </div>
                  ) : null}

                  <div className="mt-6 sm:mt-8 flex flex-col gap-3">
                    <a href="/body-shape-analyzer" className="btn btn-outline btn-lg w-full">
                      <span className="whitespace-nowrap">Analyze Again</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="px-6">
        <div
          id="where-your-result-fits"
          className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20 scroll-mt-28"
        >
          <h2 className={h2Class}>Your Body Shape</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your current result from the uploaded image.
          </p>
          <BodyShapeTable activeShape={activeShape} />
          {analysis ? (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-gray-700 leading-relaxed">
              Current classification: <span className="font-semibold text-gray-900">{activeShapeLabel}</span>.
              {analysis.shape === "uncertain"
                ? " Try a clearer full-body front photo with the camera at torso height."
                : " Use this as directional guidance, not a strict identity label."}
            </div>
          ) : null}
        </div>

        <div className={contentWrap}>
          <h2 className={h2Class}>Common Body Types</h2>
          <p className="text-lg text-gray-700 text-center">
            Visual reference cards to help you compare silhouette patterns.
          </p>

          <div className="space-y-12 pt-2">
            {showWomenTypes ? (
              <BodyTypeVisualGrid
                title="Women Body Types (Female)"
                visuals={WOMEN_BODY_TYPE_VISUALS}
                activeShape={activeShape}
              />
            ) : null}

            {showMenTypes ? (
              <BodyTypeVisualGrid
                title="Men Body Types (Male)"
                visuals={MEN_BODY_TYPE_VISUALS}
                activeShape={activeShape}
              />
            ) : null}
          </div>
        </div>

        {analysis?.proportionNotes.length ? (
          <div id="proportion-notes" className={`${contentWrap} scroll-mt-28`}>
            <h2 className={h2Class}>Proportion Notes</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.proportionNotes.map((note, idx) => (
                <li key={`${note}-${idx}`}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis?.recommendations.length ? (
          <div id="styling-guide" className={`${contentWrap} scroll-mt-28`}>
            <h2 className={h2Class}>Styling Guide</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.recommendations.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div id="result-confidence" className={`${contentWrap} scroll-mt-28`}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h2 className={h2Class}>Result Confidence</h2>
            {analysis ? (
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                  analysis.confidence
                )}`}
              >
                {analysis.confidence.toUpperCase()}
              </span>
            ) : null}
          </div>
          <p className={pClass}>
            Confidence reflects how clearly your photo matched one dominant body-shape pattern after
            checking for overlap with alternatives.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li><span className="font-semibold">High</span>: clear pattern separation and stable cues.</li>
            <li><span className="font-semibold">Medium</span>: usable result with some overlap or ambiguity.</li>
            <li><span className="font-semibold">Low</span>: weak signal; retake with cleaner photo setup.</li>
          </ul>
          <p className={pClass}>
            Treat this as directional guidance. Lighting, pose, lens choice, and clothing can shift what
            the model sees, so consistent photo setup matters if you compare multiple scans.
          </p>
        </div>

        <FaqSection
          heading="Body Shape Analyzer FAQ"
          description="Common questions about photo-based body-shape classification and how to interpret your result."
          items={BODY_SHAPE_FAQS}
          accordionName="body-shape-analyzer-faq-accordion"
          className="pt-10 pb-10 lg:pt-20 lg:pb-20"
        />

        <div className={contentWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Li B, Mitchell K. A body shape classification scheme for women based on depth image analysis.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/36126362/">
                PubMed record
              </a>
            </li>
            <li>
              Krakauer NY, Krakauer JC. A new body shape index and mortality risk.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/22815707/">
                PubMed record
              </a>
            </li>
            <li>
              WHO clinical/public-health context for adiposity risk:
              <a className="text-primary underline ml-1" href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight">
                WHO fact sheet
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "estimate",
              "body-visualizer",
              "body-fat-calculator",
              "bai-calculator",
              "bri-calculator",
              "body-shape-calculator",
              "age-guesser",
              "attractiveness-test",
              "face-shape-detector",
              "jawline-check",
              "face-symmetry-test",
              "hair-type-detector",
              "body-frame-size-calculator",
              "lean-body-mass-calculator",
              "ffmi-calculator",
            ]}
            excludeSlug="body-shape-analyzer"
          />
        </div>
      </section>
    </main>
  );
}

const BodyShapeAnalyzerPageClient = dynamic(() => Promise.resolve(BodyShapePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default BodyShapeAnalyzerPageClient;
