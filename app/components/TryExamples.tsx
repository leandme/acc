"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { trackEvent } from "../libs/amplitude";

type Example = {
  id: string;
  label: string;
  sublabel?: string;
  src: string;
};

const EXAMPLES: Example[] = [
  { id: "m2", label: "Example B", sublabel: "", src: "/examples/bfe-example2.png" },
  { id: "m3", label: "Example C", sublabel: "", src: "/examples/bfe-example3.png" },
  { id: "m4", label: "Example D", sublabel: "", src: "/examples/bfe-example1.png" },
  { id: "m1", label: "Example A", sublabel: "", src: "/examples/bfe-example4.png" },
];

export default function TryExamples() {
  const router = useRouter();

const onPick = (src: string) => {
  const fullUrl = src.startsWith("/")
    ? `${window.location.origin}${src}`
    : src;

  router.push(`/estimate?imageUrl=${encodeURIComponent(fullUrl)}`);
};


  return (
    <div className="w-full mt-10">
      {/* Header row: text left, thumbnails right */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
       <div className="leading-tight font-bold text-base-content/70">
            <span className="inline sm:block">No photo?</span>{" "}
            <span className="inline sm:block">Try one of these:</span>
        </div>


        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                trackEvent("Try Example", { location: "uploadzone" });
                onPick(ex.src);
              }}
              className="group relative rounded-2xl p-[2px] bg-transparent"
              aria-label={`Try ${ex.label}`}
            >
              <div className="rounded-2xl bg-base-100 shadow-sm group-hover:shadow-md transition overflow-hidden">
                <div className="relative h-12 w-12 md:h-14 md:w-14 overflow-hidden">
                  <Image
                    src={ex.src}
                    alt={ex.label}
                    fill
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    sizes="64px"
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-base-content/60 leading-relaxed">
        By uploading a photo, you agree to our{" "}
        <a className="link" href="/terms">Terms of Service</a>. To learn more about how
        bodyfatestimator.ai handles your personal data, check our{" "}
        <a className="link" href="/privacy">Privacy Policy</a>.
      </p>
    </div>
  );
}
