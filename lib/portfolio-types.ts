import type { ShowcaseConfig } from "./showcase.ts";

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
