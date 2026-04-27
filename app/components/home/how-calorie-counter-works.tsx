const HOW_CALORIE_COUNTER_WORKS_STEPS = [
  {
    id: 1,
    title: "Upload a Meal Photo",
    description:
      "Take one clear photo of your full meal. Include sides, sauces, and drinks when possible so the estimate reflects total intake.",
  },
  {
    id: 2,
    title: "AI Estimates Calories and Macros",
    description:
      "The model analyzes visible ingredients, portion size, and preparation density to estimate calories, meal type, and macro split.",
  },
  {
    id: 3,
    title: "Review and Track Over Time",
    description:
      "Use the calorie range, confidence level, and macro breakdown as a practical tracker. Repeat with similar photo conditions for better consistency.",
  },
];

export default function HowCalorieCounterWorks() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pt-6 pb-10 lg:pt-10 lg:pb-14">
      <h2 className="text-3xl lg:text-4xl font-semibold text-center">How AI Calorie Counter Works</h2>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
        {HOW_CALORIE_COUNTER_WORKS_STEPS.map((step) => (
          <article key={step.id} className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary text-xl font-bold">
              {step.id}
            </div>

            <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-dashed border-base-300 bg-base-100 px-3 text-center text-sm text-gray-500">
              Image slot for step {step.id}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-center text-gray-900">{step.title}</h3>
            <p className="mt-3 text-lg leading-relaxed text-left text-gray-700">{step.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
