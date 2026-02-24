import type { Metadata } from "next";
import FaceSymmetryPageClient from "@/app/components/tools/face/face-symmetry-test/face-symmetry-page.client";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Face Symmetry Test – AI Face Symmetry Checker",
  description:
    "Upload a face photo to run an AI face symmetry test, generate mirrored facial halves, and get a symmetry score with interpretation bands.",
  canonical: "https://bodyfatestimator.ai/face-symmetry-test",
});

export default function FaceSymmetryTestPage() {
  return <FaceSymmetryPageClient />;
}
