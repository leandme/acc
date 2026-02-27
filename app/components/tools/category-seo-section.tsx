import Link from "next/link";
import CTA from "@/app/components/common/cta";
import type {
  ToolCategoryMeta,
  ToolCategorySlug,
} from "@/app/(site)/(tools)/tools";

type CategorySeoContent = {
  summary: string[];
  bestFor: Array<{ title: string; description: string }>;
  inputChecklist: string[];
  interpretationNotes: string[];
  commonMistakes: string[];
  relatedLinks: Array<{ href: string; label: string }>;
  cta: {
    toolSlug: string;
    toolName: string;
    description: string;
    label: string;
  };
};

const CATEGORY_SEO_CONTENT: Record<ToolCategorySlug, CategorySeoContent> = {
  muscle: {
    summary: [
      "Muscle tools are most useful when you want structure, not hype. This category helps you estimate natural potential, compare lean-mass context, and set realistic expectations based on frame and body composition assumptions.",
      "Use these calculators for long-range planning and trend direction. Do not treat one output as a hard limit. The strongest signal comes from repeated measurements, stable training inputs, and consistency over months.",
    ],
    bestFor: [
      {
        title: "Natural potential planning",
        description:
          "Use Muscular Potential and Casey Butt to set realistic lean-mass targets.",
      },
      {
        title: "Contextualizing FFMI",
        description:
          "Use Natty or Not and Bodybuilding Genetics tools to compare where you sit versus model ranges.",
      },
      {
        title: "Program checkpoints",
        description:
          "Recheck every 8-12 weeks instead of reacting to weekly fluctuations.",
      },
    ],
    inputChecklist: [
      "Measure height, wrist, and ankle consistently and at the same time of day.",
      "Use body-fat estimates from the same method when possible to reduce formula drift.",
      "Track training age and body-weight trend alongside each result snapshot.",
    ],
    interpretationNotes: [
      "Treat outputs as planning ranges, not exact predictions.",
      "Frame-based tools are sensitive to circumference measurement quality.",
      "Compare your trend against your own baseline first, then population references.",
    ],
    commonMistakes: [
      "Comparing outputs from different methods as if they are identical measurements.",
      "Changing multiple inputs between check-ins and assuming one variable caused the change.",
      "Using short-term fluctuations to rewrite long-term training expectations.",
    ],
    relatedLinks: [
      {
        href: "/guides/best-body-fat-estimator",
        label: "Best Body Fat Estimator Guide",
      },
      {
        href: "/guides/how-to-track-body-fat-changes",
        label: "How to Track Body Fat Changes",
      },
      {
        href: "/guides/why-body-fat-measurements-give-different-results",
        label: "Why Methods Give Different Results",
      },
    ],
    cta: {
      toolSlug: "muscular-potential-calculator",
      toolName: "Muscular Potential Calculator",
      description:
        "Start here for a practical, frame-aware estimate of long-term natural lean-mass potential.",
      label: "Open Muscular Potential Calculator",
    },
  },
  height: {
    summary: [
      "Height tools in this category are best for planning context, not certainty. They combine parent-based estimates, growth assumptions, and range-style outputs to help set realistic expectations.",
      "For best use, pair one baseline estimate with periodic updates when growth status changes. Focus on range interpretation and confidence context instead of chasing a single number.",
    ],
    bestFor: [
      {
        title: "Family-based estimates",
        description:
          "Use Mid-Parental Height for a fast expected-range baseline.",
      },
      {
        title: "General planning",
        description:
          "Use Height Calculator for practical range-based projections.",
      },
      {
        title: "Scenario comparison",
        description:
          "Use Height Estimator to compare different assumptions side by side.",
      },
    ],
    inputChecklist: [
      "Use accurate parent heights in the same unit system.",
      "Avoid rounding aggressively; small rounding can shift range outputs.",
      "Capture context notes (age, growth stage) with each estimate.",
    ],
    interpretationNotes: [
      "Treat results as probabilistic guidance, not guaranteed outcomes.",
      "Ranges are generally more useful than point estimates.",
      "Use repeated updates only when meaningful new inputs are available.",
    ],
    commonMistakes: [
      "Using mixed units or converted values without verification.",
      "Assuming one formula works equally well for every population.",
      "Interpreting a model output as a medical assessment.",
    ],
    relatedLinks: [
      {
        href: "/guides/how-to-track-body-fat-changes",
        label: "How to Track Changes Consistently",
      },
      {
        href: "/guides/how-often-should-you-measure-body-fat",
        label: "How Often to Recheck Measurements",
      },
      {
        href: "/guides/why-body-fat-measurements-give-different-results",
        label: "Why Different Methods Disagree",
      },
    ],
    cta: {
      toolSlug: "height-calculator",
      toolName: "Height Calculator",
      description:
        "Start with a clear range-based estimate, then compare with other height tools as needed.",
      label: "Open Height Calculator",
    },
  },
  face: {
    summary: [
      "Face tools are visual inference tools. They help with structured appearance analysis such as shape, symmetry, apparent age, and feature classification, but they are not medical or diagnostic systems.",
      "Output quality depends heavily on photo quality. For best results, use neutral lighting, a clear frontal angle, and consistent framing when comparing results over time.",
    ],
    bestFor: [
      {
        title: "Feature classification",
        description:
          "Use Face Shape, Eye Shape, Eyebrow, Nose, and Hair tools for trait-level analysis.",
      },
      {
        title: "Appearance benchmarking",
        description:
          "Use Face Symmetry and Golden Ratio outputs for structured visual comparison.",
      },
      {
        title: "Consistency over time",
        description:
          "Retest with matched photo conditions before drawing conclusions.",
      },
    ],
    inputChecklist: [
      "Use evenly lit photos with no harsh shadowing or strong filters.",
      "Keep camera angle and distance consistent across retests.",
      "Use neutral expression for classification-focused checks.",
    ],
    interpretationNotes: [
      "Confidence and class output should be interpreted together.",
      "Differences across photos often reflect angle/lighting changes.",
      "Use results for directional insight, not fixed labels.",
    ],
    commonMistakes: [
      "Comparing outputs from very different image conditions.",
      "Treating visual classification as health or identity diagnosis.",
      "Using one result snapshot as a permanent assessment.",
    ],
    relatedLinks: [
      {
        href: "/guides/how-ai-body-fat-estimation-works",
        label: "How AI Visual Estimation Works",
      },
      {
        href: "/guides/how-accurate-is-ai-body-fat-estimation",
        label: "How to Interpret AI Accuracy",
      },
      {
        href: "/guides/how-to-take-photos-for-body-fat-estimation",
        label: "Photo Standardization Best Practices",
      },
    ],
    cta: {
      toolSlug: "face-shape-detector",
      toolName: "Face Shape Detector",
      description:
        "Start here for a broad baseline before drilling into individual feature tools.",
      label: "Open Face Shape Detector",
    },
  },
  fat: {
    summary: [
      "Body fat tools are strongest when used as a system, not in isolation. This category lets you compare visual, tape-based, and formula-style estimates so you can track trend direction with better context.",
      "Because different methods rely on different inputs, disagreement is normal. The goal is consistency and decision quality over time, not chasing a single perfect percentage.",
    ],
    bestFor: [
      {
        title: "Baseline screening",
        description:
          "Use Body Fat Calculator for a quick, repeatable starting estimate.",
      },
      {
        title: "Method comparison",
        description:
          "Compare Army and Skinfold approaches when you have those measurements.",
      },
      {
        title: "Visual context",
        description:
          "Use Body Visualizer and related tools to connect numbers to appearance.",
      },
    ],
    inputChecklist: [
      "Use the same tape placement protocol each time.",
      "Measure under similar hydration and timing conditions.",
      "Track method used with each entry to avoid mixed-baseline confusion.",
    ],
    interpretationNotes: [
      "Compare your trend within one method first.",
      "Use cross-method checks for context, not exact agreement.",
      "Evaluate change windows over weeks, not day-to-day noise.",
    ],
    commonMistakes: [
      "Switching methods every check-in and interpreting noise as progress.",
      "Ignoring measurement protocol differences (waist placement, tension).",
      "Overreacting to one-off estimates without trend confirmation.",
    ],
    relatedLinks: [
      {
        href: "/guides/how-to-estimate-body-fat-percentage",
        label: "How to Estimate Body Fat Percentage",
      },
      {
        href: "/guides/body-fat-estimation-methods",
        label: "Body Fat Estimation Methods Explained",
      },
      {
        href: "/guides/why-body-fat-estimators-give-different-results",
        label: "Why Estimators Give Different Results",
      },
    ],
    cta: {
      toolSlug: "body-fat-calculator",
      toolName: "Body Fat Calculator",
      description:
        "Start with the broad baseline tool, then compare with method-specific calculators as needed.",
      label: "Open Body Fat Calculator",
    },
  },
  shape: {
    summary: [
      "Shape tools focus on body proportions, frame context, and visual structure metrics such as waist-to-height, waist-to-hip, and body-shape classification.",
      "These tools are strongest for trend direction and planning context. Small measurement errors can create meaningful ratio shifts, so consistency is critical.",
    ],
    bestFor: [
      {
        title: "Body-shape classification",
        description:
          "Use Body Shape Analyzer and Body Shape Calculator for visual and measurement-based shape context.",
      },
      {
        title: "Waist-centered screening",
        description:
          "Use Waist-to-Height and Waist-to-Hip for practical central-adiposity proxy checks.",
      },
      {
        title: "Proportion planning",
        description:
          "Use Shoulder-to-Waist, Ideal Waist, Ape Index, and Frame Size for physique and structure comparisons.",
      },
    ],
    inputChecklist: [
      "Measure waist and hip at the same anatomical landmarks every time.",
      "Use normal posture and relaxed breathing during circumference capture.",
      "Repeat each tape measurement 2-3 times and use the average.",
    ],
    interpretationNotes: [
      "Ratios are best interpreted as ranges, not strict absolutes.",
      "Track direction over time rather than reacting to one reading.",
      "Use shape outputs alongside fat and weight trends for better context.",
    ],
    commonMistakes: [
      "Changing measurement landmarks between check-ins.",
      "Comparing values collected under different posture or tape tension.",
      "Using one ratio as a complete health or physique assessment.",
    ],
    relatedLinks: [
      {
        href: "/guides/best-way-to-measure-body-fat-at-home",
        label: "Best Ways to Measure at Home",
      },
      {
        href: "/guides/body-fat-estimation-methods",
        label: "Method Comparison Guide",
      },
      {
        href: "/guides/why-body-fat-measurements-give-different-results",
        label: "Why Results Differ",
      },
    ],
    cta: {
      toolSlug: "body-shape-calculator",
      toolName: "Body Shape Calculator",
      description:
        "Start here for a practical baseline, then cross-check with waist-ratio and frame tools.",
      label: "Open Body Shape Calculator",
    },
  },
  weight: {
    summary: [
      "Body weight tools help translate scale numbers into practical context such as BMI category, ideal-range heuristics, and change tracking. This category is useful for planning and monitoring.",
      "Weight alone is incomplete. Pair these outputs with body composition or waist-based metrics to improve decision quality and reduce false conclusions from short-term fluctuations.",
    ],
    bestFor: [
      {
        title: "Quick status checks",
        description:
          "Use BMI and Overweight tools for basic category context.",
      },
      {
        title: "Goal setting",
        description:
          "Use Ideal Weight and Broca/Ponderal for target-range planning.",
      },
      {
        title: "Progress tracking",
        description:
          "Use Weight Loss and Weight Loss Percentage for trend-based review.",
      },
    ],
    inputChecklist: [
      "Weigh under consistent conditions (time, clothing, hydration).",
      "Track weekly averages rather than single-day readings.",
      "Use the same unit and rounding conventions over time.",
    ],
    interpretationNotes: [
      "Expect short-term noise; trend is what matters.",
      "Category cutoffs are screening tools, not diagnoses.",
      "Combine weight signals with waist or composition signals.",
    ],
    commonMistakes: [
      "Treating daily weight movement as fat gain/loss certainty.",
      "Using target formulas as absolute requirements.",
      "Ignoring body composition changes during training cycles.",
    ],
    relatedLinks: [
      {
        href: "/guides/bmi-vs-body-fat",
        label: "BMI vs Body Fat Guide",
      },
      {
        href: "/guides/how-to-track-body-fat-changes",
        label: "How to Track Changes Better",
      },
      {
        href: "/guides/how-often-should-you-measure-body-fat",
        label: "How Often to Recheck",
      },
    ],
    cta: {
      toolSlug: "bmi-calculator",
      toolName: "BMI Calculator",
      description:
        "Start with BMI for quick context, then layer additional weight and composition tools.",
      label: "Open BMI Calculator",
    },
  },
  calories: {
    summary: [
      "Calorie and metabolism tools convert your goal into a practical intake framework. This category covers BMR/TDEE baselines, daily calorie targets, deficit planning, macro distribution, fasting context, and expenditure estimates.",
      "Use one primary planning model at a time, then validate against real-world trend data. Too many simultaneous targets can create conflicting signals and poor adherence.",
    ],
    bestFor: [
      {
        title: "Energy baseline setup",
        description:
          "Use BMR and TDEE calculators first to anchor maintenance and intake strategy.",
      },
      {
        title: "Daily target setup",
        description:
          "Use Calorie Calculator to establish a baseline intake goal.",
      },
      {
        title: "Fat-loss structure",
        description:
          "Use Deficit and Fasting tools to set safe, consistent progression.",
      },
      {
        title: "Macro and activity context",
        description:
          "Use Macro and Calories Burned tools to refine execution details.",
      },
    ],
    inputChecklist: [
      "Align intake targets with your current TDEE estimate.",
      "Use realistic activity assumptions for burn-related tools.",
      "Track adherence and body trend before adjusting targets.",
    ],
    interpretationNotes: [
      "Calorie models are planning aids, not guarantees.",
      "Progress depends on adherence quality and consistency over time.",
      "Refine targets with 2-3 week trend windows, not day-to-day noise.",
    ],
    commonMistakes: [
      "Stacking aggressive deficits with unrealistic activity assumptions.",
      "Changing macros and calories too frequently to evaluate results.",
      "Ignoring maintenance recalibration after significant weight loss.",
    ],
    relatedLinks: [
      {
        href: "/guides/how-to-track-body-fat-changes",
        label: "Progress Tracking Framework",
      },
      {
        href: "/guides/how-often-should-you-measure-body-fat",
        label: "Measurement Frequency Guidance",
      },
      {
        href: "/guides/how-much-does-it-cost-to-measure-body-fat",
        label: "Budget-Friendly Measurement Options",
      },
    ],
    cta: {
      toolSlug: "tdee-calculator",
      toolName: "TDEE Calculator",
      description:
        "Start with TDEE to set your energy baseline, then layer calorie and macro tools.",
      label: "Open TDEE Calculator",
    },
  },
};

