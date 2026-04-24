export type ToolCategory =
  | "Fat"
  | "Shape"
  | "Muscle"
  | "Height"
  | "Face"
  | "Weight"
  | "Calories";

export type ToolCategorySlug =
  | "fat"
  | "shape"
  | "muscle"
  | "height"
  | "face"
  | "weight"
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
  "Face",
  "Fat",
  "Shape",
  "Weight",
  "Calories",
];

const TOOL_CATEGORY_META_BY_NAME: Record<ToolCategory, ToolCategoryMeta> = {
  Muscle: {
    category: "Muscle",
    slug: "muscle",
    navLabel: "Muscle",
    h1: "Muscle Tools",
    description:
      "Explore muscle-focused calculators for FFMI, natural potential screening, frame-based potential, and bodybuilding-specific context.",
  },
  Height: {
    category: "Height",
    slug: "height",
    navLabel: "Height",
    h1: "Height Tools",
    description:
      "Use parent-based models for target adult height, expected family range, and probability-style planning context.",
  },
  Face: {
    category: "Face",
    slug: "face",
    navLabel: "Face",
    h1: "Face Tools",
    description:
      "Analyze facial shape, symmetry, apparent age, and attractiveness with AI-based classifiers, confidence scoring, and practical photo-standardization guidance.",
  },
  Fat: {
    category: "Fat",
    slug: "fat",
    navLabel: "Fat",
    h1: "Fat Tools",
    description:
      "Estimate body fat with photo-based, tape-based, and skinfold-based methods, plus visual and adiposity-oriented tools.",
  },
  Shape: {
    category: "Shape",
    slug: "shape",
    navLabel: "Shape",
    h1: "Shape Tools",
    description:
      "Analyze body shape, frame context, and proportionality with ratio-based and measurement-based screening tools.",
  },
  Weight: {
    category: "Weight",
    slug: "weight",
    navLabel: "Weight",
    h1: "Weight Tools",
    description:
      "Run BMI, healthy-range, ideal-weight, and weight-change tools for practical planning and progress review.",
  },
  Calories: {
    category: "Calories",
    slug: "calories",
    navLabel: "Calories",
    h1: "Calorie Tools",
    description:
      "Estimate BMR/TDEE, then plan deficits, macros, fasting strategies, and calorie burn with practical energy-planning tools.",
  },
};

const TOOL_CATEGORY_META_BY_SLUG: Record<ToolCategorySlug, ToolCategoryMeta> = {
  fat: TOOL_CATEGORY_META_BY_NAME["Fat"],
  shape: TOOL_CATEGORY_META_BY_NAME["Shape"],
  muscle: TOOL_CATEGORY_META_BY_NAME["Muscle"],
  height: TOOL_CATEGORY_META_BY_NAME["Height"],
  face: TOOL_CATEGORY_META_BY_NAME["Face"],
  weight: TOOL_CATEGORY_META_BY_NAME["Weight"],
  calories: TOOL_CATEGORY_META_BY_NAME["Calories"],
};

const LEGACY_TOOL_CATEGORY_SLUGS: Record<string, ToolCategorySlug> = {
  "body-fat": "fat",
  "body-composition": "shape",
  composition: "shape",
  "body-proportions": "shape",
  "body-weight": "weight",
  metabolism: "calories",
};

export type ToolCategoryTab = {
  key: "all" | ToolCategorySlug;
  label: string;
  href: string;
};

