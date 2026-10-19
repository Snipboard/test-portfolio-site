import type { PortfolioContact } from "@/lib/portfolio-types";

interface XmbHeaderProps {
  name?: string;
  contact: PortfolioContact;
}

// The XMB category icons are locally defined SVGs, not a third-party icon
// package. Keep these self-contained too, using recognisable brand silhouettes.
function ContactIcon({ kind }: { kind: "mail" | "github" | "linkedin" }) {
  if (kind === "mail") {
    return (
      <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  const path = kind === "github"
    ? "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    : "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.94v5.666H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.139.92-2.063 2.063-2.063 1.14 0 2.065.924 2.065 2.063 0 1.139-.925 2.065-2.065 2.065ZM7.119 20.452H3.555V9H7.12v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.978 0 1.778-.773 1.778-1.729V1.729C24 .774 23.2 0 22.225 0Z";

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export function XmbContactLinks({ contact }: { contact: PortfolioContact }) {
  const links: { label: string; href: string; kind: "mail" | "github" | "linkedin" }[] = [];
  if (contact.email) links.push({ label: "Email", href: `mailto:${contact.email}`, kind: "mail" });
  if (/^https?:\/\//.test(contact.githubUrl)) links.push({ label: "GitHub", href: contact.githubUrl, kind: "github" });
  if (/^https?:\/\//.test(contact.linkedinUrl)) links.push({ label: "LinkedIn", href: contact.linkedinUrl, kind: "linkedin" });
  if (!links.length) return null;

  return (
    <nav aria-label="Contact and social links" className="flex shrink-0 items-center gap-0.5">
      {links.map(({ label, href, kind }) => (
        <a
          key={kind}
          href={href}
          aria-label={label}
          title={label}
          target={kind === "mail" ? undefined : "_blank"}
          rel={kind === "mail" ? undefined : "noopener noreferrer"}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--psp-accent)]"
        >
          <ContactIcon kind={kind} />
        </a>
      ))}
    </nav>
  );
}

export function XmbHeader({ name = "AFFAN KHAN", contact }: XmbHeaderProps) {
  return (
    <header className="psp-xmb-header absolute z-30 select-none">
      <span className="text-2xl font-semibold tracking-tight text-white">{name}</span>
      <div className="-ml-1.5 mt-1 w-fit">
        <XmbContactLinks contact={contact} />
      </div>
    </header>
  );
}
