import { Metadata } from "next";
import Examples from "../components/Examples";
import FAQ from "../components/FAQ";
import Comparison from "../components/Comparison";
import HeroWithUpload from "../components/HeroWithUpload";
import ToolExplainer from "../components/ToolExplainer";
import SecondaryUploadCTA from "@/app/components/SecondaryUploadCTA";

const title = "Body Fat Estimator – What Body Fat % Are You?";
const description = "Upload a photo and let our AI calculate your body fat percentage. Get a quick and accurate body fat percentage estimation to track your progress.";

export const metadata: Metadata = {
  title: title,
  description: description,
};

export default function Home() {
  return (
   <>
      <HeroWithUpload />
       {/* <Examples />*/}
      <ToolExplainer />
      <Comparison />
      <FAQ />
      <SecondaryUploadCTA />
   </>
  );
}
