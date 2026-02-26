"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import CTA from "@/app/components/common/cta";
import RippleLoader from "@/app/components/common/loader";
import TryExamples from "@/app/components/common/try-examples";
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

const FACE_EXAMPLES = [
  { id: "nose-a", label: "Example A", src: "/examples/man-selfie.png" },
  { id: "nose-b", label: "Example B", src: "/examples/woman-selfie.png" },
  { id: "nose-c", label: "Example C", src: "/examples/boy-selfie.png" },
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
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
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
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Use a front-facing portrait with even lighting and minimal shadows across nose bridge and tip.
            </p>
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
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Fits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks the detected primary nose-shape category.
          </p>
          <NoseShapeTable activeShape={activeShape} />
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
          <h2 className={h2Class}>How This Nose Shape Detector Works</h2>
          <p className={pClass}>
            This tool estimates nose-shape categories from visual facial cues in a portrait, including
            bridge contour, tip orientation, and base-width context. It is designed for non-medical
            appearance interpretation and styling context.
          </p>
          <p className={pClass}>
            Lighting direction, lens distortion, pose angle, and facial expression can shift perceived nose
            contour. Use consistent photo conditions when comparing multiple scans.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Scan Quality</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(analysis?.retakeTips?.length
              ? analysis.retakeTips
              : [
                  "Use a straight-on portrait with level head position.",
                  "Avoid side-heavy shadows across bridge or tip.",
                  "Keep the full nose region unobstructed by hands, filters, or overlays.",
                  "Use neutral expression and avoid exaggerated flare/scrunch.",
                ]).map((tip, idx) => (
              <li key={`${tip}-${idx}`}>{tip}</li>
            ))}
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Use This with Other Face Tools</h2>
          <p className={pClass}>
            Combine this with the{" "}
            <a className="text-primary underline" href="/face-shape-detector">
              Face Shape Detector
            </a>{" "}
            for whole-face geometry, the{" "}
            <a className="text-primary underline" href="/eye-shape-detector">
              Eye Shape Detector
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/eyebrow-type-detector">
              Eyebrow Type Detector
            </a>{" "}
            for upper-face context, plus{" "}
            <a className="text-primary underline" href="/skin-type-detector">
              Skin Type Detector
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/hair-color-detector">
              Hair Color Detector
            </a>{" "}
            for appearance harmony, and the{" "}
            <a className="text-primary underline" href="/face-symmetry-test">
              Face Symmetry Test
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/golden-face-ratio-analyzer">
              Golden Face Ratio Analyzer
            </a>{" "}
            for balance and proportion analysis.
          </p>
        </div>

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

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <CTA
            title="Want a full face proportion review?"
            description="Run the Golden Face Ratio Analyzer for broad ratio-based proportion context."
            buttonText="Try Golden Face Ratio Analyzer →"
            href="/golden-face-ratio-analyzer"
          />
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "eye-shape-detector",
              "eyebrow-type-detector",
              "skin-type-detector",
              "hair-color-detector",
              "face-shape-detector",
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
