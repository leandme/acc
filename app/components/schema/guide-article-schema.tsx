import { getGuidePostBySlug } from "@/app/libs/posts";
import {
  DEFAULT_SOCIAL_IMAGE,
  SITE_NAME,
  SITE_URL,
  toIsoDate,
} from "@/app/libs/seo";

type GuideArticleSchemaProps = {
  slug: string;
};

export default function GuideArticleSchema({ slug }: GuideArticleSchemaProps) {
  const post = getGuidePostBySlug(slug);
  if (!post) return null;

  const canonicalUrl = `${SITE_URL}/blog/${slug}`;
  const imageUrl = post.image.startsWith("http")
    ? post.image
    : `${SITE_URL}${post.image}`;
  const published = toIsoDate(post.date);
  const modified = published;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    image: [imageUrl || DEFAULT_SOCIAL_IMAGE],
    datePublished: published,
    dateModified: modified,
    author: {
      "@type": "Person",
      name: "Matt Phelps",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}
