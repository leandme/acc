"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  getBodyShapeCard,
  getBodyShapeCards,
  type BodyShapeGender,
  type BodyShapeKey,
} from "@/app/libs/body-shape";

type Props = {
  bodyShape: BodyShapeKey | null;
  gender: BodyShapeGender;
  className?: string;
};

export default function EstimateBodyShape({
  bodyShape,
  gender,
  className = "",
}: Props) {
  const [showOtherShapes, setShowOtherShapes] = useState(false);

  const activeShape = useMemo(
    () => getBodyShapeCard(gender, bodyShape),
    [gender, bodyShape]
  );

  const otherShapes = useMemo(() => {
    if (!activeShape) return [];
    return getBodyShapeCards(gender).filter((shape) => shape.key !== activeShape.key);
  }, [gender, activeShape]);

  useEffect(() => {
    setShowOtherShapes(false);
  }, [gender, activeShape?.key]);

  if (!activeShape) return null;

  return (
    <section className={`w-full max-w-5xl ${className}`}>
      <div className="p-5">
        <h2 className="text-3xl lg:text-4xl font-semibold text-center flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
          <span>Your Body Shape</span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-base font-semibold tracking-wide text-gray-700">
            {activeShape.title.toUpperCase()}
          </span>
        </h2>

        <div className="mt-8">
          <article className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-2 ring-gray-900 border-gray-900/40">
            <div className="bg-base-100 aspect-[4/3]">
              <img
                src={activeShape.imageSrc}
                alt={`${gender} ${activeShape.title} body shape`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="px-6 pt-4 pb-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <h4 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                  {activeShape.title}
                </h4>
                <span className="inline-flex rounded-full border border-gray-900/20 bg-gray-900/10 px-3 py-1 text-sm font-semibold text-gray-900">
                  YOUR RESULT
                </span>
              </div>
              <p className="mt-3 text-lg text-gray-700 leading-relaxed text-center">
                {activeShape.description}
              </p>

              {!showOtherShapes && otherShapes.length > 0 ? (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    className="text-lg font-semibold text-primary underline underline-offset-2"
                    onClick={() => setShowOtherShapes(true)}
                  >
                    See other body shapes
                  </button>
                </div>
              ) : null}
            </div>
          </article>
        </div>

        {showOtherShapes && otherShapes.length > 0 ? (
          <div className="mt-10">
            <h3 className="text-2xl lg:text-3xl font-semibold text-center">
              Other Body Shapes
            </h3>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {otherShapes.map((shape) => (
                <article
                  key={shape.key}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="bg-base-100 aspect-[4/3]">
                    <img
                      src={shape.imageSrc}
                      alt={`${gender} ${shape.title} body shape`}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="px-6 pt-4 pb-6">
                    <h4 className="text-xl lg:text-2xl font-semibold text-gray-900">
                      {shape.title}
                    </h4>
                    <p className="mt-3 text-lg text-gray-700 leading-relaxed">
                      {shape.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
