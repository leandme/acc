"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import TryExamples from "@/app/components/common/try-examples";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import {
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

function BodyShapePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useBodyShapeAnalysis(imageUrl, { source });

  const activeShape = analysis?.shape ?? null;
  const activeShapeLabel = analysis?.shapeLabel ?? "—";

  const alternativesText = useMemo(() => {
    if (!analysis?.alternatives?.length) return null;
    return analysis.alternatives.slice(0, 2).join(" or ");
  }, [analysis?.alternatives]);

  const contentWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const pClass = "text-lg leading-relaxed";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Body Shape Analyzer</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a full-body photo to estimate your body type and get practical guidance based on
          your visual proportions.
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
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for body-shape analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Your Body Type Result</h2>

                {loading ? (
                  <p className="mt-4 text-lg text-gray-700">
                    Analyzing image proportions and shape pattern...
                  </p>
                ) : null}

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="whitespace-pre-line text-red-700">{error}</p>
                  </div>
                ) : null}

                {!loading && !error && analysis ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-3xl lg:text-4xl font-bold text-primary">
                        <span className="mr-2" aria-hidden="true">{shapeEmoji(analysis.shape)}</span>
                        {activeShapeLabel}
                      </p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          analysis.confidence
                        )}`}
                      >
                        {analysis.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    <p className="mt-4 text-lg text-gray-700">{shapeOneLiner(analysis.shape)}</p>

                    {analysis.rationale ? (
                      <p className="mt-4 text-gray-700 leading-relaxed">{analysis.rationale}</p>
                    ) : null}

                    {alternativesText ? (
                      <p className="mt-3 text-sm text-gray-600">
                        Secondary possible pattern: {alternativesText}
                      </p>
                    ) : null}

                    {analysis.proportionNotes.length ? (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900">Proportion notes</h3>
                        <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                          {analysis.proportionNotes.map((note, idx) => (
                            <li key={`${note}-${idx}`}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {analysis.recommendations.length ? (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900">Styling guidance</h3>
                        <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                          {analysis.recommendations.map((tip, idx) => (
                            <li key={`${tip}-${idx}`}>{tip}</li>
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
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
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
          <h2 className={h2Class}>How This Body Shape Analyzer Works</h2>
          <p className={pClass}>
            This tool uses visual proportion cues from your uploaded image to classify your likely body
            type. The model evaluates upper-body width, waist definition, and hip balance, then maps
            your silhouette into common categories like hourglass, pear, rectangle, inverted triangle,
            and apple.
          </p>
          <p className={pClass}>
            You also get confidence and explanation output so you can understand why the model picked
            that category.
          </p>
        </div>

        <div className={contentWrap}>
          <h2 className={h2Class}>How To Get Better Results</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Use a full-body front photo from head to feet.</li>
            <li>Keep camera height around torso level to reduce distortion.</li>
            <li>Wear fitted clothing so natural shape lines are visible.</li>
            <li>
              Use even lighting and avoid heavy shadows to{" "}
              <a
                className="text-primary underline"
                href="https://www.adobe.com/express/feature/image/enhance"
              >
                enhance photos
              </a>{" "}
              and improve overall clarity.
            </li>
            <li>Stand in a neutral pose with arms relaxed at your sides.</li>
          </ul>
        </div>

        <div className={contentWrap}>
          <h2 className={h2Class}>What This Is Good For</h2>
          <p className={pClass}>
            This is useful for outfit fit strategy, silhouette balancing, and understanding how your
            proportions are likely perceived in photos. It can also help you compare shape presentation
            over time if you keep your photo setup consistent.
          </p>
          <p className={pClass}>
            If your goal is body-composition tracking, pair this with{" "}
            <a className="text-primary underline" href="/estimate">Body Fat Estimator</a> and{" "}
            <a className="text-primary underline" href="/body-visualizer">Body Visualizer</a>. For a
            measurement-based alternative (bust/chest, waist, hips), use the{" "}
            <a className="text-primary underline" href="/body-shape-calculator">Body Shape Calculator</a>.
            {" "}If you want a dedicated face analysis workflow, run the{" "}
            <a className="text-primary underline" href="/face-symmetry-test">Face Symmetry Test</a>{" "}
            and{" "}
            <a className="text-primary underline" href="/face-shape-detector">Face Shape Detector</a>{" "}
            plus{" "}
            <a className="text-primary underline" href="/jawline-check">Jawline Check</a>{" "}
            plus{" "}
            <a className="text-primary underline" href="/hair-type-detector">Hair Type Detector</a>{" "}
            and{" "}
            <a className="text-primary underline" href="/age-guesser">Age Guesser</a>{" "}
            and{" "}
            <a className="text-primary underline" href="/attractiveness-test">Attractiveness Test</a>.
          </p>
        </div>

        <div className={contentWrap}>
          <h2 className={h2Class}>Limitations and Accuracy</h2>
          <p className={pClass}>
            Body shape labels are simplifications. Real bodies exist on a spectrum, and lighting, pose,
            lens choice, and clothing can shift what the model sees. Treat this as a practical guide,
            not a diagnosis or permanent label.
          </p>
          <p className={pClass}>
            For the most stable result, use similar camera setup and compare trends rather than single
            uploads.
          </p>
        </div>

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
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
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
