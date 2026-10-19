import assert from "node:assert/strict";
import test from "node:test";

import { getFallbackPortfolioContent, getPortfolioContent } from "../lib/contentful.ts";

type JsonResponse = Record<string, unknown>;

const richText = (...paragraphs: string[]) => ({
  nodeType: "document",
  content: paragraphs.map((value) => ({
    nodeType: "paragraph",
    content: [{ nodeType: "text", value }],
  })),
});

const markedRichText = {
  nodeType: "document",
  content: [
    { nodeType: "heading-2", content: [{ nodeType: "text", value: "Introduction" }] },
    {
      nodeType: "paragraph",
      content: [
        { nodeType: "text", value: "Post " },
        { nodeType: "text", value: "body", marks: [{ type: "bold" }] },
        { nodeType: "text", value: " now", marks: [{ type: "italic" }] },
        { nodeType: "text", value: " code", marks: [{ type: "code" }, { type: "underline" }] },
        { nodeType: "text", value: " and " },
        { nodeType: "hyperlink", data: { uri: "https://example.com/post" }, content: [{ nodeType: "text", value: "a link" }] },
      ],
    },
    {
      nodeType: "unordered-list",
      content: [
        { nodeType: "list-item", content: [{ nodeType: "paragraph", content: [{ nodeType: "text", value: "One" }] }] },
        { nodeType: "list-item", content: [{ nodeType: "paragraph", content: [{ nodeType: "text", value: "Two" }] }] },
      ],
    },
    {
      nodeType: "ordered-list",
      content: [{ nodeType: "list-item", content: [{ nodeType: "paragraph", content: [{ nodeType: "text", value: "First" }] }] }],
    },
    { nodeType: "blockquote", content: [{ nodeType: "paragraph", content: [{ nodeType: "text", value: "Quoted" }] }] },
    { nodeType: "hr", content: [] },
  ],
};

function asset(id: string, url: string) {
  return { sys: { id }, fields: { file: { url } } };
}

function withContentfulEnvironment(run: () => Promise<void>) {
  return async () => {
    const previousSpace = process.env.CONTENTFUL_SPACE_ID;
    const previousToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
    const previousFetch = global.fetch;
    process.env.CONTENTFUL_SPACE_ID = "space-id";
    process.env.CONTENTFUL_DELIVERY_TOKEN = "delivery-token";

    try {
      await run();
    } finally {
      if (previousSpace === undefined) delete process.env.CONTENTFUL_SPACE_ID;
      else process.env.CONTENTFUL_SPACE_ID = previousSpace;
      if (previousToken === undefined) delete process.env.CONTENTFUL_DELIVERY_TOKEN;
      else process.env.CONTENTFUL_DELIVERY_TOKEN = previousToken;
      global.fetch = previousFetch;
    }
  };
}

test("returns safe fallback content without Contentful credentials", async () => {
  const previousSpace = process.env.CONTENTFUL_SPACE_ID;
  const previousToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
  const previousFetch = global.fetch;
  delete process.env.CONTENTFUL_SPACE_ID;
  delete process.env.CONTENTFUL_DELIVERY_TOKEN;
  global.fetch = async () => { throw new Error("fetch should not run"); };

  try {
    const content = await getPortfolioContent();
    assert.deepEqual(content, getFallbackPortfolioContent());
  } finally {
    if (previousSpace !== undefined) process.env.CONTENTFUL_SPACE_ID = previousSpace;
    if (previousToken !== undefined) process.env.CONTENTFUL_DELIVERY_TOKEN = previousToken;
    global.fetch = previousFetch;
  }
});

