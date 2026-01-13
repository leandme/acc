export default function Examples() {
  const images = [
    "/examples/boy-selfie.png",
    "/examples/man-bf.png",
    "/examples/boy-bf.png",
    "/examples/woman-selfie.png",
    "/examples/bfe-example1.png",
    "/examples/man-selfie.png",
    "/examples/bfe-example3.png",
    "/examples/bfe-example4.png",
  ];

  return (
    <section id="examples" className="mt-40">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold">
            <span className="text-primary">17,490</span> Body Fat Estimates!
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
    </section>
  );
}
