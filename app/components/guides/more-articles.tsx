import Link from "next/link";

type ArticleCard = {
  slug: string;
  title: string;
  image: string;
  description?: string;
  date?: string;
  readTime?: string;
  tag?: string;
};

export function MoreArticles({
  articles,
  basePath = "/guides",
  heading = "Read More",
  trackEvent,
}: {
  articles: [ArticleCard, ArticleCard]; // exactly two
  basePath?: string;
  heading?: string;
  trackEvent?: (event: string, props?: Record<string, any>) => void;
}) {
  return (
    <section className="mt-14 border-t pt-10">
      <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900"><a className="hover:underline" href="/guides">{heading} →</a></h2>

      <div className="mt-6 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {articles.map((a) => (
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

              <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 group-hover:underline">
                {a.title}
              </h3>
              
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
