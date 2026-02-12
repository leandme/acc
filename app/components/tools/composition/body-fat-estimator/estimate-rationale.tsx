"use client";

import React from "react";

type Props = {
  rationale?: string | null;
  estimate: number | null; 
  className?: string;
};

export default function EstimateRationale({ estimate, rationale, className = "" }: Props) {
  const text = (rationale ?? "").trim();
  if (!text) return null;

  return (
    <section className={`w-full max-w-3xl ${className}`}>
      <div className="px-4 sm:px-6">
        <h3 className="text-3xl lg:text-4xl font-semibold text-center mb-2">
          Why this Estimate
        </h3>

        <blockquote>
          <div className="relative py-6 sm:py-8">
            {/* Opening quote */}
            <span
              aria-hidden
              className="absolute left-0 top-0 text-6xl sm:text-7xl font-serif text-gray-300 select-none leading-none"
            >
              “
            </span>

            {/* Closing quote */}
            <span
              aria-hidden
              className="absolute right-0 bottom-0 text-6xl sm:text-7xl font-serif text-gray-300 select-none leading-none"
            >
              ”
            </span>

            {/* Text safe zone */}
            <div className="px-6 sm:px-10">
              <p className="text-gray-700 leading-relaxed text-lg sm:text-lg italic">
                {text}
              </p>
            </div>
          </div>
        </blockquote>
        <footer className="px-6 sm:px-10 text-lg sm:text-base font-semibold text-gray-700">
                — BodyFat AI
       </footer>
      </div>
    </section>
  );
}
