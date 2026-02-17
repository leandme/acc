"use client";

import React from "react";
import EstimateGauge from "./estimate-gauge";

type Accuracy = "low" | "medium" | "high";

type Props = {
  imageUrl: string;
  estimate: number;
  category: string;
  accuracy: Accuracy;
  generatedAtLabel: string;
};

const accuracyStyles: Record<Accuracy, string> = {
  high: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-red-100 text-red-800",
};

function formatEstimate(estimate: number) {
  return Number.isInteger(estimate) ? String(estimate) : estimate.toFixed(1);
}

const EstimateExportCard = React.forwardRef<HTMLDivElement, Props>(
  function EstimateExportCard(
    { imageUrl, estimate, category, accuracy, generatedAtLabel }: Props,
    ref
  ) {
    return (
      <div ref={ref} className="w-[1080px] h-[1920px] bg-white text-slate-900">
        <div className="h-full px-[48px] pt-[48px] pb-[18px] flex flex-col">
          <img
            src={imageUrl}
            alt="Body fat estimate uploaded photo"
            className="w-full h-[1240px] object-cover rounded-[20px] bg-base-200"
          />

          <div className="mt-6 flex flex-col items-center">
            <EstimateGauge estimate={formatEstimate(estimate)} variant="export" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 w-full">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-10 py-6 text-[40px] font-semibold leading-none tracking-tight text-slate-900 whitespace-nowrap">
              <span>Category: {category}</span>
            </div>

            <div
              className={`inline-flex items-center rounded-full px-10 py-6 text-[40px] font-semibold leading-none tracking-tight whitespace-nowrap ${accuracyStyles[accuracy]}`}
            >
              <span>Accuracy: {accuracy.toUpperCase()}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 text-center text-[34px] font-normal leading-none text-slate-500">
            {generatedAtLabel}
          </div>
        </div>
      </div>
    );
  }
);

export default EstimateExportCard;
