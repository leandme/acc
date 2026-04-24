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
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Site
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/about">About</a></li>
              <li><a className="hover:text-white" href="/blog">Blog</a></li>
              <li><a className="hover:text-white" href="/contact">Contact</a></li>
              <li><a className="hover:text-white" href="/sitemap-html">Sitemap</a></li>
            </ul>
          </div>
          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Tools
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/estimate">Body Fat Estimator</a></li>
              <li><a className="hover:text-white" href="/body-fat-calculator">Navy Body Fat Calculator</a></li>
              <li><a className="hover:text-white" href="/body-visualizer">Body Visualizer</a></li>
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
            <a href="/sitemap-html" className="hover:underline">Sitemap</a>
          </span>
          
        </div>
      </div>
    </footer>
  );
}
