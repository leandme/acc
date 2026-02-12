"use client";

import { useSearchParams, usePathname } from "next/navigation";
import Navbar from "./navbar";
import ResultHeader from "./result-header";
import { useMediaQuery } from "@/app/hooks/use-media-query";

export default function Chrome({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 767px)"); // Tailwind md breakpoint

  const isEstimateResults =
    pathname.startsWith("/estimate") && !!searchParams.get("imageUrl");

  const useResultsHeader = isMobile && isEstimateResults;

  return (
    <>
      {useResultsHeader ? <ResultHeader /> : <Navbar />}
      {children}
    </>
  );
}
