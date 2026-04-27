export default function Comparison() {
  return (
    <section className="hero mt-40 flex items-center justify-center">
      <div className="w-full max-w-6xl px-6 lg:px-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-center">
          Track Body Fat Progress <i>Easily</i>
        </h2>

        <p className="mt-4 text-lg text-center text-gray-600 max-w-3xl mx-auto">
          Compare clinical body composition scans with photo-based AI body fat estimation
          designed for frequent, real-world tracking.
        </p>

        <div className="mt-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          {/* DEXA */}
          <div className="card bg-[#FFEAEC] w-full lg:w-1/3 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-center justify-center text-xl font-semibold">
                DEXA Scans
              </h3>

              <ul className="mt-4 space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  $100–$200 per scan
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  Requires booking an appointment and visiting a clinic
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  Not practical for frequent check-ins
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  Medical setting with specialized equipment
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  Small radiation exposure
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  Best suited for occasional baseline measurements
                </li>
              </ul>
            </div>
          </div>

          {/* AI Estimator */}
          <div className="card bg-[#DEFCED] w-full lg:w-1/3 shadow-xl border border-green-200">
            <div className="card-body">
              <h3 className="card-title text-center justify-center text-xl font-semibold">
                AI Calorie Counter
              </h3>

              <ul className="mt-4 space-y-4 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  Free to try, affordable upgrades available
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  Upload a photo and get an estimate in seconds
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  Designed for frequent progress tracking
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  Use from home — no appointments or travel
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  Private photo processing
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✅</span>
                  Ideal for weekly or monthly check-ins
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
