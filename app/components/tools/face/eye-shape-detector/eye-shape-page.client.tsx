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
  CanthalTiltKey,
  EyeShapeKey,
  useEyeShapeAnalysis,
} from "@/app/hooks/useEyeShapeAnalysis";

type EyeShapeRow = {
  key: Exclude<EyeShapeKey, "uncertain">;
  label: string;
  colorClass: string;
  textClass: string;
  pattern: string;
  direction: string;
};

type EyeShapeVisual = {
  id: string;
  title: string;
  src: string;
  description: string;
  shapeKey?: EyeShapeRow["key"];
};

type HowToStep = {
  id: string;
  title: string;
  description: string;
};

type EyeShapeBenefit = {
  id: string;
  title: string;
  description: string;
};

const EYE_SHAPE_ROWS: EyeShapeRow[] = [
  {
    key: "almond",
    label: "Almond",
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    pattern: "Tapered outer corners with balanced vertical lid opening.",
    direction: "Most eyeliner and lash directions work with minimal correction.",
  },
  {
    key: "round",
    label: "Round",
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    pattern: "Larger visible iris opening and more circular eye contour.",
    direction: "Outer-corner extension can add horizontal balance.",
  },
  {
    key: "hooded",
    label: "Hooded",
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    pattern: "Upper lid fold sits lower over mobile lid area.",
    direction: "Lift-focused crease placement and outer lift lines often work best.",
  },
  {
    key: "monolid",
    label: "Monolid",
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    pattern: "Minimal visible supratarsal crease with smooth lid plane.",
    direction: "Gradient shadow and tightlining can define without crowding lid space.",
  },
  {
    key: "upturned",
    label: "Upturned",
    colorClass: "bg-emerald-50",
    textClass: "text-emerald-800",
    pattern: "Outer corners sit slightly higher than inner corners.",
    direction: "Balanced liner width helps keep lift without over-accentuating tilt.",
  },
  {
    key: "downturned",
    label: "Downturned",
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    pattern: "Outer corners sit lower than inner corners at rest.",
    direction: "Lifted outer placement can visually neutralize downward tilt.",
  },
  {
    key: "deep-set",
    label: "Deep Set",
    colorClass: "bg-violet-50",
    textClass: "text-violet-800",
    pattern: "Eyes sit visually deeper under brow bone projection.",
    direction: "Reflective center-lid placement can bring forward eye presence.",
  },
  {
    key: "protruding",
    label: "Protruding",
    colorClass: "bg-cyan-50",
    textClass: "text-cyan-800",
    pattern: "Eye globe appears more prominent relative to orbital contour.",
    direction: "Softer matte contouring can add depth balance around lid perimeter.",
  },
];

