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
  JawlineTypeKey,
  useJawlineCheckAnalysis,
} from "@/app/hooks/useJawlineCheckAnalysis";

type JawlineBand = {
  key: Exclude<JawlineTypeKey, "uncertain">;
  label: string;
  min: number;
  max: number;
  colorClass: string;
  textClass: string;
  summary: string;
};

const JAWLINE_BANDS: JawlineBand[] = [
  {
    key: "very-sharp",
    label: "Very Sharp",
    min: 80,
    max: 114,
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    summary:
      "Very acute mandibular angle with a strong posterior-to-anterior jawline transition.",
  },
  {
    key: "sharp",
    label: "Sharp",
    min: 115,
    max: 124,
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    summary: "Defined angle with clear contour separation near the gonial region.",
  },
  {
    key: "balanced",
    label: "Balanced",
    min: 125,
    max: 134,
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    summary:
      "Middle-range angle often seen when jawline definition is present without extreme angularity.",
  },
  {
    key: "soft",
    label: "Soft",
    min: 135,
    max: 145,
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    summary:
      "Obtuser mandibular angle with smoother contour transition from ramus to chin.",
  },
  {
    key: "rounded",
    label: "Rounded",
    min: 146,
    max: 170,
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    summary:
      "Broad, obtuse jawline angle with less abrupt angular definition in profile.",
  },
];

const FACE_EXAMPLES = [
  { id: "jawline-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "jawline-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "jawline-c", label: "Example C", src: "/examples/boy-selfie.webp" },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function profileQualityClass(quality: "good" | "moderate" | "poor" | "uncertain") {
  if (quality === "good") return "bg-green-100 text-green-800 border-green-200";
  if (quality === "poor") return "bg-red-100 text-red-800 border-red-200";
  if (quality === "moderate") return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

function qualityLabel(quality: "good" | "moderate" | "poor" | "uncertain") {
  if (quality === "good") return "Good profile quality";
  if (quality === "moderate") return "Moderate profile quality";
  if (quality === "poor") return "Poor profile quality";
  return "Profile quality uncertain";
}

function typeOneLiner(type: JawlineTypeKey) {
  if (type === "very-sharp") return "Acute jawline angle with strong angular profile definition.";
  if (type === "sharp") return "Defined jawline angle with clear mandibular contour break.";
  if (type === "balanced") return "Mid-range jawline angle with moderate visible definition.";
  if (type === "soft") return "Smoother jawline transition with less pronounced gonial angle.";
  if (type === "rounded") return "Broad, obtuse jawline angle with softer side-profile contour.";
  return "The photo did not provide a reliable side-profile jawline angle.";
}

function findBandByType(type: JawlineTypeKey | null) {
  if (!type || type === "uncertain") return null;
  return JAWLINE_BANDS.find((band) => band.key === type) ?? null;
}

function findBandByAngle(angle: number | null) {
  if (angle == null) return null;
  return JAWLINE_BANDS.find((band) => angle >= band.min && angle <= band.max) ?? null;
}

function resolveActiveBand(angle: number | null, type: JawlineTypeKey | null) {
  return findBandByAngle(angle) ?? findBandByType(type);
}

function percent(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}

function JawlineAngleBar({ angle }: { angle: number }) {
  const safe = clamp(angle, 95, 160);
  const markerPct = ((160 - safe) / 65) * 100;

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
                  #f97316 26%,
                  #fde047 52%,
                  #22c55e 76%,
                  #16a34a 100%
                )`,
              }}
            />
            <div className="absolute inset-0 bg-white/15" />
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${markerPct}%`, transform: "translateX(-50%)" }}
            aria-label="Jawline angle marker"
            title={`Jawline angle ${safe.toFixed(1)} degrees`}
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
          {[160, 150, 140, 130, 120, 110, 100].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-gray-500">
          <span>Rounded</span>
          <span>Soft</span>
          <span>Balanced</span>
          <span>Sharp</span>
        </div>
      </div>
    </div>
  );
}

