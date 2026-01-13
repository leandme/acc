import { Metadata } from "next";
import Examples from "../components/HomePage/Examples";
import FAQ from "../components/FAQ";
import Comparison from "../components/HomePage/Comparison";
import HeroWithUpload from "../components/HomePage/HeroWithUpload";
import ToolExplainer from "../components/HomePage/ToolExplainer";
import SecondaryUploadCTA from "../components/HomePage/SecondaryUploadCTA";

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
       <Examples />
      <Comparison />
      <ToolExplainer />
      <FAQ />
      <SecondaryUploadCTA />
   </>
  );
}