const EYE_SHAPE_VISUALS: EyeShapeVisual[] = [
  {
    id: "almond",
    title: "Almond Eyes",
    src: "/tools/eye-shape-detector/almond-eyes.png",
    description:
      "Almond eyes have a slightly pointed outer corner and a visible crease. They are wider than they are tall, creating a naturally balanced look. This versatile shape works well with soft blends, bold liner, and subtle outer-corner lift.",
    shapeKey: "almond",
  },
  {
    id: "round",
    title: "Round Eyes",
    src: "/tools/eye-shape-detector/round-eyes.png",
    description:
      "Round eyes look open and circular, often with more visible white around the iris. They create a bright, youthful expression. Winged liner or smoky outer shading can add definition and gentle elongation.",
    shapeKey: "round",
  },
  {
    id: "hooded",
    title: "Hooded Eyes",
    src: "/tools/eye-shape-detector/hooded-eyes.png",
    description:
      "Hooded eyes have a lower-set upper fold that can partially cover the mobile lid and soften crease visibility. Lifted outer placement and controlled liner thickness usually work best. Blended, upward shadow placement helps keep the look open.",
    shapeKey: "hooded",
  },
  {
    id: "upturned",
    title: "Upturned Eyes",
    src: "/tools/eye-shape-detector/upturned%20eyes.png",
    description:
      "Upturned eyes have outer corners that sit higher than inner corners, giving a naturally lifted effect. This shape already carries cat-eye energy. Soft smoky blending or balanced liner width helps enhance lift without over-accentuating tilt.",
    shapeKey: "upturned",
  },
  {
    id: "downturned",
    title: "Downturned Eyes",
    src: "/tools/eye-shape-detector/downturned-eyes.png",
    description:
      "Downturned eyes have outer corners that sit lower than inner corners, creating a softer, gentler expression. Lifted outer-corner liner and upward shading can visually rebalance the tilt. Curled lashes and mascara also help open the eye area.",
    shapeKey: "downturned",
  },
  {
    id: "deep-set",
    title: "Deep-Set Eyes",
    src: "/tools/eye-shape-detector/deep-set-eyes.png",
    description:
      "Deep-set eyes sit farther under the brow bone, often creating natural crease depth and shadow. Light-reflective center-lid shades and soft blending can bring the eyes forward. Avoiding very heavy crease darkness helps maintain brightness.",
    shapeKey: "deep-set",
  },
  {
    id: "protruding",
    title: "Protruding Eyes",
    src: "/tools/eye-shape-detector/protruding-eyes.png",
    description:
      "Protruding eyes appear more forward relative to the orbital contour and often look expressive. Soft matte contouring and deeper outer-corner tones can add balance. Smudged liner and blended shadows help keep definition smooth, not harsh.",
    shapeKey: "protruding",
  },
  {
    id: "close-set",
    title: "Close-Set Eyes",
    src: "/tools/eye-shape-detector/close-set-eyes.png",
    description:
      "Close-set eyes have less space between inner corners. Brightening the inner corners and extending shadow outward can create the illusion of more distance. Winged or elongated liner styles usually enhance horizontal balance.",
  },
  {
    id: "wide-set",
    title: "Wide-Set Eyes",
    src: "/tools/eye-shape-detector/wide-set-eyes.png",
    description:
      "Wide-set eyes have more space between inner corners and can look fresh and open. Deeper inner-corner shading and defined liner can visually bring the eyes closer together. This shape also supports bold shadow looks while maintaining symmetry.",
  },
];

const FACE_EXAMPLES = [
  { id: "eye-a", label: "Example A", src: "/examples/man-selfie.webp" },
  { id: "eye-b", label: "Example B", src: "/examples/woman-selfie.webp" },
  { id: "eye-c", label: "Example C", src: "/examples/man-selfie.webp" },
];

const HOW_TO_USE_STEPS: HowToStep[] = [
  {
    id: "1",
    title: "Upload a Clear Face Photo",
    description: "Use a front-facing photo where both eyes are visible and not blocked by heavy shadows.",
  },
  {
    id: "2",
    title: "Let the Scan Process",
    description:
      "The detector estimates eye-shape geometry, canthal tilt, and color pattern from the uploaded image.",
  },
  {
    id: "3",
    title: "Review and Compare",
    description:
      "Check your primary result, then compare it with the visual examples and styling guidance below.",
  },
];

const EYE_SHAPE_BENEFITS: EyeShapeBenefit[] = [
  {
    id: "makeup",
    title: "Improve Makeup Placement",
    description:
      "Use liner, shadow, and lash direction that matches your natural eye structure instead of guessing.",
  },
  {
    id: "eyewear",
    title: "Choose Better Eyewear",
    description:
      "Pick frame shapes and lens balance that complement your eye contour and overall facial proportions.",
  },
  {
    id: "confidence",
    title: "Build Styling Confidence",
    description:
      "Knowing your shape makes beauty decisions faster and helps you repeat looks that actually suit you.",
  },
];

