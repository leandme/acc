"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import CTA from "@/app/components/common/cta";
import RippleLoader from "@/app/components/common/loader";
import TryExamples from "@/app/components/common/try-examples";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "@/app/components/tools/template/more-tools";
import {
  JawlineTypeKey,
  useJawlineCheckAnalysis,
} from "@/app/hooks/useJawlineCheckAnalysis";

type JawlineBand = {
  key: Exclude<JawlineTypeKey, "uncertain"> | "blockish";
  label: string;
  min: number;
  max: number;
  colorClass: string;
  textClass: string;
  summary: string;
  rangeLabel?: string;
};

const JAWLINE_BANDS: JawlineBand[] = [
  {
    key: "very-sharp",
    label: "Very Sharp",
    min: 91,
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

const LOW_ANGLE_BAND: JawlineBand = {
  key: "blockish",
  label: "Blockish (Not Desired)",
  min: 0,
  max: 90,
  rangeLabel: "\u226490",
  colorClass: "bg-blue-50",
  textClass: "text-blue-800",
  summary:
    "Very low mandibular angle. This bucket is treated as a non-desired/blockish profile zone.",
};

const JAWLINE_TABLE_BANDS: JawlineBand[] = [LOW_ANGLE_BAND, ...JAWLINE_BANDS];

const FACE_EXAMPLES = [
  { id: "jawline-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "jawline-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "jawline-c", label: "Example C", src: "/examples/man-selfie.webp" },
];

const JAWLINER_SITE_URL =
  "https://jawliner.com/products/ultra-hard-fitness-chewing-gum?variant=55606187491715";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
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
  if (angle <= LOW_ANGLE_BAND.max) return LOW_ANGLE_BAND;
  return JAWLINE_BANDS.find((band) => angle >= band.min && angle <= band.max) ?? null;
}

function resolveActiveBand(angle: number | null, type: JawlineTypeKey | null) {
  return findBandByAngle(angle) ?? findBandByType(type);
}

function percent(v: number) {
  return `${(v * 100).toFixed(2)}%`;
}

type LandmarkPoint = { x: number; y: number };

type JawlineManualLandmarks = {
  ramusPoint: LandmarkPoint;
  gonionPoint: LandmarkPoint;
  mentonPoint: LandmarkPoint;
};

type JawlineManualKey = keyof JawlineManualLandmarks;

const DEFAULT_MANUAL_LANDMARKS: JawlineManualLandmarks = {
  ramusPoint: { x: 0.34, y: 0.38 },
  gonionPoint: { x: 0.5, y: 0.62 },
  mentonPoint: { x: 0.73, y: 0.76 },
};

const LANDMARK_UI: Record<
  JawlineManualKey,
  {
    label: string;
    dotClass: string;
    labelClass: string;
    lineColor: string;
  }
> = {
  ramusPoint: {
    label: "Ramus",
    dotClass: "bg-emerald-500 border-emerald-700",
    labelClass: "bg-emerald-600/90",
    lineColor: "#10b981",
  },
  gonionPoint: {
    label: "Gonion",
    dotClass: "bg-gray-900 border-gray-950",
    labelClass: "bg-gray-900/90",
    lineColor: "#111827",
  },
  mentonPoint: {
    label: "Menton",
    dotClass: "bg-blue-600 border-blue-800",
    labelClass: "bg-blue-600/90",
    lineColor: "#2563eb",
  },
};

function jawlineTypeLabel(type: JawlineTypeKey) {
  if (type === "very-sharp") return "Very Sharp";
  if (type === "sharp") return "Sharp";
  if (type === "balanced") return "Balanced";
  if (type === "soft") return "Soft";
  if (type === "rounded") return "Rounded";
  return "Uncertain";
}

function classifyJawlineByAngle(angle: number): Exclude<JawlineTypeKey, "uncertain"> {
  if (angle <= 114) return "very-sharp";
  if (angle <= 124) return "sharp";
  if (angle <= 134) return "balanced";
  if (angle <= 145) return "soft";
  return "rounded";
}

function computeManualJawlineAngle(landmarks: JawlineManualLandmarks): number {
  const ramus = landmarks.ramusPoint;
  const gonion = landmarks.gonionPoint;
  const menton = landmarks.mentonPoint;

  const v1x = ramus.x - gonion.x;
  const v1y = ramus.y - gonion.y;
  const v2x = menton.x - gonion.x;
  const v2y = menton.y - gonion.y;

  const mag1 = Math.hypot(v1x, v1y);
  const mag2 = Math.hypot(v2x, v2y);
  if (mag1 < 0.01 || mag2 < 0.01) return 0;

  const dot = v1x * v2x + v1y * v2y;
  const cosine = clamp(dot / (mag1 * mag2), -1, 1);
  const angle = (Math.acos(cosine) * 180) / Math.PI;
  return Number(clamp(angle, 80, 170).toFixed(1));
}

function deriveAngleScore(angle: number): number {
  const score = ((160 - angle) / 52) * 100;
  return clamp(Math.round(score), 0, 100);
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
          {JAWLINE_TABLE_BANDS.map((band) => {
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
                    {band.rangeLabel ?? `${band.min}-${band.max}`}
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

function JawlineOverlayEditor({
  imageUrl,
  landmarks,
  onChange,
}: {
  imageUrl: string;
  landmarks: JawlineManualLandmarks;
  onChange: (next: JawlineManualLandmarks) => void;
}) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<JawlineManualKey | null>(null);

  const clientToPoint = useCallback((clientX: number, clientY: number) => {
    const frame = frameRef.current;
    if (!frame) return null;
    const rect = frame.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;

    return {
      x: Number(clamp((clientX - rect.left) / rect.width, 0, 1).toFixed(5)),
      y: Number(clamp((clientY - rect.top) / rect.height, 0, 1).toFixed(5)),
    };
  }, []);

  const updateLandmark = useCallback(
    (key: JawlineManualKey, point: LandmarkPoint) => {
      onChange({
        ...landmarks,
        [key]: point,
      });
    },
    [landmarks, onChange]
  );

  useEffect(() => {
    const onPointerUp = () => setDragging(null);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="relative w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto touch-none select-none"
    >
      <img
        src={imageUrl}
        alt="Uploaded side-profile image for jawline check"
        className="w-full rounded-2xl shadow-xl bg-base-200"
        draggable={false}
      />

      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1={(landmarks.ramusPoint.x * 100).toFixed(2)}
          y1={(landmarks.ramusPoint.y * 100).toFixed(2)}
          x2={(landmarks.gonionPoint.x * 100).toFixed(2)}
          y2={(landmarks.gonionPoint.y * 100).toFixed(2)}
          stroke={LANDMARK_UI.ramusPoint.lineColor}
          strokeWidth="0.7"
          strokeDasharray="2 1"
        />
        <line
          x1={(landmarks.gonionPoint.x * 100).toFixed(2)}
          y1={(landmarks.gonionPoint.y * 100).toFixed(2)}
          x2={(landmarks.mentonPoint.x * 100).toFixed(2)}
          y2={(landmarks.mentonPoint.y * 100).toFixed(2)}
          stroke={LANDMARK_UI.mentonPoint.lineColor}
          strokeWidth="0.7"
          strokeDasharray="2 1"
        />
      </svg>

      {(Object.keys(LANDMARK_UI) as JawlineManualKey[]).map((key) => {
        const point = landmarks[key];
        const ui = LANDMARK_UI[key];

        return (
          <div key={key}>
            <button
              type="button"
              className={[
                "absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-md",
                "cursor-grab active:cursor-grabbing touch-none",
                ui.dotClass,
                dragging === key ? "scale-110 ring-2 ring-black/30" : "",
              ].join(" ")}
              style={{ left: percent(point.x), top: percent(point.y) }}
              aria-label={`Drag ${ui.label} point`}
              onPointerDown={(event) => {
                event.preventDefault();
                setDragging(key);
                event.currentTarget.setPointerCapture(event.pointerId);
                const next = clientToPoint(event.clientX, event.clientY);
                if (next) updateLandmark(key, next);
              }}
              onPointerMove={(event) => {
                if (dragging !== key) return;
                const next = clientToPoint(event.clientX, event.clientY);
                if (next) updateLandmark(key, next);
              }}
              onPointerUp={(event) => {
                setDragging(null);
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
              }}
            />

            <div
              className={`absolute -translate-y-full rounded-md px-2 py-1 text-[10px] font-semibold text-white pointer-events-none ${ui.labelClass}`}
              style={{
                left: percent(point.x),
                top: percent(point.y),
                transform: "translate(-50%, -115%)",
              }}
            >
              {ui.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function JawlineCheckPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";

  const [manualLandmarks, setManualLandmarks] = useState<JawlineManualLandmarks>(
    DEFAULT_MANUAL_LANDMARKS
  );
  const [autoRequestKey, setAutoRequestKey] = useState(0);
  const [autoImageUrl, setAutoImageUrl] = useState<string | null>(null);

  const autoRunImageUrl = useMemo(() => {
    if (!imageUrl || !autoImageUrl) return null;
    return autoImageUrl === imageUrl ? imageUrl : null;
  }, [autoImageUrl, imageUrl]);

  const { analysis: autoAnalysis, loading: autoLoading, error: autoError } =
    useJawlineCheckAnalysis(autoRequestKey > 0 ? autoRunImageUrl : null, {
      source,
      requestKey: autoRequestKey,
    });

  useEffect(() => {
    setManualLandmarks(DEFAULT_MANUAL_LANDMARKS);
    setAutoRequestKey(0);
    setAutoImageUrl(null);
  }, [imageUrl]);

  useEffect(() => {
    const landmarks = autoAnalysis?.landmarks;
    if (!landmarks?.ramusPoint || !landmarks?.gonionPoint || !landmarks?.mentonPoint) return;

    setManualLandmarks({
      ramusPoint: landmarks.ramusPoint,
      gonionPoint: landmarks.gonionPoint,
      mentonPoint: landmarks.mentonPoint,
    });
  }, [autoAnalysis]);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const pClass = "text-lg leading-relaxed";

  const manualAngle = useMemo(() => computeManualJawlineAngle(manualLandmarks), [manualLandmarks]);
  const manualType = useMemo(() => classifyJawlineByAngle(manualAngle), [manualAngle]);
  const manualTypeText = useMemo(() => jawlineTypeLabel(manualType), [manualType]);
  const manualAngleScore = useMemo(() => deriveAngleScore(manualAngle), [manualAngle]);

  const activeBand = useMemo(
    () => resolveActiveBand(manualAngle, manualType),
    [manualAngle, manualType]
  );

  const onAutoDetect = useCallback(() => {
    if (!imageUrl) return;
    setAutoImageUrl(imageUrl);
    setAutoRequestKey((value) => value + 1);
  }, [imageUrl]);

  const onReset = useCallback(() => {
    setManualLandmarks(DEFAULT_MANUAL_LANDMARKS);
  }, []);

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Jawline Check</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a side-profile photo, then drag three points on the image to set your jawline
          angle manually. This gives you direct control when auto-placement is off.
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
              Use a clear side profile where ear-side jawline contour to chin is visible and not
              blocked by hair, beard bulk, or collars.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <JawlineOverlayEditor
                  imageUrl={imageUrl}
                  landmarks={manualLandmarks}
                  onChange={setManualLandmarks}
                />

                <p className="mt-3 text-xs text-gray-600 text-center">
                  Drag Ramus, Gonion, and Menton points to match your profile geometry.
                </p>
                {autoAnalysis && !autoLoading && !autoError ? (
                  <p className="mt-2 text-xs text-emerald-700 text-center">
                    Auto-detected points loaded. Fine-tune manually for best accuracy.
                  </p>
                ) : null}
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Your Jawline Result</h2>

                <div className="mt-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <p
                      className={`text-3xl lg:text-4xl font-bold ${activeBand?.textClass ?? "text-gray-900"}`}
                    >
                      {manualTypeText}
                    </p>
                    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
                      Manual landmarks
                    </span>
                    {autoAnalysis ? (
                      <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-700">
                        Auto-detect: {autoAnalysis.confidence.toUpperCase()} confidence
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-lg text-gray-700">{typeOneLiner(manualType)}</p>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-base-200/70 p-3">
                      <div className="text-xs text-gray-600">Jawline Angle</div>
                      <div
                        className={`text-3xl lg:text-4xl font-semibold tabular-nums ${
                          activeBand?.textClass ?? "text-gray-900"
                        }`}
                      >
                        {manualAngle.toFixed(1)}°
                      </div>
                    </div>
                    <div className="rounded-xl bg-base-200/70 p-3">
                      <div className="text-xs text-gray-600">Angle Score</div>
                      <div className="text-xl font-semibold text-gray-900 tabular-nums">
                        {manualAngleScore}/100
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={onReset}
                      className="rounded-btn border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Reset Points
                    </button>
                    <button
                      type="button"
                      onClick={onAutoDetect}
                      className="rounded-btn border border-gray-900 bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                    >
                      Auto-Detect Points (Optional)
                    </button>
                  </div>

                  {autoLoading ? (
                    <div className="mt-5">
                      <div className="flex items-center gap-4">
                        <RippleLoader />
                        <div>
                          <p className="text-lg text-gray-800 font-semibold">Auto-detecting jawline points...</p>
                          <p className="text-sm text-gray-600">
                            This can help prefill landmarks before manual refinement.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {autoError ? (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                      <p className="whitespace-pre-line text-red-700">{autoError}</p>
                    </div>
                  ) : null}

                  {autoAnalysis?.rationale ? (
                    <p className="mt-4 text-gray-700 leading-relaxed">{autoAnalysis.rationale}</p>
                  ) : null}

                  {autoAnalysis?.measurementNotes.length ? (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900">Auto-detect notes</h3>
                      <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                        {autoAnalysis.measurementNotes.map((note, idx) => (
                          <li key={`${note}-${idx}`}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-6">
        {imageUrl ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Jawline Angle Interpretation Bar</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Lower angle values generally map to sharper profile classification bands.
            </p>
            <div className="mt-8">
              <JawlineAngleBar angle={manualAngle} />
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row marks your current jawline type band from manual point placement.
          </p>
          <JawlineBandTable jawlineAngle={manualAngle} jawlineType={manualType} />
        </div>

        {activeBand ? (
          <div className="w-full max-w-3xl mx-auto mt-8">
            <p className="text-center text-gray-700">
              Current category:{" "}
              <span className={`font-semibold ${activeBand.textClass}`}>{activeBand.label}</span>
            </p>
          </div>
        ) : null}

        <div className={sectionWrap}>
          <h2 className={h2Class}>How Jawline Check Measures Angle</h2>
          <p className={pClass}>
            This tool measures the side-profile mandibular angle at gonion using three landmarks:
            one point along the posterior ramus line, the gonial corner, and a chin-edge point near
            menton. The interior angle between these two segments is used to classify jawline type.
          </p>
          <p className={pClass}>
            The primary workflow is user-set geometry, so you can correct landmark placement directly.
            Auto-detect is optional and meant as a starting point.
          </p>
          <CTA
            title="Want a Sharper Jawline? Train it Daily."
            description="You are already tracking your jawline angle here. Pair that progress with Jawliner and turn quick daily sessions into a stronger, more defined profile over time."
            buttonText="Shop Jawliner Now →"
            href={JAWLINER_SITE_URL}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            image="/tools/jawline/jawliner.webp"
            className="!my-0 !mt-40"
          />
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
            If point placement is uncertain, compare multiple placements and use consistent photo setup
            before drawing conclusions.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Landmark Overlay and Angle Geometry</h2>
          <p className={pClass}>
            The overlay dots represent user-controlled landmarks. Dashed lines indicate the posterior
            mandibular segment and mandibular body segment used to estimate the angle.
          </p>
          <p className={pClass}>
            Small point shifts can materially change angle output. Zoom in visually, place points
            carefully, and keep your method consistent if you are tracking over time.
          </p>
        </div>

        {autoAnalysis?.recommendations?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Auto-Detect Interpretation Notes</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {autoAnalysis.recommendations.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {autoAnalysis?.retakeTips?.length ? (
          <div className={sectionWrap}>
            <h2 className={h2Class}>Auto-Detect Retake Tips</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              {autoAnalysis.retakeTips.map((tip, idx) => (
                <li key={`${tip}-${idx}`}>{tip}</li>
              ))}
            </ul>
          </div>
        ) : null}


        <div className={sectionWrap}>
          <h2 className={h2Class}>Limitations</h2>
          <p className={pClass}>
            This is an appearance-based estimate from one photo and manual landmark placement. It is
            sensitive to camera perspective, occlusion, beard density, posture, and image quality.
          </p>
          <p className={pClass}>
            It does not replace clinical cephalometric assessment or medical evaluation.
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
              "skin-analyzer",
              "hair-color-detector",
              "hair-type-detector",
              "age-guesser",
              "attractiveness-test",
              "body-shape-analyzer",
              "estimate",
              "body-visualizer",
              "height-estimator",
              "calorie-counter",
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
