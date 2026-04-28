"use client";
import { siteConfig } from "@/site-config";

export default function Navbar() {

  return (
    <div className="navbar bg-base-100 px-2 sm:px-4 lg:sticky top-0 z-50 border-b border-base-200">
      <div className="navbar-start min-w-0">
        {/* Hamburger menu for mobile */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-56 z-[999]"
          >
            <li>
              <a
                href="/how-it-works"
                className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
              >
                How It Works
              </a>
            </li>
          </ul>
        </div>

        {/* Logo */}
        <a
          className="btn btn-ghost font-heading text-xl flex items-center gap-2 hover:bg-transparent focus:bg-transparent active:bg-transparent"
          href="/"
        >
          <img
            src={siteConfig.site.logo}
            alt="AI Calorie Counter Logo"
            className="w-6 h-6"
          />
          <span className="truncate">{siteConfig.site.name}</span>
        </a>

        <div className="hidden lg:flex ml-4 xl:ml-8">
          <ul className="menu menu-horizontal px-1 gap-2 xl:gap-4 text-base whitespace-nowrap flex-nowrap">
            <li>
              <a
                href="/how-it-works"
                className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
              >
                How It Works
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
