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
                alt="AI Calorie Counter Logo"
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
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Site
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/about">About</a></li>
              <li><a className="hover:text-white" href="/how-it-works">How It Works</a></li>
              <li><a className="hover:text-white" href="/blog">Blog</a></li>
              <li><a className="hover:text-white" href="/contact">Contact</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              More Tools
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li>
                <a
                  className="hover:text-white"
                  href="https://bodyfatestimator.ai/height-estimator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Height Estimator
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://bodyfatestimator.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Body Fat Estimator
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://bodyvisualizer.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Body Visualizer
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://bodyfatestimator.ai/jawline-check"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Jawline Check
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://skoy.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Skoy
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://canthaltilttest.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Canthal Tilt Test
                </a>
              </li>
              <li>
                <a
                  className="hover:text-white"
                  href="https://bodyfatestimator.ai/body-shape-analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Body Shape Analyzer
                </a>
              </li>
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
            <a href="/subprocessors" className="hover:underline">Subprocessors</a>
          </span>

        </div>
      </div>
    </footer>
  );
}
