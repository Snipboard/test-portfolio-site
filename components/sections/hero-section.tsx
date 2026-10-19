"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleField } from "@/components/ui/particle-field";
import type { PortfolioHero } from "@/lib/portfolio-types";

export function HeroSection({ accentColor, heroData }: { accentColor: string; heroData: PortfolioHero }) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 800], [1, 0]);

  return (
    <section className="relative flex h-screen flex-col overflow-hidden">
      <div className="absolute inset-0">
        <ParticleField className="h-full w-full" accent={accentColor} />
      </div>
      <motion.div className="relative z-10 mt-auto max-w-6xl px-6 pb-16 md:px-10" style={{ pointerEvents: "none", y: heroY, opacity: heroOpacity }}>
        <p className="mb-5 text-xs uppercase tracking-widest text-muted-foreground" style={{ fontFamily: "'Geist Mono', monospace" }}>
          {heroData.tagline}
        </p>
        <h1 className="mb-6 text-[clamp(4.8rem,12vw,11.5rem)] font-extrabold leading-[0.86] tracking-tight text-foreground md:text-[clamp(5.4rem,13vw,13rem)]" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
          {heroData.firstName}
          <br />
          <span style={{ color: accentColor }}>{heroData.lastName}</span>
        </h1>
        <p className="max-w-md whitespace-pre-line text-base font-light leading-relaxed text-muted-foreground md:text-lg">
          {heroData.description}
        </p>
      </motion.div>
      <div className="absolute bottom-6 right-8 z-10 flex flex-col items-center gap-2">
        <div className="relative h-12 w-px overflow-hidden bg-foreground/10">
          <div className="absolute inset-x-0 top-0 h-1/2 bg-accent" style={{ animation: "slideDown 1.6s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
