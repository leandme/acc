export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
  tag: string;
};

// Blog content is currently not mounted in this workspace snapshot.
// Keep this module so shared components compile cleanly.
export const POSTS: BlogPost[] = [];

export function getGuidePostBySlug(slug: string) {
  return POSTS.find((post) => post.slug === slug);
}
