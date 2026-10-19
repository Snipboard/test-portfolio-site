import { notFound } from "next/navigation";
import { getPortfolioContent } from "@/lib/contentful";
import { BlogArticle } from "@/components/longform/blog-article";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPortfolioContent();
  const post = content.posts.find((item) => item.slug === slug && !item.placeholder);

  if (!post) notFound();

  return <BlogArticle post={post} />;
}
