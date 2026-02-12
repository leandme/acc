type CTAProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
  className?: string;
  image?: string;
};

export default function CTA({
  title = "Estimate your body fat %",
  description = "Upload a photo and get an estimate in seconds.",
  buttonText = "Try Body Fat Estimator →",
  href = "/",
  className = "",
  image= "",
}: CTAProps) {
  return (
    <div
      id="cta"
      className={`my-24 rounded-2xl border border-2 border-green-400 bg-green-50 ${className}`}
    >
      <div className="mx-auto max-w-3xl p-6 pt-12 pb-12 text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold">
          {title}
        </h2>

        {/* Image */}
        {image && (
          <div className="mt-8 flex justify-center">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="
                max-w-[200px]
                w-full
                shadow-sm
              "
            />
          </div>
        )}

        <p className="mt-6 text-lg text-gray-700 leading-relaxed">
          {description}
        </p>

        <div className="mt-12">
          <a
            href={href}
            className="btn btn-primary btn-lg text-white"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
}

{/* 
  
  <CTA
  title="Try AI body fat estimation"
  description="Upload a photo to get an instant, appearance-based estimate you can use to track progress over time."
  buttonText="Estimate from a photo →"
/>

  
  */}