test("maps a complete Contentful portfolio response", withContentfulEnvironment(async () => {
  const responses: Record<string, JsonResponse> = {
    portfolioHero: {
      items: [{ fields: { firstName: "Test", lastName: "Person", tagline: "Engineer", description: richText("Line one", "Line two"), cv: { sys: { id: "cv" } } } }],
      includes: { Asset: [asset("cv", "//assets.example/cv.pdf")] },
    },
    portfolioContact: {
      items: [{ fields: { email: "test@example.com", responseTime: "Soon", githubUrl: "https://github.com/test", linkedinUrl: "https://linkedin.com/in/test" } }],
    },
    workItem: {
      items: [
        { fields: { title: "Older App", year: "2020-2022", summary: "Older", tags: "TypeScript, React", url: "https://older.example", collection: { sys: { id: "apps" } } } },
        { fields: {
          title: "Newest App!", year: "2023-2026", summary: "Newest", body: richText("Body one", "Body two"),
          note: "Live", image: { sys: { id: "cover" } }, gallery: [{ sys: { id: "gallery-one" } }, { sys: { id: "gallery-two" } }],
          links: { items: [
            { label: "Website", url: "https://example.com", type: "website" },
            { label: "Bad protocol", url: "javascript:alert(1)", type: "website" },
            { label: "Malformed", url: "not a url", type: "website" },
            { label: "Unknown type", url: "https://example.com/more", type: "strange" },
          ] },
        } },
        { fields: { summary: "Missing title is discarded" } },
      ],
      includes: { Asset: [asset("cover", "//assets.example/cover.png"), asset("gallery-one", "https://assets.example/one.png"), asset("gallery-two", "//assets.example/two.png")] },
    },
    experienceItem: {
      items: [
        { fields: { company: "Company", role: "Engineer", period: "2025", description: "Built things", highlights: ["One", 2], tags: "Web, Performance", image: { sys: { id: "logo" } } } },
        { fields: { role: "Missing company" } },
      ],
      includes: { Asset: [asset("logo", "//assets.example/logo.png")] },
    },
    blogEntry: {
      items: [{ fields: { title: "Hello World", summary: "Fallback excerpt", content: markedRichText, date: "January 2026", tags: ["Engineering"], collection: { sys: { id: "notes" } }, heroImage: { sys: { id: "hero" } } } }],
      includes: { Asset: [asset("hero", "//assets.example/hero.png")] },
    },
    portfolioCollection: {
      items: [
        { sys: { id: "notes" }, fields: { title: "Notes", section: "blog", order: 2 } },
        { sys: { id: "apps" }, fields: { title: "Apps", section: "PROJECTS", order: 1, description: richText("Product work"), image: { sys: { id: "folder" } } } },
        { sys: { id: "invalid" }, fields: { title: "Invalid", section: "other" } },
      ],
      includes: { Asset: [asset("folder", "//assets.example/folder.png")] },
    },
  };
  const requestedTypes: string[] = [];
  global.fetch = (async (input) => {
    const url = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
    // Atlas-first probing must not be counted as a Contentful API request.
    if (url.hostname === "affan-atlas.duckdns.org") return new Response(null, { status: 503 });
    const contentType = url.searchParams.get("content_type") ?? "";
    requestedTypes.push(contentType);
    assert.equal(url.hostname, "cdn.contentful.com");
    assert.equal(url.searchParams.get("access_token"), "delivery-token");
    return new Response(JSON.stringify(responses[contentType]), { status: 200, headers: { "content-type": "application/json" } });
  }) as typeof fetch;

  const content = await getPortfolioContent();

  assert.equal(requestedTypes.length, 6);
  assert.equal(content.hero.description, "Line one\n\nLine two");
  assert.equal(content.hero.cvUrl, "https://assets.example/cv.pdf");
  assert.equal(content.contact.email, "test@example.com");
  assert.deepEqual(content.workItems.map((item) => item.title), ["Newest App!", "Older App"]);
  assert.equal(content.workItems[0].slug, "newest-app");
  assert.equal(content.workItems[0].body, "Body one\n\nBody two");
  assert.equal(content.workItems[0].image, "https://assets.example/cover.png");
  assert.deepEqual(content.workItems[0].gallery, ["https://assets.example/one.png", "https://assets.example/two.png"]);
  assert.deepEqual(content.workItems[0].links, [
    { label: "Website", url: "https://example.com", type: "website" },
    { label: "Unknown type", url: "https://example.com/more", type: undefined },
  ]);
  assert.deepEqual(content.workItems[1].tags, ["TypeScript", "React"]);
  assert.equal(content.workItems[1].collectionId, "apps");
  assert.equal(content.experience.length, 1);
  assert.deepEqual(content.experience[0].highlights, ["One"]);
  assert.equal(content.experience[0].image, "https://assets.example/logo.png");
  assert.equal(content.posts[0].excerpt, "Fallback excerpt");
  assert.equal(content.posts[0].body, "## Introduction\n\nPost **body** *now* `code` and [a link](https://example.com/post)\n\n- One\n- Two\n\n1. First\n\n> Quoted\n\n---");
  assert.equal(content.posts[0].publishedAt, "January 2026");
  assert.deepEqual(content.posts[0].tags, ["Engineering"]);
  assert.equal(content.posts[0].heroImage, "https://assets.example/hero.png");
  assert.equal(content.posts[0].collectionId, "notes");
  assert.deepEqual(content.collections.map((collection) => collection.id), ["apps", "notes"]);
  assert.equal(content.collections[0].section, "projects");
  assert.equal(content.collections[0].image, "https://assets.example/folder.png");
}));

test("falls back gracefully when Contentful requests fail", withContentfulEnvironment(async () => {
  global.fetch = (async () => new Response(null, { status: 503 })) as typeof fetch;

  const content = await getPortfolioContent();
  const fallback = getFallbackPortfolioContent();

  assert.deepEqual(content.hero, fallback.hero);
  assert.deepEqual(content.contact, fallback.contact);
  assert.deepEqual(content.workItems, []);
  assert.deepEqual(content.experience, fallback.experience);
  assert.deepEqual(content.posts, fallback.posts);
  assert.deepEqual(content.collections, []);
}));

test("falls back gracefully when the Contentful network request throws", withContentfulEnvironment(async () => {
  global.fetch = (async () => { throw new Error("network unavailable"); }) as typeof fetch;

  const content = await getPortfolioContent();
  assert.deepEqual(content.hero, getFallbackPortfolioContent().hero);
  assert.deepEqual(content.workItems, []);
}));
