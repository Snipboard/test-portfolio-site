import type { ShowcaseConfig } from "./showcase.ts";
import { sortByMostRecentYear } from "./portfolio-sort.ts";

export type PortfolioLink = {
  label: string;
  url: string;
  type?: "website" | "github" | "devpost" | "ios" | "android" | "video" | "other";
};

export type PortfolioWork = {
  title: string;
  slug: string;
  year: string;
  summary: string;
  body?: string;
  role?: string;
  outcomes: string[];
  tags: string[];
  note: string;
  href: string;
  repositoryUrl?: string;
  liveUrl?: string;
  links: PortfolioLink[];
  image?: string;
  gallery?: string[];
  collectionId?: string;
  showcase?: ShowcaseConfig;
};

export type PortfolioExperience = {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  tags: string[];
  accent: string;
  image?: string;
  showcase?: ShowcaseConfig;
};

export type PortfolioPost = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  tags: string[];
  heroImage?: string;
  placeholder?: boolean;
  collectionId?: string;
};

export type PortfolioCollection = {
  id: string;
  title: string;
  slug: string;
  section: "projects" | "blog";
  description: string;
  order: number;
  image?: string;
};

export type PortfolioHero = {
  firstName: string;
  lastName: string;
  tagline: string;
  description: string;
  cvUrl?: string;
};

export type PortfolioContact = {
  email: string;
  responseTime: string;
  githubUrl: string;
  linkedinUrl: string;
};

type ContentfulEntry = {
  sys?: { id?: string; contentType?: { sys?: { id?: string } } };
  fields?: Record<string, unknown>;
};

type ContentfulAsset = {
  sys: { id: string };
  fields: { file?: { url?: string } };
};

type ContentfulResponse = {
  items?: ContentfulEntry[];
  includes?: { Asset?: ContentfulAsset[] };
};

type CollectionOptions = {
  spaceId: string;
  accessToken: string;
  contentType: string;
};

const fallbackHero: PortfolioHero = {
  firstName: "Affan",
  lastName: "Khan.",
  tagline: "",
  description: "I build digital experiences with a strong point of view, then connect the content layer so the site stays alive.",
};

const fallbackContact: PortfolioContact = {
  email: "hello@example.com",
  responseTime: "Response time usually same day.",
  githubUrl: "https://github.com/",
  linkedinUrl: "https://linkedin.com/",
};

const fallbackExperience: PortfolioExperience[] = [
  {
    company: "Amazon",
    role: "Software Engineering Intern",
    period: "Summer 2025",
    description: "Built internal tooling and services at scale. Worked within a distributed systems team, shipping features that impacted millions of users.",
    highlights: ["Shipped production-facing tooling", "Worked across distributed services"],
    tags: ["Java", "AWS", "Distributed Systems"],
    accent: "#ff9900",
    image: "/amazon.jpg",
  },
  {
    company: "EA",
    role: "Software Engineering Intern",
    period: "Summer 2024",
    description: "Developed gameplay systems and internal development tools. Contributed to production pipelines used across multiple studio teams.",
    highlights: ["Built internal development tools", "Contributed to shared production pipelines"],
    tags: ["C++", "Python", "Game Dev"],
    accent: "#0b4ea2",
    image: "/electronic_arts.jpg",
  },
];

const fallbackWork: PortfolioWork[] = [];

const fallbackPosts: PortfolioPost[] = [
  {
    title: "Writing, soon",
    slug: "writing-soon",
    excerpt: "Longer notes on software, product decisions, and the systems behind the work will live here.",
    body: "This blog is ready for its first entry. Publish a blogEntry in Contentful and it will appear here automatically.",
    publishedAt: "Coming soon",
    tags: ["Blog"],
    placeholder: true,
  },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  return typeof value === "string" ? value : undefined;
}

function stringArrayField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  if (Array.isArray(value)) return value.filter((item): item is string => typeof item === "string");
  if (typeof value === "string") return value.split(",").map(i => i.trim()).filter(Boolean);
  return undefined;
}

