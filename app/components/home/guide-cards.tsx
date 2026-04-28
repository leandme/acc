import Link from "next/link";
import { POSTS } from "@/app/libs/posts";

export type GuideCardItem = {
  title: string;
  href: string;
  date?: string; // e.g. "Nov 25, 2025"
  description?: string;
  image?: string;
};

type Props = {
  headline?: string;
  description?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  items?: GuideCardItem[]; // if omitted, defaults are used
  className?: string;
};

function toDateValue(input: string) {
  const parsed = new Date(input);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
}

const DEFAULT_ITEMS: GuideCardItem[] =
  [...POSTS]
    .sort((a, b) => toDateValue(b.date) - toDateValue(a.date))
    .slice(0, 1)
    .map((post) => ({
      date: post.date,
      title: post.title,
      href: `/blog/${post.slug}`,
      image: post.image,
      description: post.description,
    })) || [];

export default function GuideCards({
  headline = "Latest From Our Blog",
  description = "Tips, guides, and insights for healthier eating.",
  viewAllLabel = "View all posts",
  viewAllHref = "/blog",
  items = DEFAULT_ITEMS,
  className = "",
}: Props) {
  const cards = items.slice(0, 3);

  return (
    <section className={`mx-auto mt-16 mb-20 lg:mt-24 max-w-6xl px-6 ${className}`}>
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900">
            {headline}
          </h2>
          <p className="mt-3 text-lg text-gray-600">{description}</p>
        </div>

        <Link
          href={viewAllHref}
          className="text-lg font-semibold text-gray-700 hover:text-primary hover:underline transition sm:mt-2"
        >
          {viewAllLabel}
        </Link>
      </div>

      {/* Cards */}
      <div
        className={`mt-8 grid gap-6 grid-cols-1 ${
          cards.length > 1 ? "md:grid-cols-3" : "max-w-2xl mx-auto"
        }`}
      >
        {cards.map((item) => (
          <Link
            key={item.href + item.title}
            href={item.href}
            className="group rounded-2xl border border-2 border-gray-200 bg-white p-8 shadow-sm transition
                       hover:shadow-md hover:-translate-y-[1px]
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {item.image ? (
              <div className="-mx-8 -mt-8 mb-6 overflow-hidden rounded-t-2xl border-b border-gray-200 bg-base-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-52 w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
            ) : null}

            {item.date ? (
              <p className="text-base text-gray-500">{item.date}</p>
            ) : null}

            <h3 className="mt-5 mb-4 text-xl font-semibold text-gray-700 leading-snug">
              {item.title}
            </h3>

            {item.description ? (
              <p className="mt-3 text-base text-gray-600 leading-relaxed">
                {item.description}
              </p>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