export default function ToolCategorySeoSection({
  category,
  toolCount,
}: {
  category: ToolCategoryMeta;
  toolCount: number;
}) {
  const content = CATEGORY_SEO_CONTENT[category.slug];
  const showRelatedReading = category.slug === "fat";

  return (
    <section className="mx-auto max-w-3xl px-6 pb-20">
      <div className="space-y-4">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          How To Use {category.navLabel} Tools Effectively
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          This category currently includes {toolCount} tools. Choose one
          baseline tool first, then add one or two supporting tools for
          cross-checking.
        </p>
        {content.summary.map((paragraph) => (
          <p
            key={paragraph}
            className="text-gray-700 text-lg leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-20 lg:mt-40 space-y-4">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          What This Category Is Best For
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg leading-relaxed">
          {content.bestFor.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-20 lg:mt-40 space-y-4">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          Input Quality Checklist
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg leading-relaxed">
          {content.inputChecklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-20 lg:mt-40 space-y-4">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          Interpretation Notes
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg leading-relaxed">
          {content.interpretationNotes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="mt-20 lg:mt-40 space-y-4">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center">
          Common Mistakes To Avoid
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg leading-relaxed">
          {content.commonMistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {showRelatedReading ? (
        <div className="mt-20 lg:mt-40 space-y-4">
          <h2 className="text-3xl lg:text-4xl font-semibold text-center">
            Related Reading
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 text-lg leading-relaxed">
            {content.relatedLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-primary underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <CTA
        title={`Recommended Starting Tool: ${content.cta.toolName}`}
        description={content.cta.description}
        buttonText={content.cta.label}
        href={`/${content.cta.toolSlug}`}
        className="!my-0 !mt-20 lg:!mt-40 !border-0 !bg-transparent"
      />
    </section>
  );
}
