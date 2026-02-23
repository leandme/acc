export type ToolCategory =
  | "Body Fat"
  | "Body Composition"
  | "Muscle"
  | "Height"
  | "Body Proportions"
  | "Body Weight"
  | "Metabolism"
  | "Calories";

export type ToolCategorySlug =
  | "body-fat"
  | "body-composition"
  | "muscle"
  | "height"
  | "body-proportions"
  | "body-weight"
  | "metabolism"
  | "calories";

export type ToolMeta = {
  slug: string;
  title: string;
  description?: string;
  eventName?: "Go to Tool"; // optional override if needed later
  category: ToolCategory;
};

export type ToolCategoryMeta = {
  category: ToolCategory;
  slug: ToolCategorySlug;
  navLabel: string;
  h1: string;
  description: string;
};

const TOOL_CATEGORY_ORDER: ToolCategory[] = [
  "Muscle",
  "Height",
  "Body Fat",
  "Body Composition",
  "Body Proportions",
  "Body Weight",
  "Metabolism",
  "Calories",
];

const TOOL_CATEGORY_META_BY_NAME: Record<ToolCategory, ToolCategoryMeta> = {
  Muscle: {
    category: "Muscle",
    slug: "muscle",
    navLabel: "Muscle",
    h1: "Muscle Potential and FFMI Tools",
    description:
      "Explore muscle-focused calculators for FFMI, natural potential screening, frame-based potential, and bodybuilding-specific context.",
  },
  Height: {
    category: "Height",
    slug: "height",
    navLabel: "Height",
    h1: "Height Prediction and Growth Potential Tools",
    description:
      "Use parent-based models for target adult height, expected family range, and probability-style planning context.",
  },
  "Body Fat": {
    category: "Body Fat",
    slug: "body-fat",
    navLabel: "Body Fat",
    h1: "Body Fat Estimation and Screening Tools",
    description:
      "Estimate body fat with photo-based, tape-based, and skinfold-based methods, plus visual and adiposity-oriented tools.",
  },
  "Body Composition": {
    category: "Body Composition",
    slug: "body-composition",
    navLabel: "Composition",
    h1: "Body Composition Calculators and Analysis Tools",
    description:
      "Compare lean mass, muscle mass, frame context, shape, and composition indices in one place for trend-based tracking.",
  },
  "Body Proportions": {
    category: "Body Proportions",
    slug: "body-proportions",
    navLabel: "Proportions",
    h1: "Body Proportion and Ratio Tools",
    description:
      "Assess waist-centered risk proxies and proportionality metrics with ratio-based screening calculators.",
  },
  "Body Weight": {
    category: "Body Weight",
    slug: "body-weight",
    navLabel: "Weight",
    h1: "Body Weight and Weight-Range Tools",
    description:
      "Run BMI, healthy-range, ideal-weight, and weight-change tools for practical planning and progress review.",
  },
  Metabolism: {
    category: "Metabolism",
    slug: "metabolism",
    navLabel: "Metabolism",
    h1: "Metabolism and Energy Expenditure Tools",
    description:
      "Estimate basal and total daily energy expenditure using common metabolism and activity-based equations.",
  },
  Calories: {
    category: "Calories",
    slug: "calories",
    navLabel: "Calories",
    h1: "Calorie Planning and Burn Tools",
    description:
      "Plan deficits, macros, fasting strategies, and calorie burn with practical tools for nutrition and training workflows.",
  },
};

const TOOL_CATEGORY_META_BY_SLUG: Record<ToolCategorySlug, ToolCategoryMeta> = {
  "body-fat": TOOL_CATEGORY_META_BY_NAME["Body Fat"],
  "body-composition": TOOL_CATEGORY_META_BY_NAME["Body Composition"],
  muscle: TOOL_CATEGORY_META_BY_NAME["Muscle"],
  height: TOOL_CATEGORY_META_BY_NAME["Height"],
  "body-proportions": TOOL_CATEGORY_META_BY_NAME["Body Proportions"],
  "body-weight": TOOL_CATEGORY_META_BY_NAME["Body Weight"],
  metabolism: TOOL_CATEGORY_META_BY_NAME["Metabolism"],
  calories: TOOL_CATEGORY_META_BY_NAME["Calories"],
};

export type ToolCategoryTab = {
  key: "all" | ToolCategorySlug;
  label: string;
  href: string;
};

