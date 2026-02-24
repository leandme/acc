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
  FaceShapeKey,
  useFaceShapeAnalysis,
} from "@/app/hooks/useFaceShapeAnalysis";

type ShapeRow = {
  key: Exclude<FaceShapeKey, "uncertain">;
  label: string;
  emoji: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  commonFitDirection: string;
};

const SHAPE_ROWS: ShapeRow[] = [
  {
    key: "oval",
    label: "Oval",
    emoji: "OV",
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    pattern:
      "Face length is moderately longer than width, with gentle jaw and forehead balance.",
    commonFitDirection:
      "Most frame shapes, hair lengths, and parting styles work without heavy correction.",
  },
  {
    key: "round",
    label: "Round",
    emoji: "RD",
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    pattern:
      "Face width and length are similar, with softer cheek and jaw transitions.",
    commonFitDirection:
      "Add vertical definition through layered cuts, crown volume, and angular frames.",
  },
  {
    key: "square",
    label: "Square",
    emoji: "SQ",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    pattern:
      "Forehead, cheek width, and jaw width appear similar with stronger angles at the jaw.",
    commonFitDirection:
      "Use rounded textures and softer frame edges to balance angular structure.",
  },
  {
    key: "oblong",
    label: "Oblong",
    emoji: "OB",
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    pattern:
      "Face appears noticeably longer than wide, often with straighter side lines.",
    commonFitDirection:
      "Add side width and reduce vertical emphasis with bangs, waves, or broader frame lines.",
  },
  {
    key: "heart",
    label: "Heart",
    emoji: "HT",
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    pattern:
      "Upper face/forehead reads wider while jawline narrows toward the chin.",
    commonFitDirection:
      "Build visual weight around the lower face and keep upper framing lighter.",
  },
  {
    key: "diamond",
    label: "Diamond",
    emoji: "DM",
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    pattern:
      "Cheekbones read widest with narrower forehead and jawline zones.",
    commonFitDirection:
      "Open forehead/chin framing and avoid adding excess width at cheek level.",
  },
];

