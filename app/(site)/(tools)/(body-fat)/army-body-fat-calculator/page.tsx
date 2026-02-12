import { Metadata } from "next";
import ArmyBodyFatCalculatorPageClient from "@/app/components/tools/composition/army-body-fat-calculator/army-body-fat-page.client";

export const metadata: Metadata = {
  title: "Army Body Fat Calculator | U.S. Army One-Site Method",
  description:
    "Calculate estimated body fat with the U.S. Army one-site method using abdomen circumference and body weight, with Army age/sex standard checks and guidance.",
};

export default function ArmyBodyFatCalculatorPage() {
  return <ArmyBodyFatCalculatorPageClient />;
}
