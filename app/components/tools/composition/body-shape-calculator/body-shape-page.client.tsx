"use client";

import { useState } from "react";
import { round } from "@/app/components/tools/body-weight/shared/math";
import BodyShapeCalculator from "@/app/components/tools/composition/body-shape-calculator/body-shape-calculator";
import BodyShapeInterpretation from "@/app/components/tools/composition/body-shape-calculator/body-shape-interpretation";
import { BODY_SHAPE_ROWS, type BodyShapeKey } from "@/app/components/tools/composition/body-shape-calculator/body-shape-types";
import { MoreTools } from "../../template/more-tools";

export default function BodyShapePageClient() {
  const [shape, setShape] = useState<BodyShapeKey | null>(null);
  const [topScore, setTopScore] = useState<number | null>(null);
  const [bustCm, setBustCm] = useState<number | null>(null);
  const [waistCm, setWaistCm] = useState<number | null>(null);
  const [hipCm, setHipCm] = useState<number | null>(null);
  const [bustToHip, setBustToHip] = useState<number | null>(null);
  const [waistToBust, setWaistToBust] = useState<number | null>(null);
  const [waistToHip, setWaistToHip] = useState<number | null>(null);

  const sectionWrap =
    "w-full max-w-3xl mx-auto space-y-6 text-gray-900 mt-20 lg:mt-40 leading-relaxed";
  const pClass = "text-lg leading-relaxed";
  const h2Class = "text-3xl lg:text-4xl font-semibold text-center";

  const shapeLabel = shape ? BODY_SHAPE_ROWS.find((row) => row.key === shape)?.label ?? null : null;

  return (
    <main className="bg-base-100">
      <section className="flex flex-col items-center justify-start pt-10">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">Body Shape Calculator</h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Estimate your likely body-shape category from bust/chest, waist, and hip measurements.
        </p>

        <div className="mt-8 w-full flex justify-center px-6">
          <div className="w-full max-w-5xl">
            <BodyShapeCalculator
              onChange={({ shape, topScore, bustCm, waistCm, hipCm, bustToHip, waistToBust, waistToHip }) => {
                setShape(shape);
                setTopScore(topScore);
                setBustCm(bustCm);
                setWaistCm(waistCm);
                setHipCm(hipCm);
                setBustToHip(bustToHip);
                setWaistToBust(waistToBust);
                setWaistToHip(waistToHip);
              }}
            />
          </div>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-20 lg:mt-40" id="body-shape-interpretation">
          <BodyShapeInterpretation shape={shape} topScore={topScore} />
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>What This Body Shape Calculator Measures</h2>
          <p className={pClass}>
            This tool compares your bust/chest, waist, and hip proportions to estimate your closest visual
            shape category. It is useful for fit planning and tracking proportion changes over time.
          </p>
          {shapeLabel &&
          topScore != null &&
          bustCm != null &&
          waistCm != null &&
          hipCm != null &&
          bustToHip != null &&
          waistToBust != null &&
          waistToHip != null ? (
            <p className={pClass}>
              Current setup: bust/chest <strong>{round(bustCm, 1)} cm</strong>, waist{" "}
              <strong>{round(waistCm, 1)} cm</strong>, hips <strong>{round(hipCm, 1)} cm</strong>. Best-fit
              category is <strong>{shapeLabel}</strong> with <strong>{Math.round(topScore)}%</strong> match
              strength. Ratios: bust-to-hip <strong>{round(bustToHip, 2)}</strong>, waist-to-bust{" "}
              <strong>{round(waistToBust, 2)}</strong>, waist-to-hip{" "}
              <strong>{round(waistToHip, 2)}</strong>.
            </p>
          ) : null}
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Measurement Tips for Better Consistency</h2>
          <ul className="list-disc pl-6 space-y-2 text-lg">
            <li>Measure bust/chest at the fullest circumference with tape level to the floor.</li>
            <li>Measure waist at the narrowest point between ribs and hips (or navel line if preferred).</li>
            <li>Measure hips at the widest point of the glutes.</li>
            <li>Use the same landmarks and tape tension each time.</li>
          </ul>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>Calculator vs Analyzer</h2>
          <p className={pClass}>
            This page is measurement-based. If you want a photo-based result with visual pattern analysis,
            use the{" "}
            <a className="text-primary underline" href="/body-shape-analyzer">
              Body Shape Analyzer
            </a>
            .
          </p>
          <p className={pClass}>
            For body-fat and waist-risk context, pair this result with the{" "}
            <a className="text-primary underline" href="/body-fat-calculator">
              Body Fat Calculator
            </a>
            ,{" "}
            <a className="text-primary underline" href="/waist-to-hip-ratio-calculator">
              Waist to Hip Ratio Calculator
            </a>
            , and{" "}
            <a className="text-primary underline" href="/waist-to-height-ratio-calculator">
              Waist to Height Ratio Calculator
            </a>
            .
          </p>
        </div>

        <div className={sectionWrap}>
          <h2 className={h2Class}>References</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg break-words">
            <li>
              NHANES Anthropometry Procedures Manual (measurement protocol):
              <a className="text-primary underline ml-1" href="https://wwwn.cdc.gov/nchs/data/nhanes/2017-2018/manuals/2017_Anthropometry_Procedures_Manual.pdf">
                CDC Anthropometry Manual
              </a>
            </li>
            <li>
              Body shape classification from image-based anthropometry:
              <a className="text-primary underline ml-1" href="https://pubmed.ncbi.nlm.nih.gov/36126362/">
                Li B, Mitchell K. PubMed record
              </a>
            </li>
            <li>
              Waist and hip ratio clinical context:
              <a className="text-primary underline ml-1" href="https://www.who.int/publications/i/item/9789241501491">
                WHO waist circumference and waist-hip ratio report
              </a>
            </li>
          </ul>
        </div>

        <div className="w-full max-w-3xl mx-auto mt-10 lg:mt-20 mb-10">
          <MoreTools
            heading="More Tools"
            columns={2}
            toolSlugs={[
              "body-shape-analyzer",
              "body-visualizer",
              "body-fat-calculator",
              "bri-calculator",
              "waist-to-hip-ratio-calculator",
              "waist-to-height-ratio-calculator",
              "bai-calculator",
              "estimate",
            ]}
            excludeSlug="body-shape-calculator"
          />
        </div>
      </section>
    </main>
  );
}
