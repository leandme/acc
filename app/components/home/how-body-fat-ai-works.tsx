import Image from "next/image";

const HOW_BODY_FAT_AI_WORKS_STEPS = [
  {
    id: 1,
    title: "Upload a Clear Photo",
    imageSrc: "/hero/body-fat-estimator-header.webp",
    imageAlt: "Upload a clear body photo for AI body fat analysis",
    description:
      "Use a full-body photo with even lighting and neutral posture so the AI can read shape and proportions more reliably.",
  },
  {
    id: 2,
    title: "AI Analyzes Visual Cues",
    imageSrc: "/home/analyzing-body-composition.jpg",
    imageAlt: "AI analyzing body composition from an uploaded photo",
    description:
      "The model evaluates body-fat indicators such as fat distribution and silhouette patterns to estimate your body fat %.",
  },
  {
    id: 3,
    title: "Get Your Estimate",
    imageSrc: "/home/complete-body-fat-estimate.jpg",
    imageAlt: "Completed AI body fat estimate result screen",
    description:
      "Review your estimated body fat %, then repeat with similar photo conditions over time to track trend changes more consistently.",
  },
];

export default function HowBodyFatAiWorks() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-4 pb-8 lg:pt-8 lg:pb-12">
      <h2 className="text-3xl lg:text-4xl font-semibold text-center">How Body Fat AI Works</h2>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {HOW_BODY_FAT_AI_WORKS_STEPS.map((step) => (
          <article key={step.id} className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
              {step.id}
            </div>
            <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-base-100">
              <Image
                src={step.imageSrc}
                alt={step.imageAlt}
                fill
                className="object-contain p-2"
                sizes="(max-width: 767px) 100vw, 33vw"
              />
            </div>
            <h3 className="mt-4 text-xl font-semibold text-center text-gray-900">{step.title}</h3>
            <p className="mt-3 text-lg leading-relaxed text-left text-gray-700">{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