const REMOVED_TOOL_SLUGS = new Set<string>([
  "skinfold-body-fat-calculator",
  "calorie-calculator",
  "tdee-calculator",
  "bmr-calculator",
  "army-body-fat-calculator",
  "lean-body-mass-calculator",
  "body-frame-size-calculator",
  "natty-or-not-calculator",
  "muscular-potential-calculator",
  "casey-butt-calculator",
  "bodybuilding-genetics-calculator",
  "rfm-calculator",
  "bri-calculator",
  "visceral-fat-calculator",
  "body-shape-calculator",
  "shoulder-to-waist-ratio-calculator",
  "mid-parental-height-calculator",
  "overweight-calculator",
  "adjusted-body-weight-calculator",
  "ponderal-index-calculator",
  "broca-index-calculator",
  "waist-to-hip-ratio-calculator",
  "waist-to-height-ratio-calculator",
  "bai-calculator",
  "muscle-mass-calculator",
  "ideal-waist-size-calculator",
  "steps-to-calories-calculator",
  "calories-burned-calculator",
  "bmi-calculator",
  "weight-loss-calculator",
  "weight-loss-percentage-calculator",
  "fasting-weight-loss-calculator",
  "intermittent-fasting-calculator",
  "ideal-weight-calculator",
  "ape-index-calculator",
  "calorie-deficit-calculator",
  "macro-calculator",
  "calorie-counter",
  "age-guesser",
  "height-calculator",
  "ffmi-calculator",
  "attractiveness-test",
  "face-symmetry-test",
  "eyebrow-type-detector",
  "hair-color-detector",
  "hair-type-detector",
  "lip-shape-detector",
  "nose-shape-detector",
  "skin-analyzer",
  "golden-face-ratio-analyzer",
  "face-shape-detector",
  "eye-shape-detector",
  "height-estimator",
]);

