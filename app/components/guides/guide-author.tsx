import Link from "next/link";
import { siteConfig } from "@/site-config";

export default function GuideAuthor() {
  const { founder } = siteConfig;

  return (
    <div className="mt-8 flex flex-col text-gray-600">
      <span className="text-xs tracking-wide text-gray-400">
        Written by:
      </span>

      <div className="mt-1 flex items-center gap-4">
        <Link href="/about#founder" className="inline-flex items-center gap-4">
          <img
            src={founder.image}
            alt={founder.name}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900 leading-tight hover:underline">
              {founder.name}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              Founder
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
