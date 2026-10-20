import assert from "node:assert/strict";
import test from "node:test";

import { getPortfolioContent } from "../lib/atlas.ts";

const validPayload = {
  hero: { firstName: "Atlas", lastName: "User" },
  contact: { email: "atlas@example.com" },
  work: [],
  experience: [],
  posts: [],
  collections: [],
};

async function withMockAtlas(run: () => Promise<void>) {
  const originalFetch = global.fetch;
  const originalUrl = process.env.ATLAS_PORTFOLIO_URL;
  process.env.ATLAS_PORTFOLIO_URL = "https://atlas.example.test/api/public/portfolio";
  try {
    await run();
  } finally {
    global.fetch = originalFetch;
    if (originalUrl === undefined) delete process.env.ATLAS_PORTFOLIO_URL;
    else process.env.ATLAS_PORTFOLIO_URL = originalUrl;
  }
}

function mockPayload(payload: unknown) {
  global.fetch = (async () => new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "content-type": "application/json" },
  })) as typeof fetch;
}

test("generates missing slugs and sorts Atlas collections deterministically", async () => {
  await withMockAtlas(async () => {
    mockPayload({
      ...validPayload,
      work: [{
        title: "Football RL + Atlas!", summary: "Multi-agent learning", year: "2026",
        outcomes: ["Built a simulator", 3], tags: ["Unity", null],
        href: "javascript:alert(1)",
        gallery: ["https://example.com/valid.png", "javascript:alert(1)"],
        links: [
          { label: "Demo", url: "https://example.com/demo" },
          { label: "Unsafe", url: "javascript:alert(1)" },
        ],
      }],
      posts: [{ title: "Project Notes!", body: "A post", publishedAt: "Autumn 2026" }],
      collections: [
        { id: "zeta", title: "Zeta", section: "blog", order: 10 },
        { key: "games", title: "Games", section: "projects", order: 1 },
        { id: "alpha", title: "Alpha", section: "blog", order: 10 },
      ],
    });

    const content = await getPortfolioContent();
    assert.equal(content.workItems[0]?.slug, "football-rl-atlas");
    assert.deepEqual(content.workItems[0]?.outcomes, ["Built a simulator"]);
    assert.deepEqual(content.workItems[0]?.tags, ["Unity"]);
    assert.equal(content.workItems[0]?.href, "#");
    assert.deepEqual(content.workItems[0]?.gallery, ["https://example.com/valid.png"]);
    assert.deepEqual(content.workItems[0]?.links, [{ label: "Demo", url: "https://example.com/demo" }]);
    assert.equal(content.posts[0]?.slug, "project-notes");
    assert.equal(content.posts[0]?.publishedAt, "Autumn 2026");
    assert.deepEqual(content.collections.map(c => c.id), ["games", "alpha", "zeta"]);
    assert.deepEqual(content.collections.map(c => c.slug), ["games", "alpha", "zeta"]);
  });
});

test("rejects invalid published entries in all Atlas sections", async () => {
  await withMockAtlas(async () => {
    const cases = [
      { name: "missing profile name", payload: { ...validPayload, hero: { firstName: "", lastName: "User" } }, error: /missing a published profile/ },
      { name: "missing email", payload: { ...validPayload, contact: { email: "" } }, error: /missing a published profile/ },
      { name: "work missing summary", payload: { ...validPayload, work: [{ title: "Incomplete" }] }, error: /invalid published entry/ },
      { name: "experience missing company", payload: { ...validPayload, experience: [{ role: "Engineer" }] }, error: /invalid published entry/ },
      { name: "post missing body", payload: { ...validPayload, posts: [{ title: "Draft" }] }, error: /invalid published entry/ },
      { name: "unknown collection section", payload: { ...validPayload, collections: [{ title: "Other", section: "other" }] }, error: /invalid published entry/ },
      { name: "collection missing title", payload: { ...validPayload, collections: [{ section: "blog" }] }, error: /invalid published entry/ },
      { name: "missing array", payload: { ...validPayload, collections: null }, error: /invalid payload structure/ },
    ];

    for (const { name, payload, error } of cases) {
      mockPayload(payload);
      await assert.rejects(getPortfolioContent(), error, name);
    }
  });
});

test("rejects invalid or insecure Atlas endpoints without making requests", async () => {
  await withMockAtlas(async () => {
    let calls = 0;
    global.fetch = (async () => {
      calls++;
      return new Response(JSON.stringify(validPayload), { status: 200 });
    }) as typeof fetch;

    for (const url of ["not a url", "://invalid"]) {
      process.env.ATLAS_PORTFOLIO_URL = url;
      await assert.rejects(getPortfolioContent(), /not a valid URL/);
    }
    for (const url of ["http://atlas.example.test/portfolio", "ftp://atlas.example.test/portfolio"]) {
      process.env.ATLAS_PORTFOLIO_URL = url;
      await assert.rejects(getPortfolioContent(), /must be HTTPS/);
    }
    assert.equal(calls, 0);

    for (const url of ["http://localhost:3000/portfolio", "http://127.0.0.1:3000/portfolio"]) {
      process.env.ATLAS_PORTFOLIO_URL = url;
      assert.equal((await getPortfolioContent()).workItems.length, 0);
    }
    assert.equal(calls, 2);
  });
});
