import React from "react";

type Reference = {
  label: string;
  href: string;
};

type ReferencesProps = {
  references: Reference[];
  heading?: string;
  className?: string;
};

export default function References({
  references,
  heading = "References",
  className = "",
}: ReferencesProps) {
  if (!references || references.length === 0) return null;

  return (
    <section className={`mt-14 border-t pt-10 ${className}`}>
      <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-left">
        {heading}
      </h3>

      <ul className="mt-4 list-disc pl-6 space-y-2 text-lg text-gray-700">
        {references.map((ref, i) => (
          <li key={i}>
            <a
              href={ref.href}
              className="text-primary underline hover:text-primary/80"
            >
              {ref.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