export const TOOLS: Record<string, ToolMeta> = {

// BODY COMPOSITION / SHAPE
  "ffmi-calculator": {
    slug: "ffmi-calculator",
    title: "FFMI Calculator",
    description: "How much of you is muscle?",
    category: "Muscle",
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
    category: "Muscle",
  },
  "muscle-mass-calculator": {
    slug: "muscle-mass-calculator",
    title: "Muscle Mass Calculator",
    description: "Estimate skeletal muscle mass from anthropometric measurements.",
    category: "Muscle",
  },
  "rfm-calculator": {
    slug: "rfm-calculator",
    title: "RFM Calculator",
    description: "Estimate body fat from height and waist.",
    category: "Fat",
  },
  "bri-calculator": {
    slug: "bri-calculator",
    title: "BRI Calculator",
    description: "Estimate body roundness from waist and height.",
    category: "Fat",
  },
  "visceral-fat-calculator": {
    slug: "visceral-fat-calculator",
    title: "Visceral Fat Calculator",
    description: "Estimate visceral fat area from body measurements.",
    category: "Fat",
  },
  "body-frame-size-calculator": {
    slug: "body-frame-size-calculator",
    title: "Body Frame Size Calculator",
    description: "Estimate frame size from height and wrist ratio.",
    category: "Shape",
  },
  "waist-to-hip-ratio-calculator": {
    slug: "waist-to-hip-ratio-calculator",
    title: "Waist to Hip Ratio Calculator",
    description: "Assess waist-to-hip ratio with sex-specific central-fat risk thresholds.",
    category: "Shape",
  },
  "waist-to-height-ratio-calculator": {
    slug: "waist-to-height-ratio-calculator",
    title: "Waist to Height Ratio Calculator",
    description: "Assess waist-to-height ratio against central-fat risk screening thresholds.",
    category: "Shape",
  },
  "shoulder-to-waist-ratio-calculator": {
    slug: "shoulder-to-waist-ratio-calculator",
    title: "Shoulder to Waist Ratio Calculator",
    description: "Calculate shoulder-to-waist taper ratio from circumference measurements.",
    category: "Shape",
  },
  "ideal-waist-size-calculator": {
    slug: "ideal-waist-size-calculator",
    title: "Ideal Waist Size Calculator",
    description: "Estimate ideal waist-size targets from height and ratio-based planning bands.",
    category: "Shape",
  },
  "ape-index-calculator": {
    slug: "ape-index-calculator",
    title: "Ape Index Calculator",
    description: "Calculate wingspan-to-height ratio and wingspan-height reach difference.",
    category: "Shape",
  },
  "body-shape-calculator": {
    slug: "body-shape-calculator",
    title: "Body Shape Calculator",
    description: "Estimate your body-shape category from bust/chest, waist, and hip measurements.",
    category: "Shape",
  },
  "face-symmetry-test": {
    slug: "face-symmetry-test",
    title: "Face Symmetry Test",
    description: "Upload a face photo to estimate symmetry score and compare mirrored facial halves.",
    category: "Face",
  },
  "face-shape-detector": {
    slug: "face-shape-detector",
    title: "Face Shape Detector",
    description: "Upload a portrait to detect your face shape with AI and confidence scoring.",
    category: "Face",
  },
  "jawline-check": {
    slug: "jawline-check",
    title: "Jawline Check",
    description: "Upload a side-profile photo to estimate jawline angle and classify jawline type with AI.",
    category: "Shape",
  },
  "age-guesser": {
    slug: "age-guesser",
    title: "Age Guesser",
    description: "Estimate how old you look from a face photo with AI age range and confidence.",
    category: "Face",
  },
  "attractiveness-test": {
    slug: "attractiveness-test",
    title: "Attractiveness Test",
    description: "Upload a portrait to get an AI attractiveness score with confidence bands and interpretation table.",
    category: "Face",
  },
  "golden-face-ratio-analyzer": {
    slug: "golden-face-ratio-analyzer",
    title: "Golden Face Ratio Analyzer",
    description: "Upload a portrait for AI golden-ratio facial analysis and use the on-page manual calculator.",
    category: "Face",
  },
  "eyebrow-type-detector": {
    slug: "eyebrow-type-detector",
    title: "Eyebrow Type Detector",
    description: "Upload a portrait to detect eyebrow type with confidence and grooming interpretation.",
    category: "Face",
  },
  "eye-shape-detector": {
    slug: "eye-shape-detector",
    title: "Eye Shape Detector",
    description: "Detect eye shape, canthal tilt, and eye color from a portrait with AI.",
    category: "Face",
  },
  "lip-shape-detector": {
    slug: "lip-shape-detector",
    title: "Lip Shape Detector",
    description: "Detect lip shape, upper-lower balance, and cupid's bow pattern from a portrait with AI.",
    category: "Face",
  },
  "nose-shape-detector": {
    slug: "nose-shape-detector",
    title: "Nose Shape Detector",
    description: "Detect nose shape, bridge profile, and tip direction from a portrait with AI.",
    category: "Face",
  },
  "skin-analyzer": {
    slug: "skin-analyzer",
    title: "Skin Analyzer",
    description: "Analyze skin type, tone depth, undertone, and care-direction context from a portrait with AI.",
    category: "Face",
  },
  "hair-color-detector": {
    slug: "hair-color-detector",
    title: "Hair Color Detector",
    description: "Detect hair color, undertone, and depth from a portrait with AI confidence scoring.",
    category: "Face",
  },
  "hair-type-detector": {
    slug: "hair-type-detector",
    title: "Hair Type Detector",
    description: "Detect likely hair type (1A-4C), curl family, and care-direction context from a portrait with AI.",
    category: "Face",
  },

  "body-visualizer": {
    slug: "body-visualizer",
    title: "Body Visualizer",
    description: "Visualize body shape from BMI, body fat %, height, and weight.",
    category: "Fat",
  },
  "bai-calculator": {
    slug: "bai-calculator",
    title: "BAI Calculator",
    description: "Estimate body adiposity from hip circumference and height.",
    category: "Fat",
  },
  estimate: {
    slug: "estimate",
    title: "Body Fat Estimator",
    description: "Estimate your body fat % from a photo.",
    category: "Fat",
  },
  "body-fat-calculator": {
    slug: "body-fat-calculator",
    title: "Navy Body Fat Calculator",
    description: "Estimate body fat % with the U.S. Navy circumference formula.",
    category: "Fat",
  },
  "skinfold-body-fat-calculator": {
    slug: "skinfold-body-fat-calculator",
    title: "Skinfold Body Fat Calculator",
    description: "Estimate body fat % from 3-site skinfold caliper measurements.",
    category: "Fat",
  },

  "army-body-fat-calculator": {
    slug: "army-body-fat-calculator",
    title: "Army Body Fat Calculator",
    description: "Estimate body fat % using the US Army tape method.",
    category: "Fat",
  },

  // BODY WEIGHT
  "weight-loss-percentage-calculator": {
    slug: "weight-loss-percentage-calculator",
    title: "Weight Loss Percentage Calculator",
    description: "Calculate percentage change from starting to current weight.",
    category: "Weight",
  },
  "overweight-calculator": {
    slug: "overweight-calculator",
    title: "Overweight Calculator",
    description: "Check BMI category and estimate weight above the healthy range.",
    category: "Weight",
  },
  "ideal-weight-calculator": {
    slug: "ideal-weight-calculator",
    title: "Ideal Weight Calculator",
    description: "Compare healthy BMI range and Devine ideal body weight.",
    category: "Weight",
  },
  "height-calculator": {
    slug: "height-calculator",
    title: "Height Calculator",
    description: "Estimate family-based height prediction, potential range, and target probability.",
    category: "Height",
  },
  "height-estimator": {
    slug: "height-estimator",
    title: "Height Estimator",
    description: "Estimate apparent adult height from a full-body photo with confidence and range context.",
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
    category: "Weight",
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
    category: "Weight",
  },
  "bmi-calculator": {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    description: "Calculate BMI and view adult category ranges by height and weight.",
    category: "Weight",
  },
  "ponderal-index-calculator": {
    slug: "ponderal-index-calculator",
    title: "Ponderal Index Calculator",
    description: "Calculate ponderal index and compare with BMI-equivalent ranges.",
    category: "Weight",
  },
  "broca-index-calculator": {
    slug: "broca-index-calculator",
    title: "Broca Index Calculator",
    description: "Compare current weight against classic Broca height-based reference.",
    category: "Weight",
  },

  // METABOLISM (merged into CALORIES)
  "tdee-calculator": {
    slug: "tdee-calculator",
    title: "TDEE Calculator",
    description: "Estimate total daily energy expenditure from BMR equation and activity level.",
    category: "Calories",
  },
  "bmr-calculator": {
    slug: "bmr-calculator",
    title: "BMR Calculator",
    description: "Estimate basal metabolic rate from standard resting-energy equations.",
    category: "Calories",
  },

  // CALORIES
  "calorie-deficit-calculator": {
    slug: "calorie-deficit-calculator",
    title: "Calorie Deficit Calculator",
    description: "Calculate deficit targets and daily calories from your selected weekly pace.",
    category: "Calories",
  },
  "calorie-calculator": {
    slug: "calorie-calculator",
    title: "Calorie Calculator",
    description: "Estimate how many calories you need for maintenance, fat loss, or lean gain.",
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
  "calorie-counter": {
    slug: "calorie-counter",
    title: "Calorie Counter",
    description: "Estimate meal calories from a photo with AI and confidence ranges.",
    category: "Calories",
  },
};

// --- helpers ---
export function toolsArray() {
  return Object.values(TOOLS).filter((tool) => !REMOVED_TOOL_SLUGS.has(tool.slug));
}

export function pickTools(slugs: string[]) {
  return slugs
    .map((s) => TOOLS[s])
    .filter((tool): tool is ToolMeta => Boolean(tool) && !REMOVED_TOOL_SLUGS.has(tool.slug));
}

export function getToolsByCategories(categories: ToolCategory[]) {
  const set = new Set(categories);
  return toolsArray().filter((t) => set.has(t.category));
}

export function toolCategoryArray() {
  return TOOL_CATEGORY_ORDER
    .filter((category) =>
      toolsArray().some((tool) => tool.category === category)
    )
    .map((category) => TOOL_CATEGORY_META_BY_NAME[category]);
}

export function getToolCategoryMeta(category: ToolCategory) {
  return TOOL_CATEGORY_META_BY_NAME[category];
}

export function getToolCategoryMetaBySlug(slug: string) {
  const normalizedSlug = LEGACY_TOOL_CATEGORY_SLUGS[slug] ?? slug;
  return TOOL_CATEGORY_META_BY_SLUG[normalizedSlug as ToolCategorySlug] ?? null;
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
