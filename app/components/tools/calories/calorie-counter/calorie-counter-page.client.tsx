"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import H1 from "@/app/components/common/h1";
import RippleLoader from "@/app/components/common/loader";
import EstimateDropZone from "@/app/components/tools/composition/body-fat-estimator/estimate-drop-zone";
import { MoreTools } from "../../template/more-tools";
import { useCalorieEstimate } from "@/app/hooks/useCalorieEstimate";

type CalorieBand = {
  key: string;
  label: string;
  min: number;
  max: number;
  colorClass: string;
  textClass: string;
  summary: string;
};

const CALORIE_BANDS: CalorieBand[] = [
  {
    key: "snack",
    label: "Snack Range",
    min: 0,
    max: 300,
    colorClass: "bg-green-50",
    textClass: "text-green-800",
    summary: "Typical for small snacks and very light plates.",
  },
  {
    key: "light_meal",
    label: "Light Meal",
    min: 301,
    max: 600,
    colorClass: "bg-blue-50",
    textClass: "text-blue-800",
    summary: "Typical for lighter breakfasts or simple lunch portions.",
  },
  {
    key: "standard_meal",
    label: "Standard Meal",
    min: 601,
    max: 900,
    colorClass: "bg-yellow-50",
    textClass: "text-yellow-800",
    summary: "Typical for balanced meals with a carb + protein base.",
  },
  {
    key: "large_meal",
    label: "Large Meal",
    min: 901,
    max: 1200,
    colorClass: "bg-orange-50",
    textClass: "text-orange-800",
    summary: "Common for larger restaurant meals or dense home portions.",
  },
  {
    key: "very_large_meal",
    label: "Very Large Meal",
    min: 1201,
    max: 20000,
    colorClass: "bg-red-50",
    textClass: "text-red-800",
    summary: "Large portions, calorie-dense ingredients, or combo meals.",
  },
];

function confidenceBadgeClass(confidence: "low" | "medium" | "high") {
  if (confidence === "high") return "bg-green-100 text-green-800 border-green-200";
  if (confidence === "low") return "bg-red-100 text-red-800 border-red-200";
  return "bg-yellow-100 text-yellow-800 border-yellow-200";
}

function findBand(totalCalories: number | null) {
  if (totalCalories == null) return null;
  return CALORIE_BANDS.find(
    (band) => totalCalories >= band.min && totalCalories <= band.max
  ) ?? null;
}

function formatRange(min: number | null, max: number | null) {
  if (min == null || max == null) return "Range unavailable";
  return `${min}-${max} kcal`;
}

