export type ToolCategory =
  | "muscle"
  | "height"
  | "face"
  | "fat"
  | "shape"
  | "weight"
  | "calories"
  | string;

export type ToolCategorySlug = ToolCategory;

export type ToolCategoryMeta = {
  slug: ToolCategorySlug;
  navLabel: string;
  h1: string;
};

export type ToolMeta = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
};

export type ToolCategoryTab = {
  key: ToolCategorySlug | "all";
  label: string;
  href: string;
};

const TOOL_CATEGORY_META_BY_SLUG: Record<string, ToolCategoryMeta> = {
  muscle: { slug: "muscle", navLabel: "Muscle", h1: "Muscle" },
  height: { slug: "height", navLabel: "Height", h1: "Height" },
  face: { slug: "face", navLabel: "Face", h1: "Face" },
  fat: { slug: "fat", navLabel: "Fat", h1: "Fat" },
  shape: { slug: "shape", navLabel: "Shape", h1: "Shape" },
  weight: { slug: "weight", navLabel: "Weight", h1: "Weight" },
  calories: { slug: "calories", navLabel: "Calories", h1: "Calorie" },
};

const TOOL_LIST: ToolMeta[] = [
  { slug: "calorie-counter", title: "AI Calorie Counter", description: "Estimate calories from a food photo with AI.", category: "calories" },
  { slug: "calorie-calculator", title: "Calorie Calculator", description: "Estimate daily calories for maintenance, loss, or gain.", category: "calories" },
  { slug: "calorie-deficit-calculator", title: "Calorie Deficit Calculator", description: "Set practical calorie deficit targets.", category: "calories" },
  { slug: "macro-calculator", title: "Macro Calculator", description: "Split calories into protein, carbs, and fats.", category: "calories" },
  { slug: "tdee-calculator", title: "TDEE Calculator", description: "Estimate your maintenance intake from activity level.", category: "calories" },
  { slug: "bmr-calculator", title: "BMR Calculator", description: "Estimate resting energy expenditure.", category: "calories" },
  { slug: "steps-to-calories-calculator", title: "Steps to Calories Calculator", description: "Estimate calories burned from steps.", category: "calories" },
  { slug: "calories-burned-calculator", title: "Calories Burned Calculator", description: "Estimate calories burned across activities.", category: "calories" },
  { slug: "intermittent-fasting-calculator", title: "Intermittent Fasting Calculator", description: "Plan fasting windows and intake context.", category: "calories" },
  { slug: "fasting-weight-loss-calculator", title: "Fasting Weight Loss Calculator", description: "Project fasting-based weight change trends.", category: "calories" },

  { slug: "bmi-calculator", title: "BMI Calculator", description: "Calculate BMI and category range.", category: "weight" },
  { slug: "weight-loss-calculator", title: "Weight Loss Calculator", description: "Project progress based on intake and activity assumptions.", category: "weight" },
  { slug: "weight-loss-percentage-calculator", title: "Weight Loss Percentage Calculator", description: "Track weight change as a percentage.", category: "weight" },
  { slug: "ideal-weight-calculator", title: "Ideal Weight Calculator", description: "Estimate target ranges using common formulas.", category: "weight" },
  { slug: "overweight-calculator", title: "Overweight Calculator", description: "Compare current weight to reference ranges.", category: "weight" },
  { slug: "broca-index-calculator", title: "Broca Index Calculator", description: "Estimate weight baseline with Broca method.", category: "weight" },
  { slug: "ponderal-index-calculator", title: "Ponderal Index Calculator", description: "Height-adjusted body mass index alternative.", category: "weight" },
  { slug: "adjusted-body-weight-calculator", title: "Adjusted Body Weight Calculator", description: "Estimate adjusted body weight from current metrics.", category: "weight" },

  { slug: "height-calculator", title: "Height Calculator", description: "Estimate expected adult height range.", category: "height" },
  { slug: "height-estimator", title: "Height Estimator", description: "AI-based height estimation from image cues.", category: "height" },
  { slug: "mid-parental-height-calculator", title: "Mid-Parental Height Calculator", description: "Parent-based expected height estimate.", category: "height" },

  { slug: "body-shape-calculator", title: "Body Shape Calculator", description: "Classify body shape from proportion inputs.", category: "shape" },
  { slug: "waist-to-height-ratio-calculator", title: "Waist to Height Ratio Calculator", description: "Screen waist-to-height ratio.", category: "shape" },
  { slug: "waist-to-hip-ratio-calculator", title: "Waist to Hip Ratio Calculator", description: "Calculate waist-to-hip ratio.", category: "shape" },
  { slug: "shoulder-to-waist-ratio-calculator", title: "Shoulder to Waist Ratio Calculator", description: "Calculate shoulder-to-waist ratio.", category: "shape" },
  { slug: "ideal-waist-size-calculator", title: "Ideal Waist Size Calculator", description: "Estimate target waist range.", category: "shape" },
  { slug: "ape-index-calculator", title: "Ape Index Calculator", description: "Compare arm span and height.", category: "shape" },

  { slug: "ffmi-calculator", title: "FFMI Calculator", description: "Estimate fat-free mass index.", category: "muscle" },
  { slug: "natty-or-not-calculator", title: "Natty or Not Calculator", description: "Contextualize FFMI against natural ranges.", category: "muscle" },
  { slug: "muscular-potential-calculator", title: "Muscular Potential Calculator", description: "Frame-aware natural potential estimate.", category: "muscle" },
  { slug: "casey-butt-calculator", title: "Casey Butt Calculator", description: "Estimate natural muscular ceiling.", category: "muscle" },
  { slug: "bodybuilding-genetics-calculator", title: "Bodybuilding Genetics Calculator", description: "Estimate genetics-oriented ceiling context.", category: "muscle" },
  { slug: "lean-body-mass-calculator", title: "Lean Body Mass Calculator", description: "Estimate lean mass from body metrics.", category: "muscle" },
  { slug: "muscle-mass-calculator", title: "Muscle Mass Calculator", description: "Estimate muscle mass with practical assumptions.", category: "muscle" },
  { slug: "rfm-calculator", title: "RFM Calculator", description: "Relative Fat Mass estimation from anthropometrics.", category: "fat" },
  { slug: "bri-calculator", title: "BRI Calculator", description: "Body roundness index estimate.", category: "fat" },
  { slug: "visceral-fat-calculator", title: "Visceral Fat Calculator", description: "Visceral fat risk context estimate.", category: "fat" },
  { slug: "body-frame-size-calculator", title: "Body Frame Size Calculator", description: "Classify frame size from wrist and height.", category: "fat" },
  { slug: "body-fat-calculator", title: "Navy Body Fat Calculator", description: "Estimate body fat from circumference measurements.", category: "fat" },
  { slug: "skinfold-body-fat-calculator", title: "Skinfold Body Fat Calculator", description: "Estimate body fat from skinfold inputs.", category: "fat" },
  { slug: "army-body-fat-calculator", title: "Army Body Fat Calculator", description: "US Army method body fat estimate.", category: "fat" },

  { slug: "face-symmetry-test", title: "Face Symmetry Test", description: "Analyze facial symmetry cues.", category: "face" },
  { slug: "face-shape-detector", title: "Face Shape Detector", description: "Detect probable face shape from a photo.", category: "face" },
  { slug: "jawline-check", title: "Jawline Check", description: "Analyze jawline structure cues.", category: "face" },
  { slug: "age-guesser", title: "Age Guesser", description: "Estimate apparent age from photo cues.", category: "face" },
  { slug: "attractiveness-test", title: "Attractiveness Test", description: "Appearance feature scoring and insights.", category: "face" },
  { slug: "golden-face-ratio-analyzer", title: "Golden Face Ratio Analyzer", description: "Golden ratio style facial proportion analysis.", category: "face" },
  { slug: "eyebrow-type-detector", title: "Eyebrow Type Detector", description: "Classify eyebrow shape and style.", category: "face" },
  { slug: "eye-shape-detector", title: "Eye Shape Detector", description: "Classify eye shape from image cues.", category: "face" },
  { slug: "lip-shape-detector", title: "Lip Shape Detector", description: "Classify lip shape from image cues.", category: "face" },
  { slug: "nose-shape-detector", title: "Nose Shape Detector", description: "Classify nose shape from image cues.", category: "face" },
  { slug: "skin-analyzer", title: "Skin Analyzer", description: "Analyze visible skin-profile cues.", category: "face" },
  { slug: "hair-color-detector", title: "Hair Color Detector", description: "Detect probable hair color profile.", category: "face" },
  { slug: "hair-type-detector", title: "Hair Type Detector", description: "Detect probable hair type and pattern.", category: "face" },
];

export const TOOLS: Record<string, ToolMeta> = Object.fromEntries(
  TOOL_LIST.map((tool) => [tool.slug, tool])
);

export function getToolCategoryMeta(category: ToolCategory): ToolCategoryMeta {
  return (
    TOOL_CATEGORY_META_BY_SLUG[category] ?? {
      slug: category,
      navLabel: "Tools",
      h1: "Tools",
    }
  );
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return TOOL_LIST.filter((tool) => tool.category === category);
}

export function getToolsByCategories(categories: ToolCategory[]): ToolMeta[] {
  const categorySet = new Set(categories);
  return TOOL_LIST.filter((tool) => categorySet.has(tool.category));
}

export function pickTools(slugs: string[]): ToolMeta[] {
  return slugs
    .map((slug) => TOOLS[slug])
    .filter((tool): tool is ToolMeta => Boolean(tool));
}
