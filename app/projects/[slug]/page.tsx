import { notFound } from "next/navigation";
import { getPortfolioContent } from "@/lib/contentful";
import { ProjectCaseStudy } from "@/components/longform/project-case-study";

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPortfolioContent();
  const project = content.workItems.find((item) => item.slug === slug);

  if (!project) notFound();

  const links = [
    ...project.links.map((link) => ({ label: link.label, href: link.url })),
    project.liveUrl ? { label: "Open project", href: project.liveUrl } : null,
    project.repositoryUrl ? { label: "View repository", href: project.repositoryUrl } : null,
    project.href && project.href !== "#" ? { label: "Project link", href: project.href } : null,
  ]
    .filter((link): link is { label: string; href: string } => Boolean(link))
    .filter((link, index, allLinks) => allLinks.findIndex((candidate) => candidate.href === link.href) === index);

  return <ProjectCaseStudy project={project} links={links} />;
}
