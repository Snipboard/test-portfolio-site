import type { PortfolioWork, PortfolioHero, PortfolioContact, PortfolioExperience, PortfolioPost, PortfolioCollection } from "@/lib/portfolio-types";
import { PspPortfolioPage } from "@/components/psp/psp-portfolio-page";

// Retained for the legacy header component; the public portfolio always opens in XMB.
export type UiMode = "classic" | "psp";

export default function PortfolioPage(props: {
  workItems: PortfolioWork[];
  hero: PortfolioHero;
  contact: PortfolioContact;
  experienceItems: PortfolioExperience[];
  posts: PortfolioPost[];
  collections: PortfolioCollection[];
}) {
  return <PspPortfolioPage {...props} />;
}
