import { siteConfig } from "@/site-config";

export default function Author() {
  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center border gap-6 rounded-2xl p-6 bg-white">
      <img
        src={siteConfig.founder.image}
        alt={siteConfig.founder.name}
        className="w-24 h-24 rounded-full object-cover"
      />

      <div className="text-center sm:text-left">
        <div className="flex items-baseline justify-center sm:justify-start gap-3">
          <p className="text-lg font-bold">{siteConfig.founder.name}</p>

          {/* Social links */}
          <div className="flex items-center gap-2">
            <a
              href={siteConfig.founder.social.linkedin}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[#0A66C2] hover:opacity-80 transition"
            >
              {/* LinkedIn icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 relative top-[1px]"
              >
                <path d="M4.98 3.5c0 1.38-1.11 2.5-2.48 2.5S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.9h4.56V24H.22V8.9zM8.9 8.9h4.37v2.06h.06c.61-1.15 2.1-2.37 4.33-2.37 4.63 0 5.48 3.05 5.48 7.01V24h-4.56v-6.93c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.79-2.65 3.64V24H8.9V8.9z" />
              </svg>
            </a>

            <a
              href={siteConfig.founder.social.youtube}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label="YouTube"
              className="text-[#FF0000] hover:opacity-80 transition"
            >
              {/* YouTube icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 relative top-[4px]"
              >
                <path d="M23.5 6.2s-.23-1.64-.94-2.36c-.9-.94-1.9-.95-2.36-1C16.9 2.5 12 2.5 12 2.5h-.01s-4.9 0-8.19.34c-.46.05-1.46.06-2.36 1-.71.72-.94 2.36-.94 2.36S0 8.14 0 10.1v1.8c0 1.96.5 3.9.5 3.9s.23 1.64.94 2.36c.9.94 2.08.91 2.6 1.01 1.89.18 7.96.34 7.96.34s4.9-.01 8.19-.35c.46-.05 1.46-.06 2.36-1 .71-.72.94-2.36.94-2.36s.5-1.94.5-3.9v-1.8c0-1.96-.5-3.9-.5-3.9zM9.75 14.65V7.55l6.25 3.55-6.25 3.55z" />
              </svg>
            </a>
          </div>
        </div>

        <p className="text-gray-500 mt-1">
          {siteConfig.founder.bio}
        </p>
      </div>
    </div>
  );
}
