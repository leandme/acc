import References from "@/app/components/guides/guide-references";
import { EzoicAdSlot } from "@/app/components/helpers/ezoic-ad-slot";

type GuideReference = {
  label: string;
  href: string;
};

const baseGuideReferences: GuideReference[] = [
  {
    label: "NIDDK - Adult Overweight and Obesity",
    href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity",
  },
  {
    label: "WHO - Obesity and Overweight",
    href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight",
  },
];

const slugSpecificReferences: Record<string, GuideReference[]> = {
  "bmi-vs-body-fat": [
    {
      label: "CDC - About Adult BMI",
      href: "https://www.cdc.gov/bmi/about/index.html",
    },
    {
      label: "CDC - Adult BMI Categories",
      href: "https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html",
    },
  ],
  "best-way-to-measure-body-fat-at-home": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "NCBI Bookshelf - Evaluation of Overweight and Obesity in Adults",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK278991/",
    },
  ],
  "body-fat-estimation-methods": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "NCBI Bookshelf - Evaluation of Overweight and Obesity in Adults",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK278991/",
    },
  ],
  "why-body-fat-calculators-are-inaccurate": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "CDC - About Adult BMI",
      href: "https://www.cdc.gov/bmi/about/index.html",
    },
  ],
  "why-body-fat-estimators-give-different-results": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "NCBI Bookshelf - Evaluation of Overweight and Obesity in Adults",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK278991/",
    },
  ],
  "why-body-fat-measurements-give-different-results": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "NCBI Bookshelf - Evaluation of Overweight and Obesity in Adults",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK278991/",
    },
  ],
  "how-accurate-are-smart-scales": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "MedlinePlus - Obesity",
      href: "https://medlineplus.gov/obesity.html",
    },
  ],
  "how-often-should-you-measure-body-fat": [
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
    {
      label: "NIDDK - Adult Overweight and Obesity",
      href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity",
    },
  ],
  "how-to-track-body-fat-changes": [
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
    {
      label: "NIDDK - Adult Overweight and Obesity",
      href: "https://www.niddk.nih.gov/health-information/weight-management/adult-overweight-obesity",
    },
  ],
  "how-much-does-it-cost-to-measure-body-fat": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "NCBI Bookshelf - Evaluation of Overweight and Obesity in Adults",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK278991/",
    },
  ],
  "how-ai-body-fat-estimation-works": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
  ],
  "how-accurate-is-ai-body-fat-estimation": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
  ],
  "how-to-take-photos-for-body-fat-estimation": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
  ],
  "how-to-estimate-body-fat-percentage": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "CDC - About Adult BMI",
      href: "https://www.cdc.gov/bmi/about/index.html",
    },
  ],
  "best-body-fat-estimator": [
    {
      label:
        "Ackland et al. Current status of body composition assessment in sport and exercise (PubMed)",
      href: "https://pubmed.ncbi.nlm.nih.gov/22303996/",
    },
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
  ],
  "why-body-fat-looks-different": [
    {
      label: "NCBI Bookshelf - Evaluation of Overweight and Obesity in Adults",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK278991/",
    },
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
  ],
  "what-does-body-fat-percentage-look-like": [
    {
      label: "NCBI Bookshelf - Evaluation of Overweight and Obesity in Adults",
      href: "https://www.ncbi.nlm.nih.gov/books/NBK278991/",
    },
    {
      label: "CDC - Healthy Weight and Growth",
      href: "https://www.cdc.gov/healthy-weight-growth/about/index.html",
    },
  ],
};

const fallbackReferences: GuideReference[] = [
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
] as const;

function dedupeReferences(items: GuideReference[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
}

type GuideStandardReferencesProps = {
  slug?: string;
};

export default function GuideStandardReferences({
  slug,
}: GuideStandardReferencesProps) {
  const specific = slug ? slugSpecificReferences[slug] ?? [] : [];
  const references = dedupeReferences(
    [...baseGuideReferences, ...specific, ...fallbackReferences].slice(0, 6)
  );
  return (
    <>
      <EzoicAdSlot id={111} className="mt-12" />
      <References references={references} />
    </>
  );
}