function numberField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function referenceIdField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  const sys = isRecord(value) && isRecord(value.sys) ? value.sys : undefined;
  return typeof sys?.id === "string" ? sys.id : undefined;
}

function linkArrayField(fields: Record<string, unknown> | undefined, key: string): PortfolioLink[] {
  const field = fields?.[key];
  const value = Array.isArray(field)
    ? field
    : isRecord(field) && Array.isArray(field.items)
      ? field.items
      : [];

  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.label !== "string" || typeof item.url !== "string") return [];

    try {
      const url = new URL(item.url);
      if (url.protocol !== "https:" && url.protocol !== "http:") return [];
    } catch {
      return [];
    }

    const allowedTypes = ["website", "github", "devpost", "ios", "android", "video", "other"] as const;
    const type = typeof item.type === "string" && allowedTypes.includes(item.type as (typeof allowedTypes)[number])
      ? item.type as PortfolioLink["type"]
      : undefined;

    return [{ label: item.label, url: item.url, type }];
  });
}

function richTextField(fields: Record<string, unknown> | undefined, key: string) {
  const value = fields?.[key];
  if (typeof value === "string") return value;

  const renderNode = (node: unknown): string => {
    if (!isRecord(node)) return "";
    if (typeof node.value === "string") {
      const leadingWhitespace = node.value.match(/^\s*/)?.[0] ?? "";
      const trailingWhitespace = node.value.match(/\s*$/)?.[0] ?? "";
      const markableStart = leadingWhitespace.length;
      const markableEnd = node.value.length - trailingWhitespace.length;
      if (markableEnd <= markableStart) return node.value;
      const markableText = node.value.slice(markableStart, markableEnd);
      const marks = Array.isArray(node.marks)
        ? node.marks.flatMap((mark) => isRecord(mark) && typeof mark.type === "string" ? [mark.type] : [])
        : [];
      const markedText = marks.reduce((text, mark) => {
        if (mark === "bold") return `**${text}**`;
        if (mark === "italic") return `*${text}*`;
        if (mark === "code") return `\`${text}\``;
        return text;
      }, markableText);
      return `${leadingWhitespace}${markedText}${trailingWhitespace}`;
    }
    if (!Array.isArray(node.content)) return "";
    const content = node.content.map(renderNode).filter(Boolean).join("");

    if (node.nodeType === "paragraph") return `${content}\n\n`;
    if (typeof node.nodeType === "string" && /^heading-[1-6]$/.test(node.nodeType)) {
      const level = Number(node.nodeType.at(-1));
      return `${"#".repeat(level)} ${content}\n\n`;
    }
    if (node.nodeType === "unordered-list" || node.nodeType === "ordered-list") {
      return `${node.content.map((item, index) => {
        const text = renderNode(item).trim().replace(/\n+/g, "\n  ");
        return `${node.nodeType === "ordered-list" ? `${index + 1}.` : "-"} ${text}`;
      }).join("\n")}\n\n`;
    }
    if (node.nodeType === "blockquote") {
      return `${content.trim().split("\n").map((line) => `> ${line}`).join("\n")}\n\n`;
    }
    if (node.nodeType === "hr") return "---\n\n";
    if (node.nodeType === "hyperlink" && isRecord(node.data) && typeof node.data.uri === "string") {
      return `[${content}](${node.data.uri})`;
    }
    return content;
  };

  const result = renderNode(value).trim();
  return result || undefined;
}

function getAssetUrl(fields: Record<string, unknown> | undefined, key: string, assets: ContentfulAsset[]): string | undefined {
  const field = fields?.[key];
  const sys = isRecord(field) && isRecord(field.sys) ? field.sys : undefined;
  const linkId = typeof sys?.id === "string" ? sys.id : undefined;
  if (!linkId) return undefined;
  const asset = assets.find(a => a.sys.id === linkId);
  const url = asset?.fields?.file?.url;
  return url ? (url.startsWith("//") ? `https:${url}` : url) : undefined;
}

