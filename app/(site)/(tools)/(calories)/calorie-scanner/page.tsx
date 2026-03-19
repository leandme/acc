import type { Metadata } from "next";
import CalorieScannerPageClient from "@/app/components/tools/calories/calorie-scanner/calorie-scanner-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Calorie Scanner – Online Calorie Counter from a Photo",
  description:
    "AI food scanner and calorie counter from a photo. Get fast calorie and macros estimates for any meal.",
  canonical: "https://bodyfatestimator.ai/calorie-scanner",
});

export default function CalorieScannerPage() {
  return <CalorieScannerPageClient />;
}
