// app/(site)/blog/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "./posts";

export const metadata: Metadata = {
  title: "Body Fat Estimation Guides",
  description:
    "Body fat estimation guides, photo tips, accuracy improvements, and tracking strategies using AI body fat estimates.",
};

export default function GuidesIndexPage() {
  return (
    <main className="bg-base-100">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20">
        <h1 className="text-3xl lg:text-5xl font-bold text-center">
          Body Fat Estimation Guides
        </h1>

        <p className="mt-4 text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Practical guides on AI body fat estimation, photo setup for accuracy, and
          tracking progress over time.
        </p>

      </section>

      <section className="pt-4 mx-auto max-w-5xl px-6 pb-20">
  <div className="mt-8 grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
    {POSTS.map((post) => (
      <Link
        key={post.slug}
        href={`/guides/${post.slug}`}
        className="group rounded-2xl border bg-white transition hover:shadow-lg hover:-translate-y-0.5 overflow-hidden"
      >
        {/* Image */}
        <div className="w-full aspect-[2/1] bg-base-200 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">{post.date}</span>
          </div>
          

          <h3 className="mt-4 text-xl lg:text-2xl font-semibold text-gray-900 group-hover:underline">
            {post.title}
          </h3>

          <p className="mt-4 text-md text-gray-600 leading-relaxed">
            {post.description}
          </p>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-xs text-gray-500">{post.readTime}</span>
            <span className="text-md text-primary font-medium">
              Read →
            </span>
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>


    </main>
  );
}
