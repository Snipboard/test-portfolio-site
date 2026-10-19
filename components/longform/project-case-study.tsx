import Link from "next/link";
import type { PortfolioWork } from "@/lib/portfolio-types";
import { getPspThemeStyle } from "@/components/psp/psp-showcase-style";
import { MarkdownText } from "@/components/psp/markdown-text";
import { ProjectGallery } from "@/components/psp/project-gallery";

export function ProjectCaseStudy({ project, links }: { project: PortfolioWork; links: { label: string; href: string }[] }) {
  const artwork = project.showcase?.artworkUrl ?? project.image ?? project.gallery?.[0];
  const gallery = project.gallery?.length ? project.gallery : project.image ? [project.image] : [];
  return (
    <main className="psp-shell min-h-screen bg-[var(--psp-bg)] text-[var(--psp-fg)]" style={getPspThemeStyle(project.showcase)}>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-8 sm:px-10">
        <nav className="flex items-center justify-between border-b border-white/15 pb-6 text-sm" aria-label="Case study navigation">
          <Link href="/" className="text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--psp-accent)]">← XMB</Link>
          <span className="text-white/35">Project / {project.year}</span>
        </nav>
        <header className="grid items-end gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:py-20">
          <div>
            <p className="text-sm text-[var(--psp-accent)]">Case study</p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight sm:text-7xl">{project.title}</h1>
            <p className="mt-7 max-w-xl text-xl leading-8 text-white/70">{project.summary}</p>
            {project.role && <p className="mt-8 border-l-2 border-[var(--psp-accent)] pl-4 text-sm text-white/60">{project.role}</p>}
          </div>
          {artwork && <figure className="grid min-h-64 place-items-center overflow-hidden bg-black/20 p-3 sm:min-h-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={artwork} alt={`${project.title} project view`} className="max-h-[540px] w-full object-contain" />
          </figure>}
        </header>
        <div className="grid gap-14 border-t border-white/15 pt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <aside className="space-y-8 text-sm text-white/55">
            {project.year && <div><p className="text-white/35">Year</p><p className="mt-1 text-white/85">{project.year}</p></div>}
            {project.outcomes.length > 0 && <div><p className="text-white/35">Highlights</p><ul className="mt-3 space-y-3">{project.outcomes.map(x=><li key={x} className="border-l border-[var(--psp-accent)] pl-3 text-white/75">{x}</li>)}</ul></div>}
            {project.tags.length > 0 && <div><p className="text-white/35">Tools and disciplines</p><p className="mt-2 leading-7 text-white/65">{project.tags.join(" · ")}</p></div>}
          </aside>
          <article className="max-w-3xl"><h2 className="mb-7 text-2xl font-medium">The work</h2><MarkdownText variant="body">{project.body || project.summary}</MarkdownText></article>
        </div>
        {gallery.length > 0 && <div className="mt-16 border-t border-white/15 pt-8"><h2 className="text-2xl font-medium">A closer look</h2><ProjectGallery images={gallery} title={project.title} /></div>}
        {links.length > 0 && <footer className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/15 pt-8">{links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="border-b border-[var(--psp-accent)] pb-1 text-sm text-white/80 hover:text-white">{link.label} ↗</a>)}</footer>}
      </div>
    </main>
  );
}
