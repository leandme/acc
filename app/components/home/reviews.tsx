'use client';
import { trackEvent } from "@/app/libs/amplitude";


export default function Reviews() {

  return (
    <div className="hero flex items-center mb-10 mt-40 justify-center">
      <div className="flex flex-col items-center text-center">

        <h2 className="text-3xl lg:text-4xl font-semibold mb-4">
            They Love Us. You Will Too.
            </h2>
        <div className="flex flex-col items-center gap-8 p-6 lg:flex-row lg:justify-center">
          
{/* Card 1 */}
<div className="card bg-base-100 w-full max-w-3xl shadow-xl">
  <div className="card-body">
    <h2 className="text-lg lg:text-xl font-extrabold text-left">
      Athletes
    </h2>

    <p className="text-lg text-base mt-10 text-left">
      “At my level, every small change show up in how I feel on the wall. I need something consistent that tracks my fat levels and not just my weight.”
    </p>

    {/* Footer / profile */}
    <div className="mt-10 flex items-center gap-3">
      {/* Avatar */}
      <img
        src="/profile/athlete-who-uses-body-fat-estimator.webp" 
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Name + title */}
      <div className="leading-tight text-left">
        <p className="text-md font-semibold text-gray-900">
          Wally Harrow
        </p>
        <p className="text-sm text-gray-500">
          Competitive Rock Climber
        </p>
      </div>
    </div>
  </div>
</div>

{/* Card 2 */}
<div className="card bg-base-100 w-full max-w-3xl shadow-xl">
  <div className="card-body">
    <h2 className="text-lg lg:text-xl font-extrabold text-left">
      Fitness-Focused
    </h2>

    <p className="text-lg text-base mt-10 text-left">
      “The scale barely moves for me, but my body definitely does. This helped me understand whether what I’m doing is actually changing how I look, not just my weight.”
    </p>

    {/* Footer / profile */}
    <div className="mt-10 flex items-center gap-3">
      {/* Avatar */}
      <img
        src="/profile/gym-bro.webp" 
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Name + title */}
      <div className="leading-tight text-left">
        <p className="text-md font-semibold text-gray-900 justify-left">
          Kyle Malm
        </p>
        <p className="text-sm text-gray-500">
          5x/week gym goer
        </p>
      </div>
    </div>
  </div>
</div>

{/* Card 3 */}
<div className="card bg-base-100 w-full max-w-3xl shadow-xl">
  <div className="card-body">
    <h2 className="text-lg lg:text-xl font-extrabold text-left">
      Everyday
    </h2>

    <p className="text-lg text-base mt-10 text-left">
      “I didn’t even know what my body fat percentage meant before. This gave me a rough idea without having to go to a gym or use a bunch of formulas.”
    </p>

    {/* Footer / profile */}
    <div className="mt-10 flex items-center gap-3">
      {/* Avatar */}
      <img
        src="/profile/everyday-uses-body-fat-estimator.webp" 
        alt="Profile"
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Name + title */}
      <div className="leading-tight text-left">
        <p className="text-md font-semibold text-gray-900">
          Melissa Reinhardt
        </p>
        <p className="text-sm text-gray-500">
          Desk job, trying to stay healthy
        </p>
      </div>
    </div>
  </div>
</div>


        </div>
      </div>
    </div>
  );
}
