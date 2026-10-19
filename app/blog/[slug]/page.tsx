import { notFound } from "next/navigation";
import { getPortfolioContent } from "@/lib/atlas";
import { BlogArticle } from "@/components/longform/blog-article";

// Resolve published Atlas content at request time, not as a static build artifact.
export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPortfolioContent();
  const post = content.posts.find((item) => item.slug === slug && !item.placeholder);

  if (!post) notFound();

  return <BlogArticle post={post} />;
}
