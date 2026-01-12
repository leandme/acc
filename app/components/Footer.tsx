export default function Footer() {
  return (
    <footer className="bg-[#18181b] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Brand block */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <img
              src="/favicon.ico"
              alt="Body Fat Estimator Logo"
              className="w-7 h-7"
            />
            <span className="text-lg font-semibold">
              Body Fat Estimator
            </span>
          </div>

          <p className="mt-3 text-base text-gray-300 leading-relaxed">
            Estimate your body fat percentage from a photo with AI.
          </p>

          {/* Social proof */}
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-300">
            <div className="flex -space-x-2">
              <img
                className="w-7 h-7 rounded-full ring-2 ring-[#18181b] object-cover"
                src="/examples/bfe-example3.png"
                alt="User avatar"
              />
              <img
                className="w-7 h-7 rounded-full ring-2 ring-[#18181b] object-cover"
                src="/examples/bfe-example2.png"
                alt="User avatar"
              />
              <img
                className="w-7 h-7 rounded-full ring-2 ring-[#18181b] object-cover"
                src="/examples/bfe-example4.png"
                alt="User avatar"
              />
            </div>

            <span>
              Trusted by{" "}
              <span className="font-semibold text-white">12,500+</span>{" "}
              users
            </span>
          </div>
        </div>

        <div className="my-8 h-px bg-white/10" />

        {/* Links section */}
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Links
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/about">About</a></li>
                  <li><a className="hover:text-white" href="/upload">Estimate</a></li>
              <li><a className="hover:text-white" href="/pricing">Pricing</a></li>
              <li><a className="hover:text-white" href="/examples">Examples</a></li>
              <li><a className="hover:text-white" href="/blog">Blog</a></li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Support
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/#faqs">FAQs</a></li>
              <li><a className="hover:text-white" href="/contact">Contact us</a></li>
              <li><a className="hover:text-white" href="/refund">Refunds</a></li>
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Tools
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
             
            </ul>
          </div>

          <div>
            <h6 className="text-lg font-semibold text-gray-200">
              Legal
            </h6>
            <ul className="mt-3 space-y-2 text-base text-gray-300">
              <li><a className="hover:text-white" href="/terms">Terms & Conditions</a></li>
              <li><a className="hover:text-white" href="/privacy">Privacy Policy</a></li>
              <li><a className="hover:text-white" href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Bottom row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-gray-400">
            © 2026 — All Rights Reserved.
          </span>

          <span className="text-[11px] text-gray-500 max-w-2xl leading-relaxed">
            This site provides a visual AI-based body fat estimate from photos.
            Results may vary based on lighting, pose, and image quality.
          </span>
        </div>
      </div>
    </footer>
  );
}
