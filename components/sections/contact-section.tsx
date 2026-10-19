"use client";

import { useReveal } from "@/hooks/use-reveal";
import type { PortfolioContact } from "@/lib/portfolio-types";

export function ContactSection({ themeAccent, contactData }: { themeAccent: string; contactData: PortfolioContact }) {
  const { ref: contactRef, visible: contactVisible } = useReveal(0.3);

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-32">
      <div
        ref={contactRef}
        className="border-t border-border pt-16"
        style={{
          opacity: contactVisible ? 1 : 0,
          transition: "opacity 0.7s ease 0.1s",
        }}
      >
        <div className="mb-10 sticky top-14 z-20 bg-background/80 backdrop-blur-md py-4 border-b border-border/20" style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
              Get in touch
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Let&rsquo;s <span style={{ color: themeAccent }}>connect</span>.
            </h2>
          </div>
        </div>
        
        <a href={`mailto:${contactData.email}`} className="group inline-flex items-end gap-3" style={{ textDecoration: "none" }}>
          <span className="text-[clamp(2rem,7vw,6rem)] font-extrabold leading-none tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {contactData.email}
          </span>
          <span className="mb-1 text-3xl text-muted-foreground transition-all duration-200 group-hover:text-accent md:text-5xl" style={{ transform: "translateY(-4px)" }}>
            ↗
          </span>
        </a>
        <p className="mt-4 mb-16 text-sm font-light text-muted-foreground">{contactData.responseTime}</p>

        <div className="flex gap-6 mt-8">
          <a href={contactData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
            GitHub
          </a>
          <a href={contactData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
