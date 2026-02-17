export type CalorieBurnActivityKey =
  | "walking"
  | "running"
  | "cycling"
  | "swimming"
  | "hiking"
  | "rucking"
  | "treadmill"
  | "incline-walking"
  | "elliptical"
  | "stationary-bike"
  | "stair-climber"
  | "rowing"
  | "hiit"
  | "crossfit"
  | "strength-training"
  | "bodyweight-workout"
  | "circuit-training"
  | "bodybuilding"
  | "yoga"
  | "pilates"
  | "boxing"
  | "martial-arts"
  | "dancing"
  | "jump-rope"
  | "skiing";

export type CalorieBurnActivity = {
  key: CalorieBurnActivityKey;
  label: string;
  met: number;
  note: string;
};

export const CALORIE_BURN_ACTIVITIES: CalorieBurnActivity[] = [
  { key: "walking", label: "Walking", met: 3.5, note: "General steady walking pace." },
  { key: "running", label: "Running", met: 9.8, note: "Moderate running effort." },
  { key: "cycling", label: "Cycling", met: 7.5, note: "Moderate outdoor cycling." },
  { key: "swimming", label: "Swimming", met: 8, note: "Moderate lap swimming." },
  { key: "hiking", label: "Hiking", met: 6, note: "Trail hiking with varied terrain." },
  { key: "rucking", label: "Rucking", met: 7, note: "Loaded walking effort." },
  { key: "treadmill", label: "Treadmill", met: 8.3, note: "Jogging/running treadmill pace." },
  { key: "incline-walking", label: "Incline Walking", met: 6.5, note: "Incline treadmill walking." },
  { key: "elliptical", label: "Elliptical", met: 5.5, note: "Moderate elliptical trainer effort." },
  { key: "stationary-bike", label: "Stationary Bike", met: 7, note: "Moderate indoor cycling." },
  { key: "stair-climber", label: "Stair Climber", met: 8.8, note: "Steady climbing machine effort." },
  { key: "rowing", label: "Rowing", met: 7, note: "Moderate rowing machine pace." },
  { key: "hiit", label: "HIIT", met: 10, note: "High-intensity interval effort." },
  { key: "crossfit", label: "CrossFit", met: 9, note: "High-intensity mixed-modal training." },
  { key: "strength-training", label: "Strength Training", met: 5, note: "General resistance training." },
  { key: "bodyweight-workout", label: "Bodyweight Workout", met: 6, note: "Moderate calisthenics session." },
  { key: "circuit-training", label: "Circuit Training", met: 8, note: "Continuous station-based training." },
  { key: "bodybuilding", label: "Bodybuilding", met: 6, note: "Hypertrophy-focused resistance work." },
  { key: "yoga", label: "Yoga", met: 3, note: "General yoga practice." },
  { key: "pilates", label: "Pilates", met: 3.5, note: "General pilates class effort." },
  { key: "boxing", label: "Boxing", met: 9, note: "Bag/sparring conditioning intensity." },
  { key: "martial-arts", label: "Martial Arts", met: 10.3, note: "General martial arts training." },
  { key: "dancing", label: "Dancing", met: 5.5, note: "Moderate dance session effort." },
  { key: "jump-rope", label: "Jump Rope", met: 12.3, note: "Continuous rope-skipping effort." },
  { key: "skiing", label: "Skiing", met: 7, note: "General downhill/recreational skiing." },
];

export function getCalorieBurnActivity(key: CalorieBurnActivityKey) {
  return CALORIE_BURN_ACTIVITIES.find((activity) => activity.key === key) ?? CALORIE_BURN_ACTIVITIES[0];
}
