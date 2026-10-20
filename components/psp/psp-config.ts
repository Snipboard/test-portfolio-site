import type {
  PortfolioWork,
  PortfolioHero,
  PortfolioExperience,
  PortfolioPost,
  PortfolioCollection,
} from "@/lib/portfolio-types";
import type { XmbCategory, XmbItem } from "./types";
import {
  HomeIcon,
  ProjectsIcon,
  BlogIcon,
} from "./xmb-icons";
import { getCollectionView } from "@/lib/portfolio-collections";

export interface BuildCategoriesInput {
  hero: PortfolioHero;
  workItems: PortfolioWork[];
  experienceItems: PortfolioExperience[];
  posts: PortfolioPost[];
  collections: PortfolioCollection[];
}

function projectItem(work: PortfolioWork): XmbItem {
  return {
    id: `project-${work.slug}`,
    kind: "project",
    title: work.title,
    eyebrow: work.role,
    date: work.year,
    note: work.note,
    description: work.summary,
    body: work.body,
    image: work.image,
    showcase: work.showcase,
    gallery: work.gallery,
    highlights: work.outcomes,
    tags: work.tags,
    href: work.href,
    links: work.links,
    detailHref: `/projects/${work.slug}`,
    activationLabel: "View more",
  };
}

function postItem(post: PortfolioPost): XmbItem {
  return {
    id: `post-${post.slug}`,
    kind: "post",
    title: post.title,
    date: post.publishedAt,
    description: post.excerpt,
    body: post.body,
    tags: post.tags,
    image: post.heroImage,
    detailHref: post.placeholder ? undefined : `/blog/${post.slug}`,
    activationLabel: post.placeholder ? undefined : "Read post",
  };
}

function collectionItems<T extends { collectionId?: string }>(
  section: "projects" | "blog",
  collections: PortfolioCollection[],
  entries: T[],
  mapEntry: (entry: T) => XmbItem,
): XmbItem[] {
  const { folders, ungrouped } = getCollectionView(section, collections, null, entries);

  // Headings are visual only; items remain in a single, keyboard-navigable list.
  const grouped = folders.flatMap(({ collection }) =>
    entries
      .filter((entry) => entry.collectionId === collection.id)
      .map((entry) => ({
        ...mapEntry(entry),
        groupId: collection.id,
        groupTitle: collection.title,
      }))
  );

  const other = ungrouped.map((entry) => ({
    ...mapEntry(entry),
    ...(folders.length > 0 ? { groupId: "ungrouped", groupTitle: "Other" } : {}),
  }));

  return [...grouped, ...other];
}

/**
 * Helper builder to convert raw portfolio data into modular XMB categories.
 * Adding a new category or sub-option is as simple as adding an object to this array.
 */
export function buildXmbCategories({
  hero,
  workItems,
  posts,
  collections,
}: BuildCategoriesInput): XmbCategory[] {
  const categories: XmbCategory[] = [
    {
      id: "home",
      label: "Home",
      icon: HomeIcon,
      items: [
        {
          id: "hero-intro",
          kind: "home",
          title: "About Me",
          // subtitle: `Hi, I’m ${hero.firstName} ${hero.lastName}.`,
          description: hero.description,
          image: hero.portraitUrl,
          href: hero.cvUrl,
          downloadName: hero.cvUrl ? "Affan-Khan-CV.pdf" : undefined,
          activationLabel: hero.cvUrl ? "Download CV" : undefined,
        },
      ],
    },
    {
      id: "projects",
      label: "Projects",
      icon: ProjectsIcon,
      items: collectionItems("projects", collections, workItems, projectItem),
    },
    {
      id: "blog",
      label: "Writing",
      icon: BlogIcon,
      items: collectionItems("blog", collections, posts, postItem),
    },

  ];

  return categories.filter((category) => category.id !== "projects" || category.items.length > 0);
}
