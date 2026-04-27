"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import LoadingStatus, { type LoadingStatusMessage } from "@/app/components/common/loading-status";
import Hero from "@/app/components/home/hero";
import HowCalorieCounterWorks from "@/app/components/home/how-calorie-counter-works";
import { useCalorieEstimate, type MacroSplit } from "@/app/hooks/useCalorieEstimate";

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

const CALORIE_LOADING_MESSAGES: LoadingStatusMessage[] = [
  {
    title: "Photo intake and normalization",
    body: "Preparing your meal image and normalizing orientation, framing, and scale cues.",
  },
  {
    title: "Ingredient detection pass",
    body: "Scanning visible foods, sides, sauces, and drink cues across the image.",
  },
  {
    title: "Portion and density modeling",
    body: "Estimating portion size and likely preparation density for each detected item.",
  },
  {
    title: "Calorie and macro assembly",
    body: "Combining item-level estimates into total kcal and a practical macro split.",
  },
  {
    title: "Confidence and range calibration",
    body: "Finalizing confidence level, calorie range, and result summary before output.",
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

type FoodClassification = {
  label: string;
  styleClass: string;
  summary: string;
};

function classifyFood(totalCalories: number | null, macroSplit: MacroSplit | null): FoodClassification | null {
  const band = findBand(totalCalories);
  if (!band) return null;

  const proteinPct = macroSplit?.protein ?? 0;
  const fatPct = macroSplit?.fat ?? 0;
  const balancedMacros = proteinPct >= 25 && fatPct <= 35;

  if (band.key === "snack") {
    return {
      label: "Snack",
      styleClass: "bg-green-100 text-green-800 border-green-200",
      summary: "Lower-calorie portion. Good fit for snack-sized intake.",
    };
  }

  if (band.key === "light_meal" || band.key === "standard_meal") {
    if (balancedMacros) {
      return {
        label: "Likely Healthy Meal",
        styleClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        summary: "Balanced calorie range with macro split that leans protein-forward.",
      };
    }

    return {
      label: "Balanced Meal",
      styleClass: "bg-blue-100 text-blue-800 border-blue-200",
      summary: "Meal-sized intake in a typical calorie range.",
    };
  }

  if (band.key === "large_meal") {
    return {
      label: "Hearty Meal",
      styleClass: "bg-orange-100 text-orange-800 border-orange-200",
      summary: "Larger meal portion with elevated energy density.",
    };
  }

  return {
    label: "Calorie-Dense Meal",
    styleClass: "bg-red-100 text-red-800 border-red-200",
    summary: "High-calorie portion, often from larger serving size or richer ingredients.",
  };
}

function toMacroGrams(totalCalories: number | null, macroSplit: MacroSplit | null) {
  if (totalCalories == null || !macroSplit) return null;

  const protein = Math.max(0, Math.round((totalCalories * (macroSplit.protein / 100)) / 4));
  const carbs = Math.max(0, Math.round((totalCalories * (macroSplit.carbs / 100)) / 4));
  const fat = Math.max(0, Math.round((totalCalories * (macroSplit.fat / 100)) / 9));

  return { protein, carbs, fat };
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

type CalorieCounterPageContentProps = {
  basePath?: "/" | "/calorie-counter";
};

function CalorieCounterPageContent({ basePath = "/" }: CalorieCounterPageContentProps) {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const source = searchParams.get("source") === "example" ? "example" : "upload";
  const { estimate, loading, error } = useCalorieEstimate(imageUrl, { source });
  const isAnalyzing = Boolean(imageUrl) && loading;

  const topItem = useMemo(() => {
    if (!estimate?.detectedItems?.length) return null;
    return estimate.detectedItems.reduce((top, item) =>
      item.calories > top.calories ? item : top
    );
  }, [estimate?.detectedItems]);

  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";
  const foodClassification = useMemo(
    () => classifyFood(estimate?.totalCalories ?? null, estimate?.macroSplit ?? null),
    [estimate?.macroSplit, estimate?.totalCalories]
  );
  const macroGrams = useMemo(
    () => toMacroGrams(estimate?.totalCalories ?? null, estimate?.macroSplit ?? null),
    [estimate?.macroSplit, estimate?.totalCalories]
  );

  return (
    <main className="bg-base-100">
      {!imageUrl ? (
        <section className="w-full">
          <Hero basePath={basePath} showExamples={false} />
          <HowCalorieCounterWorks />
        </section>
      ) : isAnalyzing ? (
        <section className="flex flex-col items-center justify-start min-h-screen">
          <div className="w-full max-w-none px-4 pt-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8 lg:pt-10">
            <LoadingStatus
              imageUrl={imageUrl}
              title="Analyzing Your Meal..."
              messages={CALORIE_LOADING_MESSAGES}
            />
          </div>
        </section>
      ) : (
        <section className="flex flex-col items-center justify-start pt-10 px-6">
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

                    {foodClassification ? (
                      <div className="mt-3">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${foodClassification.styleClass}`}>
                          {foodClassification.label}
                        </span>
                        <p className="mt-2 text-sm text-gray-600">{foodClassification.summary}</p>
                      </div>
                    ) : null}

                    {estimate.mealName ? (
                      <p className="mt-2 text-sm text-gray-600">
                        Meal type detected: <span className="font-semibold text-gray-800">{estimate.mealName}</span>
                      </p>
                    ) : null}

                    {estimate.macroSplit ? (
                      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                          <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold">Protein</p>
                          <p className="text-xl font-semibold text-blue-800">
                            {macroGrams ? `${macroGrams.protein}g` : `${estimate.macroSplit.protein}%`}
                          </p>
                          <p className="text-xs text-blue-700/80">{estimate.macroSplit.protein}% of calories</p>
                        </div>
                        <div className="rounded-xl bg-yellow-50 border border-yellow-100 p-3">
                          <p className="text-xs uppercase tracking-wide text-yellow-700 font-semibold">Carbs</p>
                          <p className="text-xl font-semibold text-yellow-800">
                            {macroGrams ? `${macroGrams.carbs}g` : `${estimate.macroSplit.carbs}%`}
                          </p>
                          <p className="text-xs text-yellow-700/80">{estimate.macroSplit.carbs}% of calories</p>
                        </div>
                        <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                          <p className="text-xs uppercase tracking-wide text-red-700 font-semibold">Fat</p>
                          <p className="text-xl font-semibold text-red-800">
                            {macroGrams ? `${macroGrams.fat}g` : `${estimate.macroSplit.fat}%`}
                          </p>
                          <p className="text-xs text-red-700/80">{estimate.macroSplit.fat}% of calories</p>
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
        </section>
      )}

      {!isAnalyzing ? (
        <section className="px-6">
        {estimate?.detectedItems?.length ? (
          <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
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

        <div className="w-full max-w-3xl mx-auto pt-10 pb-10 lg:pt-20 lg:pb-20">
          <h2 className={h2Class}>Where Your Result Sits</h2>
          <p className="mt-4 text-center text-lg text-gray-700">
            The highlighted row maps your current calorie estimate to a practical meal-size band.
          </p>
          <CalorieBandTable totalCalories={estimate?.totalCalories ?? null} />
        </div>

        </section>
      ) : null}
    </main>
  );
}

const CalorieCounterPageClient = dynamic<CalorieCounterPageContentProps>(
  () => Promise.resolve(CalorieCounterPageContent),
  {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading...</p>
    </div>
  ),
});

export default CalorieCounterPageClient;
