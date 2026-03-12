import Link from "next/link";
import { POSTS } from "@/app/(site)/guides/posts";
import { EzoicAdSlot } from "@/app/components/helpers/ezoic-ad-slot";

type ArticleCard = {
  slug: string;
  title: string;
  image: string;
  description?: string;
  date?: string;
  readTime?: string;
  tag?: string;
};

function dedupeBySlug(items: ArticleCard[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function stableHash(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function rotate<T>(items: T[], offset: number) {
  if (items.length <= 1) return items;
  const index = ((offset % items.length) + items.length) % items.length;
  return items.slice(index).concat(items.slice(0, index));
}

function withDiversity(
  seedArticles: ArticleCard[],
  maxItems: number,
  preferredTag?: string,
  currentSlug?: string
) {
  const allArticles: ArticleCard[] = [...POSTS];
  const articleIndex = new Map(allArticles.map((article, index) => [article.slug, index]));
  const seed = dedupeBySlug(seedArticles)
    .filter((article) => article.slug !== currentSlug)
    .slice(0, maxItems);
  const current = currentSlug
    ? allArticles.find((article) => article.slug === currentSlug)
    : undefined;
  const primaryTag = preferredTag ?? current?.tag ?? seed[0]?.tag;
  const usedSlugs = new Set<string>();
  const picks: ArticleCard[] = [];

  const pool = allArticles.filter((article) => article.slug !== currentSlug);
  const inPostOrder = [...pool].sort(
    (a, b) =>
      (articleIndex.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
      (articleIndex.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
  );

  const sameTag = primaryTag
    ? inPostOrder.filter((article) => article.tag === primaryTag)
    : [...inPostOrder];
  const crossTag = inPostOrder.filter(
    (article) => article.tag && article.tag !== primaryTag
  );

  const hashBase = stableHash(currentSlug ?? primaryTag ?? "guides");
  const rotatedSeed = rotate(seed, hashBase);
  const rotatedSameTag = rotate(sameTag, hashBase);
  const rotatedCrossTag = rotate(crossTag, hashBase >> 1);
  const rotatedAll = rotate(inPostOrder, hashBase >> 2);

  function pushUnique(article?: ArticleCard) {
    if (!article) return;
    if (usedSlugs.has(article.slug)) return;
    usedSlugs.add(article.slug);
    picks.push(article);
  }

  // Keep one explicit seed for context, then diversify by rotating pools.
  pushUnique(rotatedSeed[0]);

  for (const article of rotatedSameTag) {
    if (picks.length >= maxItems) break;
    pushUnique(article);
  }

  // Ensure at least one different-topic recommendation when possible.
  if (picks.length < maxItems) {
    pushUnique(rotatedCrossTag[0]);
  }

  for (const article of [...rotatedCrossTag.slice(1), ...rotatedAll]) {
    if (picks.length >= maxItems) break;
    pushUnique(article);
  }

  return picks.slice(0, maxItems);
}

export function MoreArticles({
  articles,
  basePath = "/guides",
  heading = "Read More",
  maxItems = 2,
  preferredTag,
  currentSlug,
  trackEvent,
}: {
  articles: ArticleCard[];
  basePath?: string;
  heading?: string;
  maxItems?: number;
  preferredTag?: string;
  currentSlug?: string;
  trackEvent?: (event: string, props?: Record<string, any>) => void;
}) {
  const shownArticles = withDiversity(articles, Math.min(maxItems, 2), preferredTag, currentSlug);

  return (
    <>
      <EzoicAdSlot id={114} className="mt-12" />
      <section className="mt-14 border-t pt-10">
        <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900 text-left"><a className="hover:underline" href="/guides">{heading} →</a></h3>

        <div className="mt-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {shownArticles.map((a) => (
            <Link
              key={a.slug}
              href={`${basePath}/${a.slug}`}
              className="group rounded-2xl border bg-white transition hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
            >
              {/* Image */}
              <div className="w-full aspect-[2/1] bg-base-200 overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">{a.date ?? ""}</span>
                </div>

                <h3 className="mt-4 text-xl lg:text-2xl font-semibold text-gray-900 group-hover:underline">
                  {a.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
