# Portfolio Site TEST

Live site: https://affankhan.dev/

## Content source: Atlas only

Atlas is the sole source of portfolio content. The site fetches published records
from the read-only public endpoint:

`https://atlas.affankhan.dev/api/public/portfolio`

Set the server-side `ATLAS_PORTFOLIO_URL` environment variable to override this URL
(for example, to test against a local Atlas server). No Atlas API credentials are
sent to the browser.

The home page, case studies and blog posts retrieve published Atlas content
at request time, with `cache: "no-store"`. Edits become visible once published
without rebuilding the portfolio. Draft records are never served by the public API.

**There is no fallback content provider.** An unavailable Atlas API or invalid
response throws a clear server error rather than silently displaying obsolete
portfolio information. To troubleshoot, check Atlas health, public API routing,
publication state and Vercel server logs.

## Atlas-managed showcase configuration

The XMB uses one neutral default theme. Each project's or experience's optional
`showcase` object in Atlas controls palette, layout (`media-led`, `editorial`,
`immersive`, `minimal`), motif, motion, artwork and background assets.

The Atlas public API resolves `artworkAssetId` and `backgroundAssetId` into
public `artworkUrl` and `backgroundUrl` fields. The frontend validates the
visual configuration and falls back to a neutral showcase when it is absent.

Manage projects, experience, blog posts, collections and publication through Atlas;
the portfolio repository contains rendering logic but no item-specific theme data.

## Verification

Run `npm run check` for lint, typecheck and tests, then `npm run build`.
The build does not need to contact Atlas because pages load data at request time.