function getAssetUrls(fields: Record<string, unknown> | undefined, key: string, assets: ContentfulAsset[]): string[] | undefined {
  const links = fields?.[key];
  if (!Array.isArray(links)) return undefined;
  
  const urls: string[] = [];
  for (const link of links) {
    const sys = isRecord(link) && isRecord(link.sys) ? link.sys : undefined;
    const linkId = typeof sys?.id === "string" ? sys.id : undefined;
    if (linkId) {
      const asset = assets.find(a => a.sys.id === linkId);
      const url = asset?.fields?.file?.url;
      if (url) urls.push(url.startsWith("//") ? `https:${url}` : url);
    }
  }
  return urls.length > 0 ? urls : undefined;
}

function getCollectionUrl({ spaceId, accessToken, contentType }: CollectionOptions) {
  const params = new URLSearchParams({
    access_token: accessToken,
    content_type: contentType,
    order: "-sys.createdAt",
  });
  return `https://cdn.contentful.com/spaces/${spaceId}/entries?${params.toString()}`;
}

async function getContentfulData(contentType: string): Promise<ContentfulResponse | null> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;

  if (!spaceId || !accessToken) return null;

  try {
    const response = await fetch(getCollectionUrl({ spaceId, accessToken, contentType }), {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

function mapHeroEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioHero | null {
  const fields = entry.fields;
  if (!fields) return null;
  return {
    firstName: stringField(fields, "firstName") ?? fallbackHero.firstName,
    lastName: stringField(fields, "lastName") ?? fallbackHero.lastName,
    tagline: stringField(fields, "tagline") ?? fallbackHero.tagline,
    description: richTextField(fields, "description") ?? fallbackHero.description,
    cvUrl: getAssetUrl(fields, "cv", assets) ?? stringField(fields, "cvUrl"),
  };
}

function mapContactEntry(entry: ContentfulEntry): PortfolioContact | null {
  const fields = entry.fields;
  if (!fields) return null;
  return {
    email: stringField(fields, "email") ?? fallbackContact.email,
    responseTime: stringField(fields, "responseTime") ?? fallbackContact.responseTime,
    githubUrl: stringField(fields, "githubUrl") ?? fallbackContact.githubUrl,
    linkedinUrl: stringField(fields, "linkedinUrl") ?? fallbackContact.linkedinUrl,
  };
}

function mapExperienceEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioExperience | null {
  const fields = entry.fields;
  const company = stringField(fields, "company");
  if (!company) return null;
  return {
    company,
    role: stringField(fields, "role") ?? "Role",
    period: stringField(fields, "period") ?? "Period",
    description: stringField(fields, "description") ?? "",
    highlights: stringArrayField(fields, "highlights") ?? [],
    tags: stringArrayField(fields, "tags") ?? [],
    accent: stringField(fields, "accent") ?? "#ffffff",
    image: getAssetUrl(fields, "image", assets),
  };
}

function mapWorkEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioWork | null {
  const fields = entry.fields;
  const title = stringField(fields, "title");
  if (!title) return null;
  return {
    title,
    slug: stringField(fields, "slug") ?? slugify(title),
    year: stringField(fields, "year") ?? "2024",
    summary: stringField(fields, "summary") ?? "",
    body: richTextField(fields, "body") ?? stringField(fields, "longDescription"),
    role: stringField(fields, "role"),
    outcomes: stringArrayField(fields, "outcomes") ?? [],
    tags: stringArrayField(fields, "tags") ?? [],
    note: stringField(fields, "note") ?? "",
    href: stringField(fields, "url") ?? stringField(fields, "href") ?? "#",
    repositoryUrl: stringField(fields, "repositoryUrl"),
    liveUrl: stringField(fields, "liveUrl"),
    links: linkArrayField(fields, "links"),
    image: getAssetUrl(fields, "image", assets),
    gallery: getAssetUrls(fields, "gallery", assets),
    collectionId: referenceIdField(fields, "collection"),
  };
}

function mapPostEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioPost | null {
  const fields = entry.fields;
  const title = stringField(fields, "title");
  if (!title) return null;

  return {
    title,
    slug: stringField(fields, "slug") ?? slugify(title),
    excerpt: stringField(fields, "excerpt") ?? stringField(fields, "summary") ?? "",
    body: richTextField(fields, "content") ?? richTextField(fields, "body") ?? "",
    publishedAt: stringField(fields, "date") ?? stringField(fields, "publishedAt") ?? "",
    tags: stringArrayField(fields, "tags") ?? [],
    heroImage: getAssetUrl(fields, "heroImage", assets),
    collectionId: referenceIdField(fields, "collection"),
  };
}

function mapCollectionEntry(entry: ContentfulEntry, assets: ContentfulAsset[]): PortfolioCollection | null {
  const fields = entry.fields;
  const id = entry.sys?.id;
  const title = stringField(fields, "title");
  const section = stringField(fields, "section")?.toLowerCase();
  if (!id || !title || (section !== "projects" && section !== "blog")) return null;

  return {
    id,
    title,
    slug: stringField(fields, "slug") ?? slugify(title),
    section,
    description: richTextField(fields, "description") ?? "",
    order: numberField(fields, "order") ?? 999,
    image: getAssetUrl(fields, "image", assets),
  };
}

export async function getPortfolioContent() {
  // Atlas is the preferred source. Until its complete corpus is published,
  // keep serving the existing Contentful content without changing page layouts.
  const { getAtlasPortfolioContent } = await import("./atlas.ts");
  return (await getAtlasPortfolioContent()) ?? getContentfulPortfolioContent();
}

async function getContentfulPortfolioContent() {
  const [heroRes, contactRes, workRes, expRes, postsRes, collectionsRes] = await Promise.all([
    getContentfulData("portfolioHero"),
    getContentfulData("portfolioContact"),
    getContentfulData("workItem"),
    getContentfulData("experienceItem"),
    getContentfulData("blogEntry"),
    getContentfulData("portfolioCollection"),
  ]);

  const heroItem = heroRes?.items?.[0]
    ? mapHeroEntry(heroRes.items[0], heroRes?.includes?.Asset ?? [])
    : null;
  const contactItem = contactRes?.items?.[0] ? mapContactEntry(contactRes.items[0]) : null;
  
  const workItems = sortByMostRecentYear(
    (workRes?.items ?? [])
      .map(entry => mapWorkEntry(entry, workRes?.includes?.Asset ?? []))
      .filter((item): item is PortfolioWork => Boolean(item))
  );
    
  const experienceItems = (expRes?.items ?? [])
    .map(entry => mapExperienceEntry(entry, expRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioExperience => Boolean(item));

  const posts = (postsRes?.items ?? [])
    .map(entry => mapPostEntry(entry, postsRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioPost => Boolean(item));

  const collections = (collectionsRes?.items ?? [])
    .map(entry => mapCollectionEntry(entry, collectionsRes?.includes?.Asset ?? []))
    .filter((item): item is PortfolioCollection => Boolean(item))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  return {
    hero: heroItem ?? fallbackHero,
    contact: contactItem ?? fallbackContact,
    workItems,
    experience: experienceItems.length > 0 ? experienceItems : fallbackExperience,
    posts: posts.length > 0 ? posts : fallbackPosts,
    collections,
  };
}

export function getFallbackPortfolioContent() {
  return {
    hero: fallbackHero,
    contact: fallbackContact,
    workItems: fallbackWork,
    experience: fallbackExperience,
    posts: fallbackPosts,
    collections: [] as PortfolioCollection[],
  };
}
