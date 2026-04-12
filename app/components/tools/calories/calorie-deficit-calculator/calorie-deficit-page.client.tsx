"use client";

import { useState } from "react";
import CalorieDeficitCalculator from "@/app/components/tools/calories/calorie-deficit-calculator/calorie-deficit-calculator";
import CalorieDeficitInterpretation from "@/app/components/tools/calories/calorie-deficit-calculator/calorie-deficit-interpretation";
import { round } from "@/app/components/tools/body-weight/shared/math";
import { MoreTools } from "../../template/more-tools";

export default function CalorieDeficitPageClient() {
  const [maintenanceCalories, setMaintenanceCalories] = useState<number | null>(null);
  const [targetCalories, setTargetCalories] = useState<number | null>(null);
  const [dailyDeficit, setDailyDeficit] = useState<number | null>(null);
  const [weeklyLossPct, setWeeklyLossPct] = useState<number | null>(null);
  const [weeklyLossKg, setWeeklyLossKg] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Calorie Deficit Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Build weight-loss calorie targets from maintenance intake and selected weekly loss pace.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <CalorieDeficitCalculator
              onChange={({ maintenanceCalories, targetCalories, dailyDeficit, weeklyLossPct, weeklyLossKg }) => {
                setMaintenanceCalories(maintenanceCalories);
                setTargetCalories(targetCalories);
                setDailyDeficit(dailyDeficit);
                setWeeklyLossPct(weeklyLossPct);
                setWeeklyLossKg(weeklyLossKg);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="calorie-deficit-interpretation">
          <CalorieDeficitInterpretation weeklyLossPct={weeklyLossPct} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Calorie Deficit Calculator Does</h2>
          <p className={pClass}>
            This tool estimates daily calorie targets from your maintenance energy needs and chosen weekly
            loss pace.
          </p>
          {maintenanceCalories != null && targetCalories != null && dailyDeficit != null ? (
            <p className={pClass}>
              Current setup: maintenance <strong>{Math.round(maintenanceCalories)} kcal/day</strong>, target{" "}
              intake <strong>{Math.round(targetCalories)} kcal/day</strong>, and daily deficit{" "}
              <strong>{Math.round(dailyDeficit)} kcal</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>How To Use Deficit Targets</h2>
          <p className={pClass}>
            Start with a conservative pace, then adjust based on 2 to 4 weeks of trend data. Use the{" "}
            <a className="text-primary underline" href="/tdee-calculator">
              TDEE Calculator
            </a>{" "}
            or the{" "}
            <a className="text-primary underline" href="/calorie-calculator">
              Calorie Calculator
            </a>{" "}
            for maintenance-and-goal calorie targets, and use the{" "}
            <a className="text-primary underline" href="/weight-loss-calculator">
              Weight Loss Calculator
            </a>{" "}
            for timeline projection. To estimate movement-driven calorie output from walking volume, use the{" "}
            <a className="text-primary underline" href="/steps-to-calories-calculator">
              Steps to Calories Calculator
            </a>
            . For a broader menu of gym and cardio activities, use the{" "}
            <a className="text-primary underline" href="/calories-burned-calculator">
              Calories Burned Calculator
            </a>
            . If your daily intake varies by meal composition, log meal photos in the{" "}
            <a className="text-primary underline" href="/calorie-counter">
              Calorie Counter
            </a>{" "}
            and average those values across the week. To set macro gram targets from this intake goal, use
            the{" "}
            <a className="text-primary underline" href="/macro-calculator">
              Macro Calculator
            </a>
            .
          </p>
          {weeklyLossKg != null && weeklyLossPct != null ? (
            <p className={pClass}>
              Selected pace is <strong>{round(weeklyLossPct, 2)}%</strong> per week, which is about{" "}
              <strong>{round(weeklyLossKg, 2)} kg/week</strong> from current body weight.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Important Limits</h2>
          <p className={pClass}>
            Large deficits can reduce training performance, increase hunger, and raise lean-mass retention
            risk. Adjust pace if sleep, adherence, or recovery declines.
          </p>
          <p className={pClass}>
            For intermittent-fasting split intakes, compare with the{" "}
            <a className="text-primary underline" href="/fasting-weight-loss-calculator">
              Fasting Weight Loss Calculator
            </a>
            {" "}or the{" "}
            <a className="text-primary underline" href="/intermittent-fasting-calculator">
              Intermittent Fasting Calculator
            </a>{" "}
            for protocol-based intake scenarios.
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              NIDDK Body Weight Planner (dynamic body-weight model):
              <a className="text-primary underline ml-1" href="https://www.niddk.nih.gov/bwp">
                NIDDK Body Weight Planner
              </a>
            </li>
            <li>
              Dynamic energy-balance paper on 3,500 kcal rule limitations (PubMed):
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/21872751/">
                Why Is the 3500 kcal per Pound Weight Loss Rule Wrong?
              </a>
            </li>
            <li>
              CDC healthy weight guidance:
              <a className="text-primary underline ml-1" href="https://www.cdc.gov/healthy-weight-growth/about/index.html">
                CDC Healthy Weight and Growth
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "calorie-calculator",
              "tdee-calculator",
              "bmr-calculator",
              "calorie-counter",
              "macro-calculator",
              "steps-to-calories-calculator",
              "calories-burned-calculator",
              "intermittent-fasting-calculator",
              "weight-loss-calculator",
              "fasting-weight-loss-calculator",
              "weight-loss-percentage-calculator",
              "bmi-calculator",
            ]}
            excludeSlug="calorie-deficit-calculator"
          />
        </div>
      </section>
    </main>
  );
}
