import { parseShowcase, safeMediaUrl } from "./showcase.ts";
import { sortByMostRecentYear } from "./portfolio-sort.ts";
import type {
  PortfolioCollection, PortfolioContact, PortfolioExperience,
  PortfolioHero, PortfolioPost, PortfolioWork,
} from "./portfolio-types.ts";

// Public, read-only Atlas endpoint. No Atlas credentials are sent from the portfolio.
const DEFAULT_ATLAS_URL = "https://affan-atlas.duckdns.org/api/public/portfolio";

type PortfolioContent = {
  hero: PortfolioHero;
  contact: PortfolioContact;
  workItems: PortfolioWork[];
  experience: PortfolioExperience[];
  posts: PortfolioPost[];
  collections: PortfolioCollection[];
};

const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const str = (value: unknown): string => typeof value === "string" ? value : "";
const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const optional = (value: unknown): string | undefined =>
  typeof value === "string" && value ? value : undefined;
const slug = (value: string): string => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function mapContent(payload: unknown): PortfolioContent {
  if (!object(payload) || !object(payload.hero) || !object(payload.contact) ||
      !Array.isArray(payload.work) || !Array.isArray(payload.experience) ||
      !Array.isArray(payload.posts) || !Array.isArray(payload.collections)) {
    throw new Error("Atlas portfolio API returned an invalid payload structure.");
  }

  const hero = payload.hero;
  const contact = payload.contact;

  if (!str(hero.firstName) || !str(hero.lastName) || !str(contact.email)) {
    throw new Error("Atlas portfolio API is missing a published profile or contact.");
  }

  const workItems: PortfolioWork[] = payload.work.flatMap((item: unknown) => {
    if (!object(item) || !str(item.title) || !str(item.summary)) return [];
    const links = Array.isArray(item.links)
      ? item.links.filter((link): link is PortfolioWork["links"][number] =>
          object(link) && typeof link.label === "string" && typeof link.url === "string" &&
          /^https?:\/\//.test(link.url))
      : [];
    return [{
      title: str(item.title),
      slug: str(item.slug) || slug(str(item.title)),
      year: str(item.year),
      summary: str(item.summary),
      body: optional(item.body),
      role: optional(item.role),
      outcomes: strings(item.outcomes),
      tags: strings(item.tags),
      note: str(item.note),
      href: safeMediaUrl(item.href) ?? "#",
      repositoryUrl: safeMediaUrl(item.repositoryUrl),
      liveUrl: safeMediaUrl(item.liveUrl),
      links,
      image: safeMediaUrl(item.image),
      gallery: strings(item.gallery).flatMap(url => safeMediaUrl(url) ? [url] : []),
      showcase: parseShowcase(item.showcase),
      collectionId: optional(item.collectionId),
    }];
  });
  const experience: PortfolioExperience[] = payload.experience.flatMap((item: unknown) =>
    object(item) && str(item.company) ? [{
      company: str(item.company),
      role: str(item.role),
      period: str(item.period),
      description: str(item.description),
      highlights: strings(item.highlights),
      tags: strings(item.tags),
      accent: str(item.accent) || "#ffffff",
      image: safeMediaUrl(item.image),
      showcase: parseShowcase(item.showcase),
    }] : []);
  const posts: PortfolioPost[] = payload.posts.flatMap((item: unknown) =>
    object(item) && str(item.title) && str(item.body) ? [{
      title: str(item.title),
      slug: str(item.slug) || slug(str(item.title)),
      excerpt: str(item.excerpt),
      body: str(item.body),
      publishedAt: /^\d{4}-\d{2}-\d{2}/.test(str(item.publishedAt))
        ? new Date(str(item.publishedAt)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" })
        : str(item.publishedAt),
      tags: strings(item.tags),
      heroImage: optional(item.heroImage),
      placeholder: item.placeholder === true,
      collectionId: optional(item.collectionId),
    }] : []);
  const collections: PortfolioCollection[] = payload.collections.flatMap((item: unknown) =>
    object(item) && str(item.title) && (item.section === "projects" || item.section === "blog") ? [{
      id: str(item.key) || str(item.id) || str(item.slug),
      title: str(item.title),
      slug: str(item.slug) || slug(str(item.title)),
      section: item.section,
      description: str(item.description),
      order: typeof item.order === "number" ? item.order : 999,
      image: optional(item.image),
    }] : []);

  if (workItems.length !== payload.work.length || experience.length !== payload.experience.length ||
      posts.length !== payload.posts.length || collections.length !== payload.collections.length) {
    throw new Error("Atlas portfolio API contains an invalid published entry.");
  }

  return {
    hero: {
      firstName: str(hero.firstName),
      lastName: str(hero.lastName),
      tagline: str(hero.tagline),
      description: str(hero.description),
      cvUrl: optional(hero.cvUrl),
      portraitUrl: safeMediaUrl(hero.portraitUrl),
    },
    contact: {
      email: str(contact.email),
      responseTime: str(contact.responseTime),
      githubUrl: str(contact.githubUrl),
      linkedinUrl: str(contact.linkedinUrl),
    },
    workItems: sortByMostRecentYear(workItems),
    experience,
    posts,
    collections: collections.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title)),
  };
}

// Atlas is the only content provider. Fail visibly rather than silently serving stale data.
// No-store is intentional: newly published Atlas changes should be testable immediately.
export async function getPortfolioContent(): Promise<PortfolioContent> {
  const url = process.env.ATLAS_PORTFOLIO_URL || DEFAULT_ATLAS_URL;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("ATLAS_PORTFOLIO_URL is not a valid URL.");
  }
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
    throw new Error("ATLAS_PORTFOLIO_URL must be HTTPS (except localhost).");
  }

  let response: Response;
  try {
    response = await fetch(parsed, { cache: "no-store", signal: AbortSignal.timeout(8000) });
  } catch (error) {
    throw new Error("Could not reach the Atlas portfolio API.", { cause: error });
  }
  if (!response.ok) {
    throw new Error(`Atlas portfolio API returned HTTP ${response.status}.`);
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new Error("Atlas portfolio API returned invalid JSON.");
  }
  return mapContent(payload);
}