const EYE_SHAPE_FAQS: FaqSectionItem[] = [
  {
    question: "What is an eye shape detector and how does it work?",
    answer:
      "Our eye shape detector is an AI-powered tool that analyzes a face photo to estimate your eye-shape category. It evaluates visible features like lid contour, crease visibility, and eye opening, then returns a primary match with styling-oriented guidance.",
  },
  {
    question: "How can I determine my eye shape accurately?",
    answer:
      "Use a clear, front-facing image with both eyes visible and even lighting. The detector compares key eye-area cues from your photo to common shape patterns to produce a more reliable estimate.",
  },
  {
    question: "Is this the best eye shape detector online?",
    answer:
      "This tool is designed to give fast, consistent eye-shape estimates with practical styling context. While no photo-based model is perfect, clear input photos and stable setup usually produce stronger results.",
  },
  {
    question: "How do I find my eye shape using this online guide?",
    answer:
      "Upload a clear photo where you are looking directly at the camera, then review the detected primary shape and comparison table. You can use the visual examples and notes below to validate how your features align.",
  },
  {
    question: "What types of photos work best for eye shape detection?",
    answer:
      "Choose a sharp, well-lit image with both eyes visible, neutral expression, and minimal glare. Heavy makeup, strong filters, large head tilt, or partial eye occlusion can reduce detection quality.",
  },
  {
    question: "Are personalized eye shape tips included?",
    answer:
      "Yes. After analysis, the tool provides tailored styling guidance based on your detected shape pattern, including directional suggestions you can adapt for makeup and presentation choices.",
  },
  {
    question: "Why might my result change between photos?",
    answer:
      "Small changes in camera angle, lighting direction, expression, and eye openness can alter the visible geometry. For the most comparable scans, keep framing, lighting, and pose as consistent as possible.",
  },
  {
    question: "Is this tool medical advice?",
    answer:
      "No. This is a non-medical appearance analysis tool intended for educational and styling context. For clinical eye-health concerns, consult a qualified healthcare professional.",
  },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function tiltColor(tilt: CanthalTiltKey) {
  if (tilt === "positive") return "text-green-700";
  if (tilt === "negative") return "text-red-700";
  if (tilt === "neutral") return "text-blue-700";
  return "text-gray-700";
}

function CanthalTiltBar({ angle }: { angle: number }) {
  const bounded = clamp(angle, -15, 15);
  const markerPct = ((bounded + 15) / 30) * 100;

  return (
    <div className="w-full overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="w-full px-6 pt-6 pb-5">
        <div className="relative">
          <div className="relative h-12 rounded-full overflow-hidden border border-black/10 bg-base-200 shadow-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_6px_18px_rgba(0,0,0,0.16)]">
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to right, #ef4444 0%, #fde047 50%, #22c55e 100%)",
              }}
            />
            <div className="absolute inset-0 bg-white/15" />
          </div>

          <div
            className="absolute -top-3"
            style={{ left: `${markerPct}%`, transform: "translateX(-50%)" }}
            aria-label="Canthal tilt marker"
            title={`Canthal tilt ${bounded.toFixed(1)} degrees`}
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
          {[-15, -10, -5, 0, 5, 10, 15].map((v) => (
            <span key={v} className="tabular-nums">
              {v}
            </span>
          ))}
        </div>

        <div className="mt-2 flex justify-between text-[11px] text-gray-500">
          <span>Negative</span>
          <span>Neutral</span>
          <span>Positive</span>
        </div>
      </div>
    </div>
  );
}