const FACE_EXAMPLES = [
  { id: "face-shape-a", label: "Example A", src: "/examples/man-selfie.png" },
  { id: "face-shape-b", label: "Example B", src: "/examples/woman-selfie.png" },
  { id: "face-shape-c", label: "Example C", src: "/examples/boy-selfie.png" },
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

function shapeEmoji(shape: FaceShapeKey) {
  if (shape === "oval") return "OV";
  if (shape === "round") return "RD";
  if (shape === "square") return "SQ";
  if (shape === "oblong") return "OB";
  if (shape === "heart") return "HT";
  if (shape === "diamond") return "DM";
  return "NA";
}

function shapeOneLiner(shape: FaceShapeKey) {
  if (shape === "oval") return "Balanced length-width profile with a gently tapered jawline.";
  if (shape === "round") return "Softer contour where face width and length appear similar.";
  if (shape === "square") return "Stronger jaw and straighter side proportions.";
  if (shape === "oblong") return "Longer vertical profile relative to width.";
  if (shape === "heart") return "Wider upper-face profile with narrower chin region.";
  if (shape === "diamond") return "Cheekbone-dominant width with narrower forehead and jaw.";
  return "The photo was not clear enough for a reliable shape classification.";
}

function FaceShapeConfidenceBar({ score }: { score: number }) {
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
            aria-label="Face-shape confidence marker"
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

function FaceShapeTable({ activeShape }: { activeShape: FaceShapeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Face Shape
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
          {SHAPE_ROWS.map((row) => {
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
                    <span className="text-base" aria-hidden="true">
                      {row.emoji}
                    </span>
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
                    {row.commonFitDirection}
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

function FaceShapePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useFaceShapeAnalysis(imageUrl, { source });

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
        <H1>Face Shape Detector</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a front-facing portrait to detect your face shape with AI, get confidence scoring,
          and compare where your result sits across common face-shape categories.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/face-shape-detector" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/face-shape-detector" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Best results come from straight-on portraits with neutral expression and clear jawline
              visibility.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for face-shape analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Your Face Shape Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing facial proportions...</p>
                        <p className="text-sm text-gray-600">
                          Estimating forehead, cheekbone, jawline, and face-length patterns.
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
                      <p className="text-3xl lg:text-4xl font-bold text-primary">
                        <span className="mr-2" aria-hidden="true">
                          {shapeEmoji(analysis.shape)}
                        </span>
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

                    <p className="mt-3 text-lg text-gray-700">{shapeOneLiner(analysis.shape)}</p>
                    <p className="mt-2 text-sm text-gray-600">
                      Confidence score:{" "}
                      <span className="font-semibold text-gray-800">
                        {analysis.confidenceScore}/100
                      </span>
                    </p>

                    {analysis.rationale ? (
                      <p className="mt-4 text-gray-700 leading-relaxed">{analysis.rationale}</p>
                    ) : null}

                    {alternativesText ? (
                      <p className="mt-3 text-sm text-gray-600">
                        Secondary possible shape: {alternativesText}
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
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-6">
        {typeof analysis?.confidenceScore === "number" ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Confidence Interpretation Bar</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              This bar shows how strongly the uploaded photo matched one dominant face-shape pattern.
            </p>
            <div className="mt-8">
              <FaceShapeConfidenceBar score={analysis.confidenceScore} />
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your primary face-shape result.
          </p>
          <FaceShapeTable activeShape={activeShape} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Face Shape Detector Works</h2>
          <p className={pClass}>
            This AI face analyzer estimates your face shape from visible geometry, including
            face-length ratio, forehead-to-jaw balance, cheekbone prominence, and chin taper.
            It then classifies your primary shape into common categories like oval, round, square,
            oblong, heart, and diamond.
          </p>
          <p className={pClass}>
            The detector also returns confidence, proportion notes, and practical styling direction
            so you can use the result for haircuts, glasses, grooming, and photo framing decisions.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Get More Accurate Results</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Use a front-facing portrait with your head level and centered.</li>
            <li>Keep hair off the jawline and cheeks where possible.</li>
            <li>Avoid smiling too hard; neutral expression keeps proportions clearer.</li>
            <li>Use even lighting and avoid high-contrast side shadows.</li>
            <li>Use normal camera distance to reduce wide-angle distortion.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Face Shape Categories Explained</h2>
          <p className={pClass}>
            Face shape labels are simplifications of proportion patterns, not rigid identities.
            Most people sit between two nearby categories, especially when hairstyle, camera angle,
            and expression change. That is why this tool includes alternative-shape suggestions.
          </p>
          <p className={pClass}>
            For repeatable tracking, use similar photos over time and look for stable patterns across
            multiple uploads instead of one image.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use Face Shape Results</h2>
          <p className={pClass}>
            Face-shape detection is most useful for selecting hairstyles, beard lines, frame geometry,
            and makeup contour direction. Use it as a directional guide for balance, not a fixed rule.
          </p>
          <p className={pClass}>
            If your confidence score is low, retake the photo before making strong styling decisions.
            Small capture changes can shift shape outcomes more than expected.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            This is an appearance-based face-shape estimate. It can be affected by hairstyle, facial
            hair, camera lens, head tilt, occlusions, and image quality. It is not a medical or
            anthropometric diagnosis.
          </p>
          <p className={pClass}>
            If the image is rotated, filtered, partially covered, or off-angle, confidence may drop
            and classification may shift toward nearby shapes.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Use This with Other Tools</h2>
          <p className={pClass}>
            Pair face-shape classification with the{" "}
            <a className="text-primary underline" href="/face-symmetry-test">
              Face Symmetry Test
            </a>{" "}
            for left-right balance context and with{" "}
            <a className="text-primary underline" href="/age-guesser">
              Age Guesser
            </a>{" "}
            for apparent-age estimates. For full-body visual analysis, use the{" "}
            <a className="text-primary underline" href="/body-shape-analyzer">
              Body Shape Analyzer
            </a>{" "}
            and for composition tracking use the{" "}
            <a className="text-primary underline" href="/estimate">
              Body Fat Estimator
            </a>
            .
          </p>
        </div>

        {analysis?.recommendations?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Styling Suggestions from Your Scan</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.recommendations.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Kazemi V, Sullivan J. One millisecond face alignment with an ensemble of regression trees.
              <a className="text-primary underline ml-1" href="https://arxiv.org/abs/1404.6412">
                arXiv paper
              </a>
            </li>
            <li>
              Sforza C, Grandi G, Catti F, et al. Age- and sex-related changes in three-dimensional
              facial morphology.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/17304440/">
                PubMed record
              </a>
            </li>
            <li>
              Farkas LG, Katic MJ, Forrest CR. International anthropometric study of facial morphology
              in various ethnic groups/races.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/10587777/">
                PubMed record
              </a>
            </li>
            <li>
              Verhoeven TJ, Xi T, Schreurs R, Bergé S, Maal T. Quantification of facial asymmetry:
              A comparative study of landmark-based and surface-based registrations.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/27519663/">
                PubMed record
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <CTA
            title="Want a second face analysis?"
            description="Run a facial symmetry check and compare mirrored halves for additional visual-balance context."
            buttonText="Try Face Symmetry Test →"
            href="/face-symmetry-test"
          />
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "age-guesser",
              "face-symmetry-test",
              "body-shape-analyzer",
              "body-shape-calculator",
              "height-estimator",
              "estimate",
              "body-visualizer",
              "calorie-estimator",
              "ffmi-calculator",
            ]}
            excludeSlug="face-shape-detector"
          />
        </div>
      </section>
    </main>
  );
}

const FaceShapePageClient = dynamic(() => Promise.resolve(FaceShapePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default FaceShapePageClient;
