import Link from "next/link";
import type { PortfolioPost } from "@/lib/contentful";
import { getPspThemeStyle } from "@/components/psp/psp-showcase-style";
import { MarkdownText } from "@/components/psp/markdown-text";

export function BlogArticle({ post }: { post: PortfolioPost }) {
  return (
    <main className="min-h-screen bg-[var(--psp-bg)] text-[var(--psp-fg)]" style={getPspThemeStyle()}>
      <nav className="mx-auto flex max-w-5xl items-center justify-between border-b border-white/15 px-6 py-7 text-sm sm:px-10" aria-label="Article navigation">
        <Link href="/" className="text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)]">← XMB</Link>
        <span className="text-white/40">Writing</span>
      </nav>
      <article className="mx-auto max-w-3xl px-6 pb-32 pt-16 sm:px-10 sm:pt-24">
        <header>
          <time className="text-sm text-white/50">{post.publishedAt}</time>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.08] tracking-tight sm:text-7xl">{post.title}</h1>
          {post.excerpt && <p className="mt-9 border-l-2 border-white/30 pl-5 text-xl leading-8 text-white/65">{post.excerpt}</p>}
        </header>
        {post.heroImage && <figure className="my-14 border-y border-white/10 py-5">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={post.heroImage} alt={`${post.title} illustration`} className="w-full object-contain" /></figure>}
        <div className="mt-14 border-t border-white/15 pt-10"><MarkdownText variant="body">{post.body}</MarkdownText></div>
      </article>
    </main>
  );
}
