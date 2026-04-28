export type BlogPost = {
  slug: string;
  href?: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
  tag: string;
};

export const POSTS: BlogPost[] = [
  {
    slug: "count-calories-AI-detection",
    href: "/count-calories-AI-detection",
    title: "How to Count Calories Using AI Food Detection",
    description:
      "A complete guide to AI food detection for calorie tracking, including setup, accuracy expectations, practical tips, and What The Food workflow.",
    image: "/home/analyzing-meal.png",
    date: "Jul 29, 2025",
    readTime: "10 min read",
    tag: "foodtech",
  },
  {
    slug: "ai-calorie-estimation",
    title: "AI Calorie Estimation Accuracy: What to Expect",
    description:
      "How accurate are AI calorie apps? Learn where estimates are strong, where errors increase, and how popular tools compare on complex meals and portion sizing.",
    image: "/home/analyzing-meal.png",
    date: "Dec 25, 2025",
    readTime: "11 min read",
    tag: "calories",
  },
];

export function getGuidePostBySlug(slug: string) {
  return POSTS.find((post) => post.slug === slug);
}