function CalorieBandTable({ totalCalories }: { totalCalories: number | null }) {
  const activeBand = findBand(totalCalories);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Meal Band
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
              Estimated Calories
            </th>
            <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
              Interpretation
            </th>
          </tr>
        </thead>
        <tbody>
          {CALORIE_BANDS.map((band) => {
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-semibold ${band.textClass}`}>{band.label}</span>
                    {isActive ? (
                      <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-2 py-0.5 text-xs font-semibold text-gray-900">
                        Your Result
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className={[cellBase, activeCell, "text-gray-700 font-medium"].join(" ")}>
                  {band.min}-{band.max} kcal
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

function CalorieCounterPageContent() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { estimate, loading, error } = useCalorieEstimate(imageUrl, { source });

  const topItem = useMemo(() => {
    if (!estimate?.detectedItems?.length) return null;
    return estimate.detectedItems.reduce((top, item) =>
      item.calories > top.calories ? item : top
    );
  }, [estimate?.detectedItems]);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10 px-6">
        <H1>Calorie Counter Powered by AI</H1>
        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Upload a meal photo and get an AI calorie estimate with a confidence rating, calorie range,
          and item-level breakdown.
        </p>

        {!imageUrl ? (
          <div className="w-full max-w-2xl mt-10 flex flex-col items-center">
            <div className="w-full max-w-md">
              <EstimateDropZone basePath="/calorie-counter" buttonLabel="Upload Meal Photo" />
            </div>
            <p className="mt-6 text-sm text-gray-600 max-w-md text-center">
              Best results come from top-down or 45-degree photos with the full plate visible in even
              lighting.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-5xl mt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-16 items-start">
              <div className="w-full sm:max-w-sm lg:max-w-none justify-self-center">
                <img
                  src={imageUrl}
                  alt="Uploaded meal image for calorie estimation"
                  className="w-full max-w-[95vw] sm:max-w-sm lg:w-[360px] mx-auto rounded-2xl shadow-xl object-cover aspect-[3/4] bg-base-200"
                />
              </div>

              <div className="w-full rounded-2xl border bg-white p-6 lg:p-8 shadow-sm">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">Estimated Calories</h2>

                {loading ? (
                  <div className="mt-6">
                    <div className="flex items-center gap-4">
                      <RippleLoader />
                      <div>
                        <p className="text-lg text-gray-800 font-semibold">Analyzing meal composition...</p>
                        <p className="text-sm text-gray-600">Estimating portions, ingredient density, and likely total kcal.</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {error ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="whitespace-pre-line text-red-700">{error}</p>
                  </div>
                ) : null}

                {!loading && !error && estimate ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-4xl lg:text-5xl font-bold text-primary">
                        {estimate.totalCalories} kcal
                      </p>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${confidenceBadgeClass(
                          estimate.confidence
                        )}`}
                      >
                        {estimate.confidence.toUpperCase()} confidence
                      </span>
                    </div>

                    <p className="mt-3 text-lg text-gray-700">
                      Estimated range: <span className="font-semibold">{formatRange(estimate.rangeMin, estimate.rangeMax)}</span>
                    </p>

                    {estimate.mealName ? (
                      <p className="mt-2 text-sm text-gray-600">
                        Meal type detected: <span className="font-semibold text-gray-800">{estimate.mealName}</span>
                      </p>
                    ) : null}

                    {estimate.macroSplit ? (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                          <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">Protein</p>
                          <p className="text-xl font-semibold text-blue-800">{estimate.macroSplit.protein}%</p>
                        </div>
                        <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3">
                          <p className="text-xs uppercase tracking-wide text-yellow-700 font-semibold">Carbs</p>
                          <p className="text-xl font-semibold text-yellow-800">{estimate.macroSplit.carbs}%</p>
                        </div>
                        <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                          <p className="text-xs uppercase tracking-wide text-red-700 font-semibold">Fat</p>
                          <p className="text-xl font-semibold text-red-800">{estimate.macroSplit.fat}%</p>
                        </div>
                      </div>
                    ) : null}

                    {estimate.rationale ? (
                      <p className="mt-5 text-gray-700 leading-relaxed">{estimate.rationale}</p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="px-6">
        {estimate?.detectedItems?.length ? (
          <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
            <h2 className={h2Class}>Detected Item Breakdown</h2>
            <p className="mt-4 text-center text-lg text-gray-700">
              Item-level estimate from the uploaded meal photo.
            </p>
            <div className="mt-8 overflow-hidden rounded-2xl border bg-base-100">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                      Item
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                      Estimated kcal
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-gray-700 hidden sm:table-cell">
                      Portion note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {estimate.detectedItems.map((item, idx) => {
                    const isTop = topItem?.name === item.name && topItem.calories === item.calories;
                    return (
                      <tr key={`${item.name}-${item.calories}-${idx}`} className={isTop ? "bg-primary/5" : "bg-white"}>
                        <td className={`px-4 py-4 align-top border-y ${isTop ? "border-primary" : "border-transparent"}`}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">{item.name}</span>
                            {isTop ? (
                              <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                Highest
                              </span>
                            ) : null}
                          </div>
                        </td>
                        <td className={`px-4 py-4 align-top border-y text-gray-800 font-semibold ${isTop ? "border-primary" : "border-transparent"}`}>
                          {item.calories} kcal
                          <p className="mt-1 text-sm text-gray-600 sm:hidden">{item.portionNote}</p>
                        </td>
                        <td className={`px-4 py-4 align-top border-y hidden sm:table-cell text-gray-700 ${isTop ? "border-primary" : "border-transparent"}`}>
                          {item.portionNote}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row maps your current calorie estimate to a practical meal-size band.
          </p>
          <CalorieBandTable totalCalories={estimate?.totalCalories ?? null} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How This Calorie Counter Works</h2>
          <p className={pClass}>
            This tool uses visual cues from your meal photo to estimate total calories and build an
            item-level split. It evaluates likely ingredients, portion size, and preparation density,
            then returns a calorie estimate with a confidence rating and range.
          </p>
          <p className={pClass}>
            This is a practical tracking estimate, not a lab-verified measurement. Use repeatable photo
            conditions to improve consistency over time.
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Improve Accuracy</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {(estimate?.improvements?.length
              ? estimate.improvements
              : [
                  "Shoot from top-down or 45-degree angle with the full plate visible.",
                  "Avoid heavy shadows and keep lighting bright and even.",
                  "Include all sides, sauces, and drinks in the frame.",
                  "Use one clear image per meal without clutter from other plates.",
                  "Retake if ingredients are stacked or hidden by toppings.",
                ]
            ).map((tip, idx) => (
              <li key={`${tip}-${idx}`}>{tip}</li>
            ))}
          </ul>
          {estimate?.assumptions?.length ? (
            <div className="rounded-2xl border bg-white p-5">
              <p className="font-semibold text-gray-900">Current serving assumptions</p>
              <ul className="mt-2 list-disc pl-6 text-gray-700 space-y-1">
                {estimate.assumptions.map((note, idx) => (
                  <li key={`${note}-${idx}`}>{note}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use This With Other Tools</h2>
          <p className={pClass}>
            Use meal-level calorie estimates as your intake side, then combine with expenditure and
            target-planning tools for better decisions.
          </p>
          <p className={pClass}>
            Pair this with the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            or the{" "}
            <a className="text-primary underline" href="/calorie-calculator">
              Calorie Calculator
            </a>{" "}
            to estimate maintenance, and the{" "}
            <a className="text-primary underline" href="/calorie-deficit-calculator">
              Calorie Deficit Calculator
            </a>{" "}
            and track session expenditure with the{" "}
            <a className="text-primary underline" href="/calories-burned-calculator">
              Calories Burned Calculator
            </a>
            . For step-target calorie burn, use the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            . For protocol-based intake planning, use the{" "}
            <a className="text-primary underline" href="/intermittent-fasting-calculator">
              Intermittent Fasting Calculator
            </a>
            . If you want calorie targets converted into daily protein, carb, and fat gram goals, use the{" "}
            <a className="text-primary underline" href="/macro-calculator">
              Macro Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              USDA FoodData Central (nutrient and calorie database):
              <a className="text-primary underline ml-1" href="https://fdc.nal.usda.gov/">
                USDA FoodData Central
              </a>
            </li>
            <li>
              FDA reference guide for serving sizes and labels:
              <a className="text-primary underline ml-1" href="https://www.fda.gov/food/nutrition-facts-label">
                FDA Nutrition Facts Label
              </a>
            </li>
            <li>
              NIH body weight planner context for intake/expenditure:
              <a className="text-primary underline ml-1" href="https://www.niddk.nih.gov/bwp">
                NIDDK Body Weight Planner
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40 pb-20">
          <MoreTools
            heading="Related Tools"
            columns={2}
            toolSlugs={[
              "calorie-calculator",
              "calorie-deficit-calculator",
              "macro-calculator",
              "tdee-calculator",
              "bmr-calculator",
              "calories-burned-calculator",
              "steps-to-calories-calculator",
              "intermittent-fasting-calculator",
              "fasting-weight-loss-calculator",
              "weight-loss-calculator",
              "estimate",
            ]}
            excludeSlug="calorie-counter"
          />
        </div>
      </section>
    </main>
  );
}

const CalorieCounterPageClient = dynamic(() => Promise.resolve(CalorieCounterPageContent), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default CalorieCounterPageClient;
