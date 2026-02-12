import { Metadata } from "next";
import Link from "next/link";
import H1 from "@/app/components/common/h1";
import { ToolMeta } from "../tools";

// ✅ Update this import path to where your tools.ts lives
import { TOOLS } from "../tools";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Browse all tools on BodyFatEstimator.ai — calculators, estimators, and visualizers.",
  robots: { index: true, follow: true },
};

type ToolLink = {
  title: string;
  href: string;
  eventName?: string;
};

type ToolCategory = {
  title: string;
  items: ToolLink[];
};

function slugToHref(slug: string) {
  // your slugs look like "ffmi-calculator", "estimate"
  // so href should be "/ffmi-calculator", "/estimate"
  return `/${slug}`;
}

function groupToolsByCategory(tools: Record<string, ToolMeta>): ToolCategory[] {
  const map = new Map<string, ToolLink[]>();

  Object.values(tools).forEach((t) => {
    const category = t.category?.trim() || "Other";
    const items = map.get(category) ?? [];
    items.push({
      title: t.title,
      href: slugToHref(t.slug),
      eventName: t.eventName,
    });
    map.set(category, items);
  });

  // Sort categories + tools for stable output
  const categories = Array.from(map.entries())
    .map(([title, items]) => ({
      title,
      items: items.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  return categories;
}

function ToolCard({ item }: { item: ToolLink }) {
  return (
    <Link
      href={item.href}
      className="group rounded-2xl border border-2 bg-white p-6 shadow-sm transition
                 hover:shadow-md hover:-translate-y-[1px]
                 focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <p className="text-lg text-gray-900 text-primary underline group-hover:underline">
        {item.title}
      </p>
    </Link>
  );
}

function CategoryCard({ title, items }: ToolCategory) {
  return (
    <section className="bg-white p-6">
      <h2 className="text-xl lg:text-2xl font-semibold text-gray-900">
        {title}
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ToolCard key={item.href + item.title} item={item} />
        ))}
      </div>
    </section>
  );
}

export default function ToolsIndexPage() {
  const TOOL_CATEGORIES = groupToolsByCategory(TOOLS);

  return (
    <main className="bg-base-100 pt-10">
      <section className="mx-auto max-w-5xl px-6">
        <H1>Tools</H1>

        <p className="mt-6 text-center text-lg text-gray-700 max-w-3xl mx-auto">
          All calculators and tools, organized by category.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-20 mt-10">
        <div className="grid grid-cols-1 gap-6">
          {TOOL_CATEGORIES.map((cat) => (
            <CategoryCard key={cat.title} title={cat.title} items={cat.items} />
          ))}
        </div>
      </section>
    </main>
  );
}
