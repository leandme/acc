export default function CTA() {

  return (
    <>
    <div id="cta" className="hero mt-40 mb-40 flex items-center justify-center">
        <div className="hero-content text-center">
          <div className="max-w-2xl"> {/* Changed from max-w-md to max-w-lg */}
            <h2 className="text-2xl lg:text-4xl font-bold">Calculate Your Body Fat % with AI</h2>
            <p className="py-6 text-lg">
            Don't wait - find put your body fat percentage <i>now</i>
            </p>
            <a href="/estimate">
              <button className="btn btn-primary btn-lg text-white">Get My Body Fat % <span className="text-lg">→</span></button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}