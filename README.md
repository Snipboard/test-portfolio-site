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

## Atlas showcase configuration

The public site now opens directly in the XMB; its old mode and PSP theme preferences are no longer read. The Projects and Experience stores have an optional `showcase` object. Atlas owns each
entry's palette, layout (`media-led`, `editorial`, `immersive`, `minimal`), motif,
motion style, image fit and position, and `artworkAssetId` / `backgroundAssetId`.
The Portfolio editor exposes these choices and Atlas MCP can set the same object with
`save_portfolio_draft`. The public portfolio response resolves active image IDs to
`artworkUrl` and `backgroundUrl`; it does not expose asset IDs. The website validates
all values and falls back to one graphite environment when metadata is absent.

The four project and two experience entries have showcase configuration in their
Atlas drafts. They remain unpublished. Deploy the Atlas server and editor changes
first, then the portfolio site. Review the migrated content and media against
Contentful before publishing the existing Atlas records. The current published
inventory check (4 projects, 2 roles, 4 posts, 4 collections) and Contentful
fallback remain in place until the cutover is complete.
