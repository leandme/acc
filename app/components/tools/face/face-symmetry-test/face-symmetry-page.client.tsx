"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import RippleLoader from "@/app/components/common/loader";
import TryExamples from "@/app/components/common/try-examples";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import { useFaceSymmetryAnalysis } from "@/app/hooks/useFaceSymmetryAnalysis";

type SymmetryBand = {
  key: string;
  label: string;
  min: number;
  max: number;
  colorClass: string;
  textClass: string;
  summary: string;
};

const SYMMETRY_BANDS: SymmetryBand[] = [
  {
    key: "very_low",
    label: "Very Low Symmetry",
    min: 0,
    max: 34,
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    summary: "Large left-right differences were detected in key facial regions.",
  },
  {
    key: "low",
    label: "Low Symmetry",
    min: 35,
    max: 49,
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    summary: "Noticeable asymmetry is present, usually from angle, expression, or facial feature differences.",
  },
  {
    key: "moderate",
    label: "Moderate Symmetry",
    min: 50,
    max: 64,
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    summary: "A mixed pattern of balanced and unbalanced features was detected.",
  },
  {
    key: "balanced",
    label: "Balanced",
    min: 65,
    max: 79,
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    summary: "Most major facial landmarks are reasonably aligned from left to right.",
  },
  {
    key: "high",
    label: "High Symmetry",
    min: 80,
    max: 89,
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    summary: "Facial proportions appear consistently balanced in this photo.",
  },
  {
    key: "very_high",
    label: "Very High Symmetry",
    min: 90,
    max: 95,
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    summary: "Only small asymmetries are visible under this capture setup.",
  },
  {
    key: "exceptional",
    label: "Exceptional Symmetry",
    min: 96,
    max: 100,
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    summary: "Very high left-right balance was detected in this image.",
  },
];

const FACE_EXAMPLES = [
  { id: "face-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "face-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "face-c", label: "Example C", src: "/examples/boy-selfie.webp" },
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
    SYMMETRY_BANDS.find((band) => score >= band.min && score <= band.max) ?? null
  );
}

function formatBandRange(min: number, max: number) {
  return `${min}-${max}`;
}

