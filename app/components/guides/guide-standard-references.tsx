import References from "@/app/components/guides/guide-references";

const standardGuideReferences = [
  {
    label: "CDC - About Adult BMI",
    href: "https://www.cdc.gov/bmi/about/index.html",
  },
  {
    label: "CDC - Adult BMI Categories",
    href: "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html",
  },
  {
    label: "NIDDK - Adult Overweight and Obesity",
    href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity",
  },
  {
    label: "WHO - Obesity and Overweight",
    href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
  },
  {
    label: "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
    href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
  },
] as const;

export default function GuideStandardReferences() {
  return <References references={[...standardGuideReferences]} />;
}
