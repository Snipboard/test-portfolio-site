https://affankhan-dev.vercel.app/

## Content source: Atlas migration

Portfolio pages use `getPortfolioContent()` in `lib/contentful.ts`. That function
now checks the read-only Atlas API first:
`https://affan-atlas.duckdns.org/api/public/portfolio`.
Override the URL with the server-side `ATLAS_PORTFOLIO_URL` environment variable.
The Atlas response is mapped to the existing UI types without changing the design.

Contentful remains a temporary fallback while migration is incomplete or Atlas
cannot be reached. The Atlas switch-over guard requires the published 18 October
2026 inventory: profile, contact, 4 projects, 2 experiences, 4 posts and
4 collections. Do not remove the fallback until content and media have been
verified against the existing site.

The initial Contentful CSV contained only entry names/types/statuses; its 16
Atlas draft shells are **not** the full content. Export the actual Contentful
entry fields, rich-text bodies, asset files and collection references, then
populate and publish the existing Atlas drafts (avoid creating duplicates).
