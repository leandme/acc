export type ToolCategory =
  | "Body Fat"
  | "Body Composition"
  | "Body Proportions"
  | "Body Weight"
  | "Metabolism"
  | "Calories"
  | "Energy & Metabolism"
  | "Nutrition & Macronutrients"
  | "Calorie Burn";

export type ToolMeta = {
  slug: string;
  title: string;
  description?: string;
  eventName?: "Go to Tool"; // optional override if needed later
  category: ToolCategory;
};

export const TOOLS: Record<string, ToolMeta> = {

// BODY COMPOSITION
  "ffmi-calculator": {
    slug: "ffmi-calculator",
    title: "FFMI Calculator",
    description: "How much of you is muscle?",
    category: "Body Composition",
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
  "body-shape-analyzer": {
    slug: "body-shape-analyzer",
    title: "Body Shape Analyzer",
    description: "Upload a photo and analyze your visual body type.",
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
