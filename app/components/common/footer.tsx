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
              Fat
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/body-visualizer">Body Visualizer</a></li>
              <li><a className="hover:text-white" href="/body-shape-analyzer">Body Shape Analyzer</a></li>
              <li><a className="hover:text-white" href="/army-body-fat-calculator">Army Body Fat Calculator</a></li>
               <li><a className="hover:text-white" href="/bai-calculator">BAI Calculator</a></li>
              <li><a className="hover:text-white" href="/tools/fat">All Fat Tools</a></li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Weight
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/bmi-calculator">BMI Calculator</a></li>
              <li><a className="hover:text-white" href="/weight-loss-calculator">Weight Loss Calculator</a></li>
              <li><a className="hover:text-white" href="/intermittent-fasting-calculator">Intermittent Fasting Calculator</a></li>
              <li><a className="hover:text-white" href="/ideal-weight-calculator">Ideal Weight Calculator</a></li>
               <li><a className="hover:text-white" href="/ponderal-index-calculator">Ponderal Index Calculator</a></li>
               <li><a className="hover:text-white" href="/tools/weight">All Weight Tools</a></li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Face
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/face-shape-detector">Face Shape Detector</a></li>
              <li><a className="hover:text-white" href="/skin-analyzer">Skin Analyzer</a></li>
              <li><a className="hover:text-white" href="/jawline-check">Jawline Check</a></li>
              <li><a className="hover:text-white" href="/age-guesser">Age Guesser</a></li>
              <li><a className="hover:text-white" href="/attractiveness-test">Attractiveness Test</a></li>
              <li><a className="hover:text-white" href="/face-symmetry-test">Face Symmetry Test</a></li>
              <li><a className="hover:text-white" href="/golden-face-ratio-analyzer">Golden Face Ratio Analyzer</a></li>
              <li><a className="hover:text-white" href="/tools/face">All Face Tools</a></li>
            </ul>
          </div>


          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Calories
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/calorie-calculator">Calorie Calculator</a></li>
              <li><a className="hover:text-white" href="/calorie-estimator">Calorie Estimator</a></li>
              <li><a className="hover:text-white" href="/steps-to-calories-calculator">Steps to Calories Calculator</a></li>
              <li><a className="hover:text-white" href="/calorie-deficit-calculator">Calorie Deficit Calculator</a></li>
              <li><a className="hover:text-white" href="/calories-burned-calculator">Calories Burned Calculator</a></li>
              <li><a className="hover:text-white" href="/tools/calories">All Calorie Tools</a></li>
            </ul>
          </div>

           <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Height
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/height-estimator">Height Estimator</a></li>
              <li><a className="hover:text-white" href="/mid-parental-height-calculator">Mid-Parental Height Calculator</a></li>
              <li><a className="hover:text-white" href="/tools/height">All Height Tools</a></li>
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