function JawlineBandTable({
  jawlineAngle,
  jawlineType,
}: {
  jawlineAngle: number | null;
  jawlineType: JawlineTypeKey | null;
}) {
  const activeBand = resolveActiveBand(jawlineAngle, jawlineType);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Angle Range (deg)
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Jawline Type
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody>
          {JAWLINE_BANDS.map((band) => {
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
                    {band.min}-{band.max}
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

function JawlineOverlayImage({
  imageUrl,
  landmarks,
}: {
  imageUrl: string;
  landmarks: {
    ramusPoint: { x: number; y: number } | null;
    gonionPoint: { x: number; y: number } | null;
    mentonPoint: { x: number; y: number } | null;
  };
}) {
  const hasRamus = !!landmarks.ramusPoint;
  const hasGonion = !!landmarks.gonionPoint;
  const hasMenton = !!landmarks.mentonPoint;

  const canDrawRamusLine = hasRamus && hasGonion;
  const canDrawJawBodyLine = hasGonion && hasMenton;
  const hasAnyOverlay = hasRamus || hasGonion || hasMenton;

  return (
    <div className="relative w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto">
      <img
        src={imageUrl}
        alt="Uploaded side-profile image for jawline check"
        className="w-full rounded-2xl shadow-xl bg-base-200"
      />

      {hasAnyOverlay ? (
        <>
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {canDrawRamusLine ? (
              <line
                x1={(landmarks.ramusPoint!.x * 100).toFixed(2)}
                y1={(landmarks.ramusPoint!.y * 100).toFixed(2)}
                x2={(landmarks.gonionPoint!.x * 100).toFixed(2)}
                y2={(landmarks.gonionPoint!.y * 100).toFixed(2)}
                stroke="#10b981"
                strokeWidth="0.7"
                strokeDasharray="2 1"
              />
            ) : null}

            {canDrawJawBodyLine ? (
              <line
                x1={(landmarks.gonionPoint!.x * 100).toFixed(2)}
                y1={(landmarks.gonionPoint!.y * 100).toFixed(2)}
                x2={(landmarks.mentonPoint!.x * 100).toFixed(2)}
                y2={(landmarks.mentonPoint!.y * 100).toFixed(2)}
                stroke="#2563eb"
                strokeWidth="0.7"
                strokeDasharray="2 1"
              />
            ) : null}

            {hasRamus ? (
              <circle
                cx={(landmarks.ramusPoint!.x * 100).toFixed(2)}
                cy={(landmarks.ramusPoint!.y * 100).toFixed(2)}
                r="1.1"
                fill="#10b981"
              />
            ) : null}
            {hasGonion ? (
              <circle
                cx={(landmarks.gonionPoint!.x * 100).toFixed(2)}
                cy={(landmarks.gonionPoint!.y * 100).toFixed(2)}
                r="1.2"
                fill="#111827"
              />
            ) : null}
            {hasMenton ? (
              <circle
                cx={(landmarks.mentonPoint!.x * 100).toFixed(2)}
                cy={(landmarks.mentonPoint!.y * 100).toFixed(2)}
                r="1.1"
                fill="#2563eb"
              />
            ) : null}
          </svg>

          {hasRamus ? (
            <div
              className="absolute -translate-y-full rounded-md bg-emerald-600/90 px-2 py-1 text-[10px] font-semibold text-white"
              style={{
                left: percent(landmarks.ramusPoint!.x),
                top: percent(landmarks.ramusPoint!.y),
                transform: "translate(-50%, -115%)",
              }}
            >
              Ramus
            </div>
          ) : null}

          {hasGonion ? (
            <div
              className="absolute -translate-y-full rounded-md bg-gray-900/90 px-2 py-1 text-[10px] font-semibold text-white"
              style={{
                left: percent(landmarks.gonionPoint!.x),
                top: percent(landmarks.gonionPoint!.y),
                transform: "translate(-50%, -115%)",
              }}
            >
              Gonion
            </div>
          ) : null}

          {hasMenton ? (
            <div
              className="absolute -translate-y-full rounded-md bg-blue-600/90 px-2 py-1 text-[10px] font-semibold text-white"
              style={{
                left: percent(landmarks.mentonPoint!.x),
                top: percent(landmarks.mentonPoint!.y),
                transform: "translate(-50%, -115%)",
              }}
            >
              Menton
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

function JawlineCheckPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useJawlineCheckAnalysis(imageUrl, { source });

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const pClass = "text-lg leading-relaxed";

  const activeBand = useMemo(
    () => resolveActiveBand(analysis?.jawlineAngle ?? null, analysis?.jawlineType ?? null),
    [analysis?.jawlineAngle, analysis?.jawlineType]
  );

  const alternativesText = useMemo(() => {
    if (!analysis?.alternatives?.length) return null;
    return analysis.alternatives.slice(0, 2).join(" or ");
  }, [analysis?.alternatives]);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Jawline Check</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a side-profile photo to estimate your jawline angle and classify jawline type with
          AI. You will get landmark points, angle score, confidence, and a category interpretation
          table.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/jawline-check" buttonLabel="Upload Side-Profile Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/jawline-check" examples={FACE_EXAMPLES} />
            </div>
            <p className="mt-5 text-sm text-gray-600 max-w-md text-center">
              Best results come from a clear side profile where jawline contour from ear area to chin
              is visible and unobstructed.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <JawlineOverlayImage
                  imageUrl={imageUrl}
                  landmarks={{
                    ramusPoint: analysis?.landmarks.ramusPoint ?? null,
                    gonionPoint: analysis?.landmarks.gonionPoint ?? null,
                    mentonPoint: analysis?.landmarks.mentonPoint ?? null,
                  }}
                />

                {analysis?.measurementAvailable ? (
                  <p className="mt-3 text-xs text-gray-600 text-center">
                    Dots mark ramus, gonion, and menton landmarks used for angle estimation.
                  </p>
                ) : null}
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Your Jawline Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing jawline geometry...</p>
                        <p className="text-sm text-gray-600">
                          Estimating profile visibility, landmark positions, and mandibular angle.
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
                        {analysis.jawlineTypeLabel}
                      </p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          analysis.confidence
                        )}`}
                      >
                        {analysis.confidence.toUpperCase()} confidence
                      </span>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${profileQualityClass(
                          analysis.profileQuality
                        )}`}
                      >
                        {qualityLabel(analysis.profileQuality)}
                      </span>
                    </div>

                    <p className="mt-3 text-lg text-gray-700">{typeOneLiner(analysis.jawlineType)}</p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl bg-base-200/70 p-3">
                        <div className="text-xs text-gray-600">Jawline Angle</div>
                        <div className="text-xl font-semibold text-gray-900 tabular-nums">
                          {analysis.jawlineAngle == null ? "N/A" : `${analysis.jawlineAngle.toFixed(1)}°`}
                        </div>
                      </div>
                      <div className="rounded-xl bg-base-200/70 p-3">
                        <div className="text-xs text-gray-600">Angle Score</div>
                        <div className="text-xl font-semibold text-gray-900 tabular-nums">
                          {analysis.angleScore}/100
                        </div>
                      </div>
                      <div className="rounded-xl bg-base-200/70 p-3">
                        <div className="text-xs text-gray-600">Confidence Score</div>
                        <div className="text-xl font-semibold text-gray-900 tabular-nums">
                          {analysis.confidenceScore}/100
                        </div>
                      </div>
                    </div>

                    {analysis.rationale ? (
                      <p className="mt-4 text-gray-700 leading-relaxed">{analysis.rationale}</p>
                    ) : null}

                    {alternativesText ? (
                      <p className="mt-3 text-sm text-gray-600">
                        Secondary possible type: {alternativesText}
                      </p>
                    ) : null}

                    {!analysis.sideProfileVisible ? (
                      <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                        A clear side profile was not detected. Retake the photo with one full profile side
                        visible for better angle measurement reliability.
                      </div>
                    ) : null}

                    {analysis.measurementNotes.length ? (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900">Measurement notes</h3>
                        <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                          {analysis.measurementNotes.map((note, idx) => (
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
        {typeof analysis?.jawlineAngle === "number" ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Jawline Angle Interpretation Bar</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Lower angle values generally map to sharper profile classification bands.
            </p>
            <div className="mt-8">
              <JawlineAngleBar angle={analysis.jawlineAngle} />
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your estimated jawline type band.
          </p>
          <JawlineBandTable
            jawlineAngle={analysis?.jawlineAngle ?? null}
            jawlineType={analysis?.jawlineType ?? null}
          />
        </div>

        {activeBand ? (
          <div className="w-full max-w-3xl mx-auto mt-8">
            <p className="text-center text-gray-700">
              Current category: <span className={`font-semibold ${activeBand.textClass}`}>{activeBand.label}</span>
            </p>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>How Jawline Check Measures Angle</h2>
          <p className={pClass}>
            This tool estimates a side-profile mandibular angle at the gonion using three landmarks:
            one point along the posterior ramus line, the gonial corner, and a chin-edge point near
            menton. The angle between these two lines is used to classify jawline type.
          </p>
          <p className={pClass}>
            The output is an appearance-based estimate from one photo, not a cephalometric diagnosis.
            Camera angle, expression, hair occlusion, and perspective can all shift the visible angle.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Take Better Jawline Photos</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Use a true side profile (about 90 degrees) instead of a three-quarter angle.</li>
            <li>Keep your head neutral without chin tuck or neck extension.</li>
            <li>Use even lighting; avoid deep shadows under the jaw border.</li>
            <li>Pull hair, beard bulk, scarves, or collars away from the jawline edge.</li>
            <li>Use normal camera distance to reduce perspective distortion.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Interpret Jawline Angle and Type</h2>
          <p className={pClass}>
            Jawline type labels in this tool are practical visual buckets for profile analysis. They are
            useful for grooming, haircut planning, and photo-comparison consistency, but they should
            not be treated as fixed anatomical identity labels.
          </p>
          <p className={pClass}>
            If confidence is low or profile quality is poor, prioritize retaking the photo and looking
            for consistent outcomes across multiple uploads before drawing conclusions.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Landmark Overlay and Angle Geometry</h2>
          <p className={pClass}>
            The overlay dots help visualize where the model placed the measurement points. Dashed lines
            indicate the posterior mandibular segment and the mandibular body segment used to estimate
            the angle.
          </p>
          <p className={pClass}>
            When these points are misaligned because of occlusion or blur, the angle estimate becomes
            less stable. In those cases, use retake guidance and compare multiple photos.
          </p>
        </div>

        {analysis?.recommendations?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Practical Interpretation Notes</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.recommendations.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {analysis?.retakeTips?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Retake Tips from Your Scan</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {analysis.retakeTips.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>Use This with Other Face Tools</h2>
          <p className={pClass}>
            Pair this jawline result with broader face scans from the{" "}
            <a className="text-primary underline" href="/tools/face">
              Face Tools
            </a>{" "}
            category to add context.
          </p>
          <p className={pClass}>
            For complementary feature analysis, run{" "}
            <a className="text-primary underline" href="/face-shape-detector">
              Face Shape Detector
            </a>{" "}
            and{" "}
            <a className="text-primary underline" href="/face-symmetry-test">
              Face Symmetry Test
            </a>
            . You can also compare with{" "}
            <a className="text-primary underline" href="/golden-face-ratio-analyzer">
              Golden Face Ratio Analyzer
            </a>{" "}
            for proportion-based context.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            This is an appearance-based AI estimate. It is sensitive to camera perspective, occlusion,
            beard density, posture, and image quality. It does not replace clinical cephalometric
            assessment or medical evaluation.
          </p>
          <p className={pClass}>
            A single image can be misleading. Use repeated photos with consistent setup to improve
            reliability when tracking profile changes over time.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Upadhyay RB, Upadhyay J, Agrawal P, Rao NN. Analysis of gonial angle in relation to age,
              gender and dentition status by radiological and anthropometric methods.
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/23293431/">
                PubMed record
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
              Kazemi V, Sullivan J. One millisecond face alignment with an ensemble of regression trees.
              <a className="text-primary underline ml-1" href="https://arxiv.org/abs/1404.6412">
                arXiv paper
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
              "face-symmetry-test",
              "golden-face-ratio-analyzer",
              "eye-shape-detector",
              "eyebrow-type-detector",
              "nose-shape-detector",
              "skin-type-detector",
              "hair-color-detector",
              "age-guesser",
              "attractiveness-test",
              "body-shape-analyzer",
              "estimate",
              "body-visualizer",
              "height-estimator",
              "calorie-estimator",
              "ffmi-calculator",
            ]}
            excludeSlug="jawline-check"
          />
        </div>
      </section>
    </main>
  );
}

const JawlineCheckPageClient = dynamic(() => Promise.resolve(JawlineCheckPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default JawlineCheckPageClient;
