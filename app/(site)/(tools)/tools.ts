export type ToolCategory =
  | "Body Fat"
  | "Body Composition"
  | "Body Proportions"
  | "Body Weight"
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

  "body-visualizer": {
    slug: "body-visualizer",
    title: "Body Fat Visualizer",
    description: "See what your body looks like.",
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

  "army-body-fat-calculator": {
    slug: "army-body-fat-calculator",
    title: "Army Body Fat Calculator",
    description: "Estimate body fat % using the US Army tape method.",
    category: "Body Fat",
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


{/* 

  Body Composition Calculator
  Navy Body Fat Calculator
Army
Regular
Body Fat Map
Body Fat Statistics
    fattest state in america
    fattest city in america
    fattest country in europe
    fattest asian country
    fattest country in africa
    Fattest country in the world
    sports with lowest body fat

2. Body Proportions
Waist-to-Hip Ratio Calculator
Weight-to-Height Ratio Calculator
Digit Ratio Calculator
Leg-to-Body Ratio Calculator
Body Proportions Calculator
body shape calculator
BSA Calculator

3. Body Weight
Ideal Weight Calculator
fasting weight loss calculator
Weight Loss Calculator – How Long to Lose Weight
Fasting Weight Loss Calculator
Diet Break Calculator
Healthy Weight Calculator
BMI calculator
Athlete BMI Calculator
Ponderal Index Calculator (Corpulence Index)
Broca Index Calculator

4. Metabolism
TDEE Calculator
BMR Calculator
NEAT Calorie Calculator
Calorie Goal Calculator
Calorie Deficit Calculator

5. Nutrition & Macronutrients
Macro Calculator
Protein Calculator
Carbohydrate Calculator
Fat Intake Calculator
Fiber Intake Calculator
Sugar Intake Calculator
Ketogenic Macro Calculator

6. Calorie Burn
Calorie Burn Calculator
Walking Calorie Calculator
Running Calorie Calculator
Cycling Calorie Calculator
Swimming Calorie Calculator
Hiking Calorie Calculator
Rucking Calorie Calculator
Treadmill Calorie Calculator
Incline Walking Calorie Calculator
Elliptical Calorie Calculator
Stationary Bike Calorie Calculator
Stair Climber Calorie Calculator
Rowing Calorie Calculator
HIIT Calorie Calculator
CrossFit Calorie Calculator
Strength Training Calorie Calculator
Bodyweight Workout Calorie Calculator
Circuit Training Calorie Calculator
Bodybuilding Calorie Calculator
Yoga Calorie Calculator
Pilates Calorie Calculator
Boxing Calorie Calculator
Martial Arts Calorie Calculator
Dancing Calorie Calculator
Jump Rope Calorie Calculator
Skiing Calorie Calculator
,
  "body-fat-map": {
    slug: "body-fat-map",
    title: "Body Fat Map",
    description: "See where body fat is typically stored by % and gender.",
    category: "Body Composition",

  },

  "body-shape-analyzer": {
    slug: "body-shape-analyzer",
    title: "Body Shape Analyzer",
    description: "Analyze body shape patterns from measurements.",
    category: "Body Composition",

  },

  "muscle-mass-calculator": {
    slug: "muscle-mass-calculator",
    title: "Muscle Mass Calculator",
    description: "Estimate muscle mass using body stats and assumptions.",
    category: "Body Composition",

  },

  "body-recomposition-calculator": {
    slug: "body-recomposition-calculator",
    title: "Body Recomposition Calculator",
    description: "Track fat loss + muscle gain changes over time.",
    category: "Body Composition",

  },

  "visceral-fat-calculator": {
    slug: "visceral-fat-calculator",
    title: "Visceral Fat Calculator",
    description: "Estimate visceral fat risk using waist and body stats.",
    category: "Body Composition",

  },

  "lean-body-mass-calculator": {
    slug: "lean-body-mass-calculator",
    title: "Lean Body Mass Calculator",
    description: "Estimate lean body mass from height, weight, and sex.",
    category: "Body Composition",

  },

  "bri-calculator": {
    slug: "bri-calculator",
    title: "BRI Calculator",
    description: "Calculate Body Roundness Index (BRI) from height and waist.",
    category: "Body Composition",

  },

  "rfm-calculator": {
    slug: "rfm-calculator",
    title: "RFM Calculator",
    description: "Calculate Relative Fat Mass (RFM) from height and waist.",
    category: "Body Composition",

  },

  "bai-calculator": {
    slug: "bai-calculator",
    title: "BAI Calculator",
    description: "Calculate Body Adiposity Index (BAI) from hips and height.",
    category: "Body Composition",
  
  },
*/}