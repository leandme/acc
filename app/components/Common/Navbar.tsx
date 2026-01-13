"use client";
import { trackEvent } from "@/app/libs/amplitude";

export default function Navbar() {

  return (
    <div className="navbar bg-base-100 px-2 sm:px-4 sticky top-0 z-50 border-b border-base-200">
      {/* Navbar Start */}
      <div className="navbar-start">
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
            className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-56"
          >
            <li>
              <a href="/estimate"
               className="hover:bg-transparent focus:bg-transparent active:bg-transparent">
              Estimate Body Fat
              </a>
            </li>
             <li>
             <a
            href="/examples"
            onClick={() =>
              trackEvent("Go to Examples", { location: "navbar cta" })
            }
            className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <span className="">Examples</span>
          </a>
          </li>
          <li>
            <a
            href="/pricing"
            onClick={() =>
              trackEvent("Go to Pricing", { location: "navbar cta" })
            }
            className="hover:bg-transparent focus:bg-transparent active:bg-transparent"
          >
            <span className="">Pricing</span>
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
            src="/favicon.ico"
            alt="Roast Generator Logo"
            className="w-6 h-6"
          />
          Body Fat Estimator
        </a>

        {/* Desktop Menu with Spacing */}
        <ul className="menu menu-horizontal gap-4 text-base px-1 hidden lg:flex ml-12">
          <li>
            <a href="/estimate"
             className="hover:bg-transparent hover:underline focus:bg-transparent active:bg-transparent">
              Estimate Body Fat
            </a>
          </li>
          <li>
             <a
            href="/examples"
            onClick={() =>
              trackEvent("Go to Examples", { location: "navbar cta" })
            }
            className="hover:bg-transparent hover:underline focus:bg-transparent active:bg-transparent"
          >
            <span className="">Examples</span>
          </a>
          </li>
          <li>
             <a
            href="/pricing"
            onClick={() =>
              trackEvent("Go to Pricing", { location: "navbar cta" })
            }
            className="hover:bg-transparent hover:underline focus:bg-transparent active:bg-transparent"
          >
            <span className="">Pricing</span>
          </a>
          </li>
        </ul>
        
      </div>
  

      {/* Navbar End */}
      {/* Optional: Uncomment this for a Login button */}
      {/**
      <div className="navbar-end pr-4 hidden lg:flex">
        <a className="btn text-lg ml-auto font-normal" href="/login">Login</a>
      </div>
      */}
    </div>
  );
}