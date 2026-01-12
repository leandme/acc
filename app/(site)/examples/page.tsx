import { Metadata } from "next";;

export const metadata: Metadata = {
  title: "Examples | Body Fat Estimator AI",
  description:
    "",
};

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

export default function ExamplesPage() {
  return (
   <>
   <div className="hero min-h-screen flex items-center justify-center">
   <div className="flex flex-col items-center mt-10 gap-6">
   <h1 className="text-2xl lg:text-4xl max-w-3xl font-bold text-center">Body Fat Percentage Examples</h1>
    <p className="py-2 text-lg max-w-3xl text-center">Real examples of AI body fat estimates created from photos, showing how different body fat percentages look across body types.</p>
      <a href="/estimate">
              <button className="btn btn-primary btn-lg text-white">Get Your Free Estimate →</button>
            </a>

            {/* Image grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 mb-20">
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
    </div>
   </>
  );
  
}