export const TOOLS: Record<string, ToolMeta> = {

// BODY COMPOSITION
  "ffmi-calculator": {
    slug: "ffmi-calculator",
    title: "FFMI Calculator",
    description: "How much of you is muscle?",
    category: "Body Composition",
  },
  "natty-or-not-calculator": {
    slug: "natty-or-not-calculator",
    title: "Natty or Not Calculator",
    description: "Compare your frame-adjusted FFMI against common natural muscularity ceilings.",
    category: "Muscle",
  },
  "muscular-potential-calculator": {
    slug: "muscular-potential-calculator",
    title: "Muscular Potential Calculator",
    description: "Estimate modelled natural lean-mass potential from frame-adjusted FFMI limits.",
    category: "Muscle",
  },
  "casey-butt-calculator": {
    slug: "casey-butt-calculator",
    title: "Casey Butt Calculator",
    description: "Estimate frame-based bodybuilding potential from height, wrist, and ankle measures.",
    category: "Muscle",
  },
  "bodybuilding-genetics-calculator": {
    slug: "bodybuilding-genetics-calculator",
    title: "Bodybuilding Genetics Calculator",
    description: "Estimate a modelled bodybuilding genetics score from structure and FFMI-based potential.",
    category: "Muscle",
  },
  "lean-body-mass-calculator": {
    slug: "lean-body-mass-calculator",
    title: "Lean Body Mass Calculator",
    description: "Estimate your lean mass with standard equations.",
    category: "Body Composition",
  },
  "muscle-mass-calculator": {
    slug: "muscle-mass-calculator",
    title: "Muscle Mass Calculator",
    description: "Estimate skeletal muscle mass from anthropometric measurements.",
    category: "Body Composition",
  },
  "rfm-calculator": {
    slug: "rfm-calculator",
    title: "RFM Calculator",
    description: "Estimate body fat from height and waist.",
    category: "Body Composition",
  },
  "bri-calculator": {
    slug: "bri-calculator",
    title: "BRI Calculator",
    description: "Estimate body roundness from waist and height.",
    category: "Body Composition",
  },
  "visceral-fat-calculator": {
    slug: "visceral-fat-calculator",
    title: "Visceral Fat Calculator",
    description: "Estimate visceral fat area from body measurements.",
    category: "Body Composition",
  },
  "body-frame-size-calculator": {
    slug: "body-frame-size-calculator",
    title: "Body Frame Size Calculator",
    description: "Estimate frame size from height and wrist ratio.",
    category: "Body Composition",
  },
  "waist-to-hip-ratio-calculator": {
    slug: "waist-to-hip-ratio-calculator",
    title: "Waist to Hip Ratio Calculator",
    description: "Assess waist-to-hip ratio with sex-specific central-fat risk thresholds.",
    category: "Body Proportions",
  },
  "waist-to-height-ratio-calculator": {
    slug: "waist-to-height-ratio-calculator",
    title: "Waist to Height Ratio Calculator",
    description: "Assess waist-to-height ratio against central-fat risk screening thresholds.",
    category: "Body Proportions",
  },
  "body-shape-analyzer": {
    slug: "body-shape-analyzer",
    title: "Body Shape Analyzer",
    description: "Upload a photo and analyze your visual body type.",
    category: "Body Composition",
  },
  "body-shape-calculator": {
    slug: "body-shape-calculator",
    title: "Body Shape Calculator",
    description: "Estimate your body-shape category from bust/chest, waist, and hip measurements.",
    category: "Body Composition",
  },

  "body-visualizer": {
    slug: "body-visualizer",
    title: "Body Visualizer",
    description: "Visualize body shape from BMI, body fat %, height, and weight.",
    category: "Body Fat",
  },
  "bai-calculator": {
    slug: "bai-calculator",
    title: "BAI Calculator",
    description: "Estimate body adiposity from hip circumference and height.",
    category: "Body Fat",
  },
  estimate: {
    slug: "estimate",
    title: "Body Fat Estimator",
    description: "Estimate your body fat % from a photo.",
    category: "Body Fat",
  },
  "body-fat-calculator": {
    slug: "body-fat-calculator",
    title: "Body Fat Calculator",
    description: "Estimate body fat % from measurements and formulas.",
    category: "Body Fat",
  },
  "skinfold-body-fat-calculator": {
    slug: "skinfold-body-fat-calculator",
    title: "Skinfold Body Fat Calculator",
    description: "Estimate body fat % from 3-site skinfold caliper measurements.",
    category: "Body Fat",
  },

  "army-body-fat-calculator": {
    slug: "army-body-fat-calculator",
    title: "Army Body Fat Calculator",
    description: "Estimate body fat % using the US Army tape method.",
    category: "Body Fat",
  },

  // BODY WEIGHT
  "weight-loss-percentage-calculator": {
    slug: "weight-loss-percentage-calculator",
    title: "Weight Loss Percentage Calculator",
    description: "Calculate percentage change from starting to current weight.",
    category: "Body Weight",
  },
  "overweight-calculator": {
    slug: "overweight-calculator",
    title: "Overweight Calculator",
    description: "Check BMI category and estimate weight above the healthy range.",
    category: "Body Weight",
  },
  "ideal-weight-calculator": {
    slug: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    description: "Compare healthy BMI range and Devine ideal body weight.",
    category: "Body Weight",
  },
  "height-calculator": {
    slug: "height-calculator",
    title: "Height Calculator",
    description: "Estimate family-based height prediction, potential range, and target probability.",
    category: "Height",
  },
  "mid-parental-height-calculator": {
    slug: "mid-parental-height-calculator",
    title: "Mid-Parental Height Calculator",
    description: "Calculate target adult height from parent heights with the standard mid-parental method.",
    category: "Height",
  },
  "adjusted-body-weight-calculator": {
    slug: "adjusted-body-weight-calculator",
    title: "Adjusted Body Weight Calculator",
    description: "Calculate IBW, AdjBW, and percent-of-IBW for dosing context.",
    category: "Body Weight",
  },
  "fasting-weight-loss-calculator": {
    slug: "fasting-weight-loss-calculator",
    title: "Fasting Weight Loss Calculator",
    description: "Project weight change from fasting-day and feeding-day calorie patterns.",
    category: "Calories",
  },
  "intermittent-fasting-calculator": {
    slug: "intermittent-fasting-calculator",
    title: "Intermittent Fasting Calculator",
    description: "Estimate fasting-protocol calorie intake, daily expenditure, and weekly pace.",
    category: "Calories",
  },
  "weight-loss-calculator": {
    slug: "weight-loss-calculator",
    title: "Weight Loss Calculator",
    description: "Estimate timeline to target weight with adaptive energy-balance math.",
    category: "Body Weight",
  },
  "bmi-calculator": {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    description: "Calculate BMI and view adult category ranges by height and weight.",
    category: "Body Weight",
  },
  "ponderal-index-calculator": {
    slug: "ponderal-index-calculator",
    title: "Ponderal Index Calculator",
    description: "Calculate ponderal index and compare with BMI-equivalent ranges.",
    category: "Body Weight",
  },
  "broca-index-calculator": {
    slug: "broca-index-calculator",
    title: "Broca Index Calculator",
    description: "Compare current weight against classic Broca height-based reference.",
    category: "Body Weight",
  },

  // METABOLISM
  "tdee-calculator": {
    slug: "tdee-calculator",
    title: "TDEE Calculator",
    description: "Estimate total daily energy expenditure from BMR equation and activity level.",
    category: "Metabolism",
  },
  "bmr-calculator": {
    slug: "bmr-calculator",
    title: "BMR Calculator",
    description: "Estimate basal metabolic rate from standard resting-energy equations.",
    category: "Metabolism",
  },

  // CALORIES
  "calorie-deficit-calculator": {
    slug: "calorie-deficit-calculator",
    title: "Calorie Deficit Calculator",
    description: "Calculate deficit targets and daily calories from your selected weekly pace.",
    category: "Calories",
  },
  "macro-calculator": {
    slug: "macro-calculator",
    title: "Macro Calculator",
    description: "Set protein, carb, and fat gram targets from calorie goals and macro split presets.",
    category: "Calories",
  },
  "steps-to-calories-calculator": {
    slug: "steps-to-calories-calculator",
    title: "Steps to Calories Calculator",
    description: "Estimate calories burned from steps using stride, body weight, and walking pace.",
    category: "Calories",
  },
  "calories-burned-calculator": {
    slug: "calories-burned-calculator",
    title: "Calories Burned Calculator",
    description: "Estimate calories burned for many activities using MET-based exercise energy equations.",
    category: "Calories",
  },
  "calorie-estimator": {
    slug: "calorie-estimator",
    title: "Calorie Estimator",
    description: "Estimate meal calories from a photo with AI and confidence ranges.",
    category: "Calories",
  },
};

// --- helpers ---
export function toolsArray() {
  return Object.values(TOOLS);
}

export function pickTools(slugs: string[]) {
  return slugs.map((s) => TOOLS[s]).filter(Boolean);
}

export function getToolsByCategories(categories: ToolCategory[]) {
  const set = new Set(categories);
  return toolsArray().filter((t) => set.has(t.category));
}

export function toolCategoryArray() {
  return TOOL_CATEGORY_ORDER.map((category) => TOOL_CATEGORY_META_BY_NAME[category]);
}

export function getToolCategoryMeta(category: ToolCategory) {
  return TOOL_CATEGORY_META_BY_NAME[category];
}

export function getToolCategoryMetaBySlug(slug: string) {
  return TOOL_CATEGORY_META_BY_SLUG[slug as ToolCategorySlug] ?? null;
}

export function getToolCategoryTabs(): ToolCategoryTab[] {
  return [
    { key: "all", label: "All", href: "/tools" },
    ...toolCategoryArray().map((meta) => ({
      key: meta.slug,
      label: meta.navLabel,
      href: `/tools/${meta.slug}`,
    })),
  ];
}

export function getToolsByCategory(category: ToolCategory) {
  return toolsArray().filter((tool) => tool.category === category);
}