function EyeShapeTable({ activeShape }: { activeShape: EyeShapeKey | null }) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Eye Shape
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
          {EYE_SHAPE_ROWS.map((row) => {
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

function EyeShapePageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { analysis, loading, error } = useEyeShapeAnalysis(imageUrl, { source });

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
        <H1>Eye Shape Detector</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a clear portrait to detect eye shape, canthal tilt, and eye color with AI.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/eye-shape-detector" buttonLabel="Upload Face Photo" />
            </div>
            <div className="w-full max-w-lg mt-6 lg:max-w-xl">
              <TryExamples basePath="/eye-shape-detector" examples={FACE_EXAMPLES} />
            </div>

            <div className="w-full max-w-5xl mt-20 lg:mt-28">
              <h2 className={h2Class}>How to Use Eye Shape Detector</h2>
              <p className="mt-4 text-center text-lg text-gray-700 max-w-3xl mx-auto">
                Follow these quick steps to get a clear eye-shape result and compare it with the reference
                examples.
              </p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                {HOW_TO_USE_STEPS.map((step) => (
                  <article key={step.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
                      {step.id}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-center text-gray-900">{step.title}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-left text-gray-700">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded image for eye-shape analysis"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Eye Analysis Result</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing eyes...</p>
                        <p className="text-sm text-gray-600">
                          Estimating shape contours, canthal tilt, and iris color profile.
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
                      Eye color:{" "}
                      <span className="font-semibold">{analysis.eyeColorLabel}</span>
                      {" "}(
                      <span className="font-semibold">{analysis.eyeColorConfidence}/100</span>)
                    </p>

                    <p className="mt-2 text-lg text-gray-700">
                      Canthal tilt:{" "}
                      <span className={`font-semibold ${tiltColor(analysis.canthalTilt)}`}>
                        {analysis.canthalTiltLabel}
                      </span>
                      {analysis.canthalTiltAngle != null ? (
                        <>
                          {" "}(
                          <span className="font-semibold">{analysis.canthalTiltAngle.toFixed(1)}°</span>)
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

                    {analysis.secondaryTones.length ? (
                      <p className="mt-2 text-sm text-gray-600">
                        Secondary eye-color tones:{" "}
                        <span className="font-semibold text-gray-800">
                          {analysis.secondaryTones.join(", ")}
                        </span>
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
        {analysis?.canthalTiltAngle != null ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Canthal Tilt Interpretation</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Marker shows estimated canthal tilt angle from negative to positive range.
            </p>
            <div className="mt-8">
              <CanthalTiltBar angle={analysis.canthalTiltAngle} />
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>What Is My Eye Shape?</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row shows the detected primary eye-shape category.
          </p>
          <EyeShapeTable activeShape={activeShape} />
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Common Eye Shapes</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            Quick visual examples of common eye-shape patterns.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {EYE_SHAPE_VISUALS.map((visual) => {
              const isActive = visual.shapeKey != null && activeShape === visual.shapeKey;
              return (
                <article
                  key={visual.id}
                  className={[
                    "overflow-hidden rounded-2xl border bg-white shadow-sm",
                    isActive ? "ring-2 ring-gray-900 border-gray-900/40" : "border-gray-200",
                  ].join(" ")}
                >
                  <div className="aspect-[3/2] bg-base-200">
                    <img
                      src={visual.src}
                      alt={`${visual.title} example`}
                      className="h-full w-full object-cover"
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

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Why Knowing Your Eye Shape Matters</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            A clearer read on your eye structure makes styling choices more consistent and intentional.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {EYE_SHAPE_BENEFITS.map((benefit) => (
              <article key={benefit.id} className="rounded-2xl border bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                <p className="mt-3 text-lg leading-relaxed text-gray-700">{benefit.description}</p>
              </article>
            ))}
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
          <h2 className={h2Class}>How This Eye Shape Detector Works</h2>
          <p className={pClass}>
            Upload a clear, front-facing photo, and the tool maps key points around your eyes to
            analyze your structure.
          </p>
          <p className={pClass}>
            We trace the eyelid contours to identify your eye shape (e.g. almond, round, hooded),
            and measure your canthal tilt by comparing the angle between the inner and outer corners
            of your eyes. We also estimate your dominant iris color based on pixel distribution.
          </p>
          <p className={pClass}>
            From this, you get a breakdown of your eye structure - designed to help you better
            understand your features and what suits you best.
          </p>
          <p className={pClass}>
            This is not a medical tool, but a visual analysis based on what is detectable in a
            single image.
          </p>
          <p className={pClass}>
            For best results, use consistent photos - lighting, angle, makeup, and reflections can
            all affect how features are detected.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Scan Quality</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(analysis?.retakeTips?.length
              ? analysis.retakeTips
              : [
                  "Use a front-facing portrait with both eyes clearly visible.",
                  "Avoid tinted lenses, strong reflections, or heavy shadows on the eyes.",
                  "Use neutral expression with natural eye opening.",
                  "Prefer daylight or balanced white light for eye-color detection.",
                ]).map((tip, idx) => (
              <li key={`${tip}-${idx}`}>{tip}</li>
            ))}
          </ul>
        </div>
        <FaqSection
          heading="FAQs"
          description="Common questions about eye-shape detection and how to interpret your result."
          items={EYE_SHAPE_FAQS}
          accordionName="eye-shape-faq-accordion"
          className="mt-20 lg:mt-40"
        />

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              Periocular anthropometry and canthal measurements (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/25299756/">
                Anthropometric Analysis of the Periocular Region
              </a>
            </li>
            <li>
              Eye color genetics and iris pigmentation review (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/20944644/">
                Human Iris Pigmentation and Eye Colour
              </a>
            </li>
            <li>
              Ocular adnexal aesthetic proportions review (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/30688968/">
                Periorbital Aesthetic Analysis
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "eyebrow-type-detector",
              "nose-shape-detector",
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
            excludeSlug="eye-shape-detector"
          />
        </div>
      </section>
    </main>
  );
}

const EyeShapePageClient = dynamic(() => Promise.resolve(EyeShapePageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default EyeShapePageClient;
