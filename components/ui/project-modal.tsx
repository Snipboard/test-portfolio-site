"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { PortfolioWork } from "@/lib/portfolio-types";

export function ProjectModal({ item, accent, onClose }: { item: PortfolioWork; accent: string; onClose: () => void }) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col md:flex-row w-full max-w-5xl h-[85vh] md:h-[75vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-foreground transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Left: Gallery */}
        <div className="w-full md:w-[55%] h-[40vh] md:h-full bg-secondary/30 relative flex flex-col border-b md:border-b-0 md:border-r border-border">
          {item.gallery && item.gallery.length > 0 ? (
            <>
              <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                <img 
                  src={item.gallery[activeImageIdx]} 
                  alt={`${item.title} gallery image ${activeImageIdx + 1}`} 
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              </div>
              {item.gallery.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-20">
                  {item.gallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeImageIdx ? 'bg-foreground scale-125' : 'bg-foreground/30 hover:bg-foreground/50'}`}
                      aria-label={`View image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-muted-foreground font-medium" style={{ fontFamily: "'Geist Mono', monospace" }}>No gallery images</span>
            </div>
          )}
        </div>

        {/* Modal Right: Content */}
        <div className="w-full md:w-[45%] h-[45vh] md:h-full overflow-y-auto custom-scrollbar">
          <div className="p-8 md:p-10 flex flex-col h-full">
            <span className="inline-block px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs rounded-full uppercase tracking-wider mb-6 self-start" style={{ fontFamily: "'Geist Mono', monospace" }}>
              {item.year}
            </span>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              {item.title}
            </h2>
            
            <p className="text-base text-muted-foreground leading-relaxed mb-8 font-light">
              {item.summary}
            </p>

            <div className="mb-10">
              <h4 className="text-xs uppercase tracking-widest text-foreground/50 mb-4" style={{ fontFamily: "'Geist Mono', monospace" }}>Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-xs rounded-md font-medium border border-border/50 shadow-sm" style={{ fontFamily: "'Geist Mono', monospace" }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
            {item.href && item.href !== "#" && (
              <a
                href={item.href}
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl text-white font-medium transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
                style={{ backgroundColor: accent, fontFamily: "'Geist Mono', monospace" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Project
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                </svg>
              </a>
            )}
          </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
