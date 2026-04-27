"use client";
import { trackEvent } from "@/app/libs/amplitude";
import { siteConfig } from "@/site-config";

export default function ResultHeader() {

  return (
    <div className="navbar bg-base-100 justify-center">
     
        {/* Logo + Name Branding */}
        <a
          className="btn btn-ghost font-heading text-xl flex items-center gap-2 hover:bg-transparent focus:bg-transparent active:bg-transparent"
          href="/"
        >
          <img
            src= {siteConfig.site.logo}
            alt="AI Calorie Counter Logo"
            className="w-6 h-6"
          />
            {siteConfig.site.name}
        </a>

      </div>
    
  );
}