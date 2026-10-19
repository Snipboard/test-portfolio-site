import { getPortfolioContent } from "@/lib/atlas";
import PortfolioPage from "@/components/portfolio-page";

// Resolve published Atlas content at request time, not as a static build artifact.
export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getPortfolioContent();
  return (
    <PortfolioPage
      hero={content.hero}
      contact={content.contact}
      experienceItems={content.experience}
      workItems={content.workItems}
      posts={content.posts}
      collections={content.collections}
    />
  );
}
