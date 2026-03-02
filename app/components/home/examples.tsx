import { siteConfig } from "@/site-config";

export default function Examples() {
  const images = [
    "/examples/boy-selfie.webp",
    "/examples/man-bf.webp",
    "/examples/boy-bf.webp",
    "/examples/woman-selfie.webp",
    "/examples/bfe-example1.webp",
    "/examples/man-selfie.webp",
    "/examples/bfe-example3.webp",
    "/examples/bfe-example4.webp",
  ];

  return (
    <section id="examples" className="mt-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">
            <span
              className="rounded px-2 py-2 underline decoration-blue-500 decoration-4 underline-offset-4">
              {siteConfig.estimate.totalCount}
            </span>
            Body Fat Estimates!
          </h2>

          <p className="text-xs lg:text-sm text-gray-600 px-4 py-2 rounded-full">
            🔒 Your photos are private and used only to generate your estimate
          </p>
        </div>

        {/* Image grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl bg-base-200 shadow"
            >
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                  EXAMPLE
                </span>
              </div>

              {/* Image */}
              <div className="aspect-[3/4]">
                <img
                  src={src}
                  alt="AI body fat estimate example"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <a href="/estimate">
      <p className="text-lg lg:text-xl text-gray-700 px-4 py-2 mt-10 rounded-full text-center transition transition-transform
    duration-200
    hover:scale-105">
            See Success Stories →
          </p>
      </a>
    </section>
  );
}
