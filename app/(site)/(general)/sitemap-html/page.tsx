import { Metadata } from "next";
import Link from "next/link";
import H1 from "@/app/components/common/h1";
import { POSTS } from "../../guides/posts";
import { toolsArray } from "../../(tools)/tools";
import { buildPageMetadata } from "@/app/libs/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sitemap",
  description: "Browse all pages on BodyFatEstimator.ai — tools, guides, and key resources.",
  canonical: "https://bodyfatestimator.ai/sitemap-html",
  robots: {
    index: false,
    follow: true,
  },
});

type SiteLink = {
  href: string;
  label: string;
  description?: string;
};

function LinkList({ items }: { items: SiteLink[] }) {
  return (
    <ul className="mt-4 space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="text-primary text-lg underline hover:opacity-80"
          >
            {item.label}
          </Link>
          {item.description ? (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {item.description}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function SectionCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: SiteLink[];
}) {
  return (
    <section className="rounded-2xl border bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      {subtitle ? (
        <p className="mt-2 text-lg text-gray-700 leading-relaxed">{subtitle}</p>
      ) : null}
      <LinkList items={items} />
    </section>
  );
}

export default function SitemapPage() {

 // --- Tools ---
  const toolOrder = [
    "estimate",
    "body-visualizer",
    "tdee-calculator",
    "bmr-calculator",
    "calorie-estimator",
    "calorie-deficit-calculator",
    "macro-calculator",
    "steps-to-calories-calculator",
    "calories-burned-calculator",
    "bmi-calculator",
    "weight-loss-calculator",
    "weight-loss-percentage-calculator",
    "fasting-weight-loss-calculator",
    "intermittent-fasting-calculator",
    "ideal-weight-calculator",
    "height-calculator",
    "mid-parental-height-calculator",
    "overweight-calculator",
    "adjusted-body-weight-calculator",
    "ponderal-index-calculator",
    "broca-index-calculator",
    "waist-to-hip-ratio-calculator",
    "waist-to-height-ratio-calculator",
    "bai-calculator",
    "muscle-mass-calculator",
    "ffmi-calculator",
    "natty-or-not-calculator",
    "muscular-potential-calculator",
    "casey-butt-calculator",
    "bodybuilding-genetics-calculator",
    "rfm-calculator",
    "bri-calculator",
    "visceral-fat-calculator",
    "body-shape-calculator",
    "army-body-fat-calculator",
    "body-fat-calculator",
  ] as const;

  const toolMap = new Map(
    toolsArray().map((tool) => [tool.slug, tool])
  );

  const orderedTools = toolOrder
    .map((slug) => toolMap.get(slug))
    .filter((tool): tool is NonNullable<typeof tool> => Boolean(tool));

  const extraTools = toolsArray().filter(
    (tool) => !toolOrder.includes(tool.slug as (typeof toolOrder)[number])
  );

  const tools: SiteLink[] = [...orderedTools, ...extraTools].map((tool) => ({
    href: `/${tool.slug}`,
    label: tool.title,
  }));

  // --- Guides ---
    const guides: SiteLink[] = [
    {
      href: "/guides",
      label: "All Guides",
    },

    ...POSTS
      // optional: keep ordering stable (newest first if your date is sortable)
      // .slice().reverse()

      .map((p) => {
        const raw = p.slug.startsWith("/") ? p.slug : `/${p.slug}`;

        const href = raw.startsWith("/guides/")
          ? raw
          : raw.startsWith("/best-way") 
            ? `/guides${raw}`       
            : `/guides${raw}`;        

        return {
          href,
          label: p.title,
        };
      }),
  ];


  // --- Company / general ---
  const company: SiteLink[] = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/examples", label: "Examples" },
    { href: "/tools", label: "Tools" },
    { href: "/guides", label: "Guides" },
    { href: "/contact", label: "Contact" },
    { href: "/sitemap-html", label: "Sitemap" },
  ];

  // --- Legal ---
  const legal: SiteLink[] = [
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/cookies", label: "Cookie Policy" },
    { href: "/security", label: "Security Policy" },
    { href: "/subprocessors", label: "Sub-Processors" },
  ];

  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>Sitemap</H1>

        <p className="mt-6 text-center text-lg text-gray-700 max-w-3xl mx-auto">
          A complete index of tools, guides, and important pages on
          BodyFatEstimator.ai.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SectionCard
            title="Company"
            subtitle="Site information and getting in touch."
            items={company}
          />
          
          <SectionCard
            title="Tools"
            subtitle="Interactive tools and key pages."
            items={tools}
          />

          <SectionCard
            title="Guides"
            subtitle="Deep dives on body fat estimation, accuracy, and tracking."
            items={guides}
          />

          <SectionCard
            title="Legal"
            subtitle="Policies and terms."
            items={legal}
          />
        </div>
      </section>
    </main>
  );
}
