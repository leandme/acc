import { siteConfig } from "@/site-config";

export default function Footer() {
  return (
    <footer className="bg-[#18181b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Brand block */}
        
        <div className="max-w-2xl">
    <a href="/">      
          <div className="flex items-center gap-2">
            <img
              src={siteConfig.site.logo}
              alt="Body Fat Estimator Logo"
              className="w-8 h-8"
            />
            <span className="text-lg font-semibold">
              {siteConfig.site.name}
            </span>
          </div>
 </a>
          <p className="mt-3 text-base text-gray-300 leading-relaxed">
            {siteConfig.site.tagline}
          </p>

        </div>
       

        <div className="my-8 h-px bg-white/10" />
<div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Site
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/about">About</a></li>
              <li><a className="hover:text-white" href="/estimate">Body Fat Estimate</a></li>
              <li><a className="hover:text-white" href="/examples">See Examples</a></li>
              <li><a className="hover:text-white" href="/guides">Guides</a></li>
              <li><a className="hover:text-white" href="/tools">Tools</a></li>
              <li><a className="hover:text-white" href="/contact">Contact</a></li>
            </ul>
          </div>
          

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Body Fat
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/body-visualizer">Body Visualizer</a></li>
              <li><a className="hover:text-white" href="/bai-calculator">BAI Calculator</a></li>
              <li><a className="hover:text-white" href="/body-fat-calculator">Body Fat Calculator</a></li>
              <li><a className="hover:text-white" href="/skinfold-body-fat-calculator">Skinfold Body Fat Calculator</a></li>
              <li><a className="hover:text-white" href="/army-body-fat-calculator">Army Body Fat Calculator</a></li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Body Composition
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/ffmi-calculator">FFMI Calculator</a></li>
              <li><a className="hover:text-white" href="/lean-body-mass-calculator">Lean Body Mass Calculator</a></li>
              <li><a className="hover:text-white" href="/muscle-mass-calculator">Muscle Mass Calculator</a></li>
              <li><a className="hover:text-white" href="/body-frame-size-calculator">Body Frame Size Calculator</a></li>
              <li><a className="hover:text-white" href="/waist-to-hip-ratio-calculator">Waist to Hip Ratio Calculator</a></li>
              <li><a className="hover:text-white" href="/waist-to-height-ratio-calculator">Waist to Height Ratio Calculator</a></li>
              <li><a className="hover:text-white" href="/rfm-calculator">RFM Calculator</a></li>
              <li><a className="hover:text-white" href="/bri-calculator">BRI Calculator</a></li>
              <li><a className="hover:text-white" href="/visceral-fat-calculator">Visceral Fat Calculator</a></li>
              <li><a className="hover:text-white" href="/body-shape-analyzer">Body Shape Analyzer</a></li>
              <li><a className="hover:text-white" href="/body-shape-calculator">Body Shape Calculator</a></li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Body Weight
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/bmi-calculator">BMI Calculator</a></li>
              <li><a className="hover:text-white" href="/weight-loss-calculator">Weight Loss Calculator</a></li>
              <li><a className="hover:text-white" href="/intermittent-fasting-calculator">Intermittent Fasting Calculator</a></li>
              <li><a className="hover:text-white" href="/weight-loss-percentage-calculator">Weight Loss Percentage Calculator</a></li>
              <li><a className="hover:text-white" href="/ideal-weight-calculator">Ideal Weight Calculator</a></li>
              <li><a className="hover:text-white" href="/overweight-calculator">Overweight Calculator</a></li>
              <li><a className="hover:text-white" href="/adjusted-body-weight-calculator">Adjusted Body Weight Calculator</a></li>
              <li><a className="hover:text-white" href="/ponderal-index-calculator">Ponderal Index Calculator</a></li>
              <li><a className="hover:text-white" href="/broca-index-calculator">Broca Index Calculator</a></li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Metabolism
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/calorie-estimator">Calorie Estimator</a></li>
              <li><a className="hover:text-white" href="/tdee-calculator">TDEE Calculator</a></li>
              <li><a className="hover:text-white" href="/bmr-calculator">BMR Calculator</a></li>
              <li><a className="hover:text-white" href="/calorie-deficit-calculator">Calorie Deficit Calculator</a></li>
              <li><a className="hover:text-white" href="/macro-calculator">Macro Calculator</a></li>
              <li><a className="hover:text-white" href="/steps-to-calories-calculator">Steps to Calories Calculator</a></li>
              <li><a className="hover:text-white" href="/calories-burned-calculator">Calories Burned Calculator</a></li>
            </ul>
          </div>

          {/*
          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Tools
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/estimate">Body Fat Estimator</a></li>
              <li><a className="hover:text-white" href="/body-fat-map">Body Fat Map</a></li>
              <li><a className="hover:text-white" href="/body-fat-map">Body Fat Map</a></li>
              <li><a className="hover:text-white" href="/rfm-calculator">RFM Calculator</a></li>
              <li><a className="hover:text-white" href="/bri-calculator">BRI Calculator</a></li>
              <li><a className="hover:text-white" href="/bai-calculator">BAI Calculator</a></li>
              <li><a className="hover:text-white" href="/muscle-mass-calculator">Muscle Mass Calculator</a></li>
              <li><a className="hover:text-white" href="/ponderal-index-calculator">Ponderal Index Calculator</a></li>
              <li><a className="hover:text-white" href="/lean-body-mass-calculator">Lean Body Mass Calculator</a></li>
              <li><a className="hover:text-white" href="/body-recomposition-calculator">Body Recomposition Calculator</a></li>
              <li><a className="hover:text-white" href="/body-shape-analyzer">Body Shape Analyzer</a></li>
              <li><a className="hover:text-white" href="/visceral-fat-calculator">Visceral Fat Calculator</a></li>
            </ul>
          </div>
          */}

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Guides
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              
              <li><a className="hover:text-white" href="/guides/bmi-vs-body-fat">BMI vs Body Fat</a></li>
              <li><a className="hover:text-white" href="/guides/estimate-body-fat-percentage-from-photo">Estimate Body Fat from a Photo</a></li>
              <li><a className="hover:text-white" href="/guides/best-way-to-measure-body-fat-at-home">Measure Body Fat at Home</a></li>
              <li><a className="hover:text-white" href="/guides/best-body-fat-estimator">Best Body Fat Estimator</a></li>
              <li><a className="hover:text-white" href="/guides/why-body-fat-looks-different">Why Body Fat Looks Different</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Bottom row  */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-gray-400">
             © {new Date().getFullYear()} — All Rights Reserved.
          </span>

          <span className="text-xs text-gray-400 max-w-2xl leading-relaxed">
            <a href="/terms" className="hover:underline">Terms</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/privacy" className="hover:underline">Privacy</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/cookies" className="hover:underline">Cookie</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/security" className="hover:underline">Security</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a href="/subprocessors" className="hover:underline">Subprocessors</a>&nbsp;&nbsp;|&nbsp;&nbsp;
            <a className="hover:text-white" href="/sitemap-html">Sitemap</a>
          </span>
          
        </div>
      </div>
    </footer>
  );
}
