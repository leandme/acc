"use client";

type AccuracyLevel = "low" | "medium" | "high";

function getAccuracyStyles(level: AccuracyLevel) {
  switch (level) {
    case "high":
      return {
        label: "High",
        color: "text-green-700",
        bg: "bg-green-100",
        border: "border-green-300",
      };
    case "medium":
      return {
        label: "Medium",
        color: "text-yellow-700",
        bg: "bg-yellow-100",
        border: "border-yellow-300",
      };
    default:
      return {
        label: "Low",
        color: "text-red-700",
        bg: "bg-red-100",
        border: "border-red-300",
      };
  }
}


export default function ConfidenceBand({
  accuracy = "low",
}: {
  accuracy?: "low" | "medium" | "high";
}) {
  const styles = getAccuracyStyles(accuracy);

  return (
    <div className="mt-6">
      <span className="text-sm text-gray-700 font-semibold">Accuracy:&nbsp;</span>
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-semibold
        ${styles.bg} ${styles.border} ${styles.color}`}
      >
        
        <span className="uppercase tracking-wide">{styles.label}</span>
      </div>

      <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-md">
        Accuracy improves with consistent lighting, image quality and tighter or less clothing.
      </p>
    </div>
  );
}