function SymmetryInterpretationBar({ score }: { score: number }) {
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
            aria-label="Face symmetry marker"
            title={activeBand?.label ?? "Face symmetry score"}
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
          <span>Balanced</span>
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

function SymmetryBandTable({ score }: { score: number | null }) {
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
              Category
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody>
          {SYMMETRY_BANDS.map((band) => {
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

function resolveToAbsoluteUrl(url: string) {
  if (url.startsWith("/")) return `${window.location.origin}${url}`;
  return url;
}

function MirroredFacePanels({
  imageUrl,
  midlineXPercent,
}: {
  imageUrl: string;
  midlineXPercent: number;
}) {
  const leftCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const rightCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rendering, setRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);

  useEffect(() => {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    if (!leftCanvas || !rightCanvas) return;

    let canceled = false;
    setRendering(true);
    setRenderError(null);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    img.onload = () => {
      if (canceled) return;

      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        if (!width || !height || width < 2) {
          throw new Error("Image is too small for mirroring");
        }

        const splitX = clamp(Math.round(width * midlineXPercent), 1, width - 1);
        const halfWidth = Math.max(1, Math.min(splitX, width - splitX));
        const leftSourceX = splitX - halfWidth;
        const rightSourceX = splitX;
        const outputWidth = halfWidth * 2;

        const leftCtx = leftCanvas.getContext("2d");
        const rightCtx = rightCanvas.getContext("2d");
        if (!leftCtx || !rightCtx) throw new Error("Canvas context unavailable");

        leftCanvas.width = outputWidth;
        leftCanvas.height = height;
        rightCanvas.width = outputWidth;
        rightCanvas.height = height;

        leftCtx.clearRect(0, 0, outputWidth, height);
        leftCtx.drawImage(
          img,
          leftSourceX,
          0,
          halfWidth,
          height,
          0,
          0,
          halfWidth,
          height
        );
        leftCtx.save();
        leftCtx.translate(outputWidth, 0);
        leftCtx.scale(-1, 1);
        leftCtx.drawImage(
          img,
          leftSourceX,
          0,
          halfWidth,
          height,
          0,
          0,
          halfWidth,
          height
        );
        leftCtx.restore();
        leftCtx.fillStyle = "rgba(17, 24, 39, 0.85)";
        leftCtx.fillRect(halfWidth - 1, 0, 2, height);

        rightCtx.clearRect(0, 0, outputWidth, height);
        rightCtx.drawImage(
          img,
          rightSourceX,
          0,
          halfWidth,
          height,
          halfWidth,
          0,
          halfWidth,
          height
        );
        rightCtx.save();
        rightCtx.translate(halfWidth, 0);
        rightCtx.scale(-1, 1);
        rightCtx.drawImage(
          img,
          rightSourceX,
          0,
          halfWidth,
          height,
          0,
          0,
          halfWidth,
          height
        );
        rightCtx.restore();
        rightCtx.fillStyle = "rgba(17, 24, 39, 0.85)";
        rightCtx.fillRect(halfWidth - 1, 0, 2, height);

        setRendering(false);
      } catch (err) {
        console.error("Face symmetry mirror render failed:", err);
        setRenderError("Could not render mirrored panels for this image.");
        setRendering(false);
      }
    };

    img.onerror = () => {
      if (canceled) return;
      setRenderError("Could not load this image for mirror rendering.");
      setRendering(false);
    };

    img.src = resolveToAbsoluteUrl(imageUrl);

    return () => {
      canceled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl, midlineXPercent]);

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <figure className="rounded-2xl border bg-white p-4 shadow-sm">
          <figcaption className="mb-3 text-sm font-semibold text-gray-700">Left Side Mirrored</figcaption>
          <canvas
            ref={leftCanvasRef}
            className="w-full h-auto rounded-xl bg-base-200"
            aria-label="Left side face mirror result"
          />
        </figure>

        <figure className="rounded-2xl border bg-white p-4 shadow-sm">
          <figcaption className="mb-3 text-sm font-semibold text-gray-700">Right Side Mirrored</figcaption>
          <canvas
            ref={rightCanvasRef}
            className="w-full h-auto rounded-xl bg-base-200"
            aria-label="Right side face mirror result"
          />
        </figure>
      </div>

      {rendering ? (
        <p className="mt-4 text-sm text-gray-600">Rendering mirrored face panels...</p>
      ) : null}

      {renderError ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{renderError}</p>
        </div>
      ) : null}
    </div>
  );
}

function FaceSymmetryPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { result, loading, error } = useFaceSymmetryAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  const score = result?.score ?? null;
  const scoreBand = findBand(score);
  const midlinePct = clamp(result?.midlineXPercent ?? 0.5, 0.35, 0.65);
  const midlinePercentLabel = `${(midlinePct * 100).toFixed(1)}%`;

  const scoreLabel = useMemo(() => {
    if (score == null) return "No confident score";
    return `${score}/100`;
  }, [score]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Face Symmetry Test</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a clear front-facing photo to run an AI face symmetry checker, generate mirrored
          face comparisons, and get a face symmetry score from 0 to 100.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/face-symmetry-test" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/face-symmetry-test" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 text-center max-w-md">
              Best results come from neutral expression, even lighting, and a straight-on face photo
              with minimal tilt.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Uploaded face photo for symmetry analysis"
                    className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                  />
                  <span
                    className="absolute top-0 bottom-0 w-[2px] bg-gray-900/85 rounded-full"
                    style={{ left: midlinePercentLabel }}
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-3 text-xs text-center text-gray-600">
                  Midline marker: <span className="font-semibold text-gray-800">{midlinePercentLabel}</span>
                </p>
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Your Symmetry Score</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing facial geometry...</p>
                        <p className="text-sm text-gray-600">Estimating left-right alignment and visual balance.</p>
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
                        Category: <span className={`font-semibold ${scoreBand.textClass}`}>{scoreBand.label}</span>
                      </p>
                    ) : null}

                    {result.summary ? (
                      <p className="mt-4 text-gray-700 leading-relaxed">{result.summary}</p>
                    ) : null}

                    {result.observations.length ? (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900">Key observations</h3>
                        <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                          {result.observations.map((note, idx) => (
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
        {typeof score === "number" ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Symmetry Interpretation Bar</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Your score is marked on the same red-to-violet interpretation scale used across our tools.
            </p>
            <div className="mt-8">
              <SymmetryInterpretationBar score={score} />
            </div>
          </div>
        ) : null}

        {imageUrl && !loading && !error ? (
          <div className="w-full max-w-5xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Mirrored Face Comparison</h2>
            <p className="mt-4 text-center text-lg text-gray-700 max-w-3xl mx-auto">
              These side-by-side composites mirror each half of your face across the detected midline.
              This is the standard format used in many face symmetry tests.
            </p>
            <MirroredFacePanels imageUrl={imageUrl} midlineXPercent={midlinePct} />
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your current face symmetry score band.
          </p>
          <SymmetryBandTable score={score} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This AI Face Symmetry Checker Works</h2>
          <p className={pClass}>
            This face symmetry test uses AI visual analysis to estimate how balanced facial features
            appear from left to right. It scans key landmarks and shape patterns, then maps the
            outcome to a practical 0-100 symmetry score.
          </p>
          <p className={pClass}>
            You also get a detected facial midline and mirrored-side preview panels, which help you
            understand where asymmetry appears most strongly in this specific photo.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Take a Better Face Symmetry Test Photo</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Use a straight-on portrait with your head centered and level.</li>
            <li>Keep a neutral expression and relax your jaw, brow, and mouth.</li>
            <li>Use even front lighting and avoid directional shadows.</li>
            <li>Avoid wide-angle distortion by holding the camera at face height.</li>
            <li>Keep hair away from the eyebrows, cheeks, and jawline when possible.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What Your Face Symmetry Score Means</h2>
          <p className={pClass}>
            A higher score means stronger left-right visual balance in this image, while a lower score
            means larger visible differences between sides. The score is a practical screening number,
            not a diagnosis.
          </p>
          <p className={pClass}>
            Small asymmetries are normal. Camera angle, lens distortion, expression, and lighting can
            shift your score. For trend tracking, keep your setup consistent and compare multiple photos
            over time instead of relying on one image.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Face Symmetry and Attractiveness</h2>
          <p className={pClass}>
            Research often finds that symmetry can influence facial attractiveness, but it is only one
            signal among many. Skin quality, sexual dimorphism, averageness, expression, grooming, and
            cultural preferences all contribute to perceived attractiveness.
          </p>
          <p className={pClass}>
            In practice, this tool is best used as a structured visual check for balance and photo
            consistency, not as a universal attractiveness rating. If you want a direct score, run the{" "}
            <a className="text-primary underline" href="/attractiveness-test">
              Attractiveness Test
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            This AI face symmetry test is an image-based estimate and can be affected by pose, lens
            perspective, camera quality, and occlusions. It does not diagnose medical conditions and
            should not be used for clinical decisions.
          </p>
          <p className={pClass}>
            If the face is partially turned, blurred, heavily filtered, or blocked, confidence is lower
            and score quality drops. Upload a clear, front-facing image for better reliability.
          </p>
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

        {result?.improvementTips?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>How To Improve Future Scans</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {result.improvementTips.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Verhoeven TJ, Xi T, Schreurs R, Bergé S, Maal T. Quantification of facial asymmetry:
              A comparative study of landmark-based and surface-based registrations.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/27519663/">
                PubMed record
              </a>
            </li>
            <li>
              Zheng R, Ren D, Xie C, Pan J, Zhou G. Normality mediates the effect of symmetry on facial attractiveness.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/33933836/">
                PubMed record
              </a>
            </li>
            <li>
              Penton-Voak IS, Jones BC, Little AC, et al. Symmetry, sexual dimorphism in facial proportions and male facial attractiveness.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/11487409/">
                PubMed record
              </a>
            </li>
            <li>
              Rhodes G, Yoshikawa S, Clark A, et al. Perceived health contributes to the attractiveness of facial symmetry, averageness, and sexual dimorphism.
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
              "skin-type-detector",
              "hair-color-detector",
              "age-guesser",
              "attractiveness-test",
              "face-shape-detector",
              "estimate",
              "body-shape-analyzer",
              "body-visualizer",
              "body-shape-calculator",
              "bmi-calculator",
              "height-estimator",
              "ffmi-calculator",
              "calorie-estimator",
            ]}
            excludeSlug="face-symmetry-test"
          />
        </div>
      </section>
    </main>
  );
}

const FaceSymmetryPageClient = dynamic(() => Promise.resolve(FaceSymmetryPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default FaceSymmetryPageClient;
