"use client";

import type { PortfolioWork } from "@/lib/portfolio-types";
import { useReveal } from "@/hooks/use-reveal";

function ProjectCard({ item, accent, delay, onClick }: { item: PortfolioWork; accent: string; delay: number; onClick: () => void }) {
  const { ref, visible } = useReveal(0.1);

  return (
    <div
      ref={ref}
      className="bento-card group cursor-pointer"
      onClick={onClick}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      }}
    >
      <div className="bento-card__image-container">
        {item.image ? (
          <img src={item.image} alt={item.title} className="bento-card__image group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full bg-secondary/50 flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-out">
            <span className="text-muted-foreground text-sm" style={{ fontFamily: "'Geist Mono', monospace" }}>No Image</span>
          </div>
        )}
        <div className="bento-card__overlay transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="bento-card__content">
        <h3 className="text-2xl font-bold text-white group-hover:drop-shadow-lg transition-all duration-300" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-white/90 line-clamp-2 drop-shadow-md">
          {item.summary}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[0.65rem] uppercase tracking-wider text-white/95 bg-black/20 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 shadow-sm" style={{ fontFamily: "'Geist Mono', monospace" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ workItems, themeAccent, setActiveProject }: { workItems: PortfolioWork[]; themeAccent: string; setActiveProject: (item: PortfolioWork) => void }) {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-24">
      <div className="border-t border-border pt-16">
        <div className="mb-10 sticky top-14 z-20 bg-background/80 backdrop-blur-md py-4 border-b border-border/20" style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
              Projects
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Things I&rsquo;ve <span style={{ color: themeAccent }}>built</span>.
            </h2>
          </div>
        </div>
        <div className="bento-grid">
          {workItems.map((item, index) => (
            <ProjectCard key={`${item.title}-${item.year}`} item={item} accent={themeAccent} delay={index * 80} onClick={() => setActiveProject(item)} />
          ))}
        </div>
      </div>
    </section>
  );
}
