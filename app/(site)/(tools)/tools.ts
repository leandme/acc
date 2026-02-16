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
  "rfm-calculator": {
    slug: "rfm-calculator",
    title: "RFM Calculator",
    description: "Estimate body fat from height and waist.",
    category: "Body Composition",
  },
  "visceral-fat-calculator": {
    slug: "visceral-fat-calculator",
    title: "Visceral Fat Calculator",
    description: "Estimate visceral fat area from body measurements.",
    category: "Body Composition",
  },

  "body-visualizer": {
    slug: "body-visualizer",
    title: "Body Visualizer",
    description: "Visualize body shape from BMI, body fat %, height, and weight.",
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
