"use client";

import React from "react";

import type { PortfolioExperience } from "@/lib/portfolio-types";

export function ExperienceSection({ themeAccent, experienceItems }: { themeAccent: string; experienceItems: PortfolioExperience[] }) {
  return (
    <section id="experience" className="exp-section">
      <div className="exp-section__inner">
        <div className="exp-section__header sticky top-14 z-20 bg-background/80 backdrop-blur-md py-4 border-b border-border/20" style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}>
          <div className="mx-auto max-w-6xl px-6">
            <p className="exp-section__label">Experience</p>
            <h2 className="exp-section__title">
              Where I&rsquo;ve <span style={{ color: themeAccent }}>worked</span>.
            </h2>
          </div>
        </div>

        <div className="timeline-container">
          <div className="timeline-line" />
          {experienceItems.map((item, index) => (
            <div key={item.company} className={`timeline-node ${index % 2 === 0 ? 'timeline-node--left' : 'timeline-node--right'}`}>
              <div className="timeline-dot" style={{ borderColor: item.accent }} />
              <div className="timeline-content">
                <div
                  className="exp-brand-card group"
                  style={{
                    borderColor: `color-mix(in srgb, ${item.accent} 25%, var(--border))`,
                    ["--company-accent" as never]: item.accent,
                  } as React.CSSProperties}
                >
                  {/* Radial glow on hover */}
                  <div
                    className="exp-brand-card__glow group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle 140px at 50% 50%, ${item.accent}14, transparent 70%)`,
                    }}
                  />
                  
                  {/* Default State: Full Bleed Image */}
                  <div className="exp-brand-card__logo-large bg-secondary/20">
                    {item.image ? (
                      <img src={item.image} alt={item.company} className="w-full h-full object-cover opacity-100 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-30 group-hover:blur-[4px]" />
                    ) : (
                      <div className="exp-brand-card__logo transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-30 group-hover:blur-[4px]" style={{ background: item.accent }}>
                        <span>{item.company.charAt(0)}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Box fading in */}
                  <div className="exp-brand-card__overlay">
                    <div className="exp-brand-card__overlay-content">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-foreground" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                          {item.company}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-foreground/80">{item.role}</p>
                      </div>
                      <div className="mt-4">
                        <span className="inline-block text-[10px] uppercase tracking-widest text-muted-foreground border border-border/50 bg-secondary/80 backdrop-blur-sm px-3 py-1 rounded-full mb-3" style={{ fontFamily: "'Geist Mono', monospace" }}>
                          {item.period}
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
