"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import EstimateDropZone from "../tools/composition/body-fat-estimator/estimate-drop-zone";
import TryExamples from "../common/try-examples";
import { EzoicAdSlot } from "../helpers/ezoic-ad-slot";
// import ReviewBox from "./ReviewBox";

type HeroProps = {
  basePath?: "/" | "/estimate";
};

export default function Hero({ basePath }: HeroProps) {
  const pathname = usePathname();
  const resolvedBasePath = basePath ?? (pathname === "/" ? "/" : "/estimate");

  return (
    <div className="hero min-h-screen lg:-mt-28 flex items-start lg:items-center justify-center pt-0 lg:pt-0">
      <div className="hero-content w-full max-w-6xl px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-6 lg:gap-16">

        {/* Left side: image + copy */}
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          {/* Hero image (like remove.bg) */}
          {/* Hero image */}
            <div className="flex justify-center mb-6 lg:mb-8">
              <div className="relative w-full max-w-[360px] aspect-[3/2] mx-auto">
                <Image
                  src="/hero/body-fat-estimator-header.webp"
                  alt="Body fat estimator preview"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 640px) 320px, 360px"
                />
              </div>
            </div>


          <h1 className="text-4xl lg:text-5xl font-bold">
            Estimate Your Body Fat % from a Photo
          </h1>

          <p className="py-6 text-lg mt-2">
            Upload a photo and get a body fat AI estimate in seconds. Fast, accurate, and{" "}
            <span className="inline-block bg-primary text-white px-2 py-0.5 rounded-md text-base font-semibold">
              free
            </span>
          </p>

          {/*
          <div className="mt-4">
            <ReviewBox />
          </div>
          */}
        </div>

        {/* Right side: upload zone */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-xl">
            <EstimateDropZone basePath={resolvedBasePath} />
            <div className="mt-6">
              <TryExamples basePath={resolvedBasePath} />
            </div>
            <EzoicAdSlot id={113} className="mt-8" />
          </div>
        </div>

      </div>
    </div>
  );
}
