import { Metadata } from "next";
import Pricing from "@/app/components/Pricing";
import PricingFAQ from "@/app/components/PricingFAQ";

const title = "Body Fa Estimator Pricing";
const description = "Body Fat Estimator pricing and plans. Estimate your body fat percentage from a photo and unlock advanced features.";

export const metadata: Metadata = {
  title: title,
  description: description,
};

export default function PricingPage() {
  return (
   <>
   <div className="hero min-h-screen flex items-center justify-center">
   <div className="flex flex-col items-center mt-10 gap-6">
   <h1 className="text-2xl lg:text-3xl max-w-3xl font-bold text-center">Want an Accurate Body Fat Estimate?</h1>
    <p className="py-2 text-lg max-w-3xl text-center">One photo gives a rough estimate. Add more photos and body stats to narrow the estimate range.</p>
      <Pricing />
      <PricingFAQ />
      <div className="max-w-2xl text-center mb-20"> {/* Changed from max-w-md to max-w-lg */}
            <h2 className="text-2xl lg:text-4xl font-bold">Get Your Estimate</h2>
            <p className="py-6 text-lg">
            Used by thousands for regular check-ins and long-term progress tracking
            </p>
            <a href="/pricing/#pricing">
              <button className="btn btn-primary btn-lg text-white">Get a More Accurate Estimate →</button>
            </a>
          </div>
    </div>
    </div>
   </>
  );
  
}
