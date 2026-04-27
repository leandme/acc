import type { Metadata } from "next";

export const SITE_URL = "https://aicaloriecounter.ai";
export const SITE_NAME = "AI Calorie Counter";
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/logo.png`;

type BuildPageMetadataInput = {
  title: string;
  description: string;
  canonical: string;
  robots?: Metadata["robots"];
  type?: "website" | "article";
};

function toAbsoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const normalized = url.startsWith("/") ? url : `/${url}`;
  return `${SITE_URL}${normalized}`;
}

export function toIsoDate(input?: string | Date | null) {
  if (!input) return undefined;
  const value = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(value.getTime())) return undefined;
  return value.toISOString();
}

export function buildPageMetadata({
  title,
  description,
  canonical,
  robots,
  type = "website",
}: BuildPageMetadataInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(canonical);
  const fallbackRobots: Metadata["robots"] = {
    index: true,
    follow: true,
  };

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: robots ?? fallbackRobots,
    openGraph: {
      type,
      siteName: SITE_NAME,
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: DEFAULT_SOCIAL_IMAGE,
          width: 512,
          height: 512,
          alt: `${SITE_NAME} logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_SOCIAL_IMAGE],
    },
  };
}
