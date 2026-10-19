import assert from "node:assert/strict";
import test from "node:test";
import { NEUTRAL_SHOWCASE, parseShowcase, safeMediaUrl } from "../lib/showcase.ts";

test("accepts supported Atlas visual intent and safe media URLs", () => {
  assert.deepEqual(parseShowcase({
    accentColor: "#ed4147", backgroundColor: "#0c0e11", layout: "media-led",
    motif: "lines", motionStyle: "subtle", mediaFit: "contain",
    artworkUrl: "https://atlas.example.test/api/media/asset/preview",
    backgroundUrl: "/api/media/background/preview",
  }), {
    accentColor: "#ed4147", backgroundColor: "#0c0e11", layout: "media-led",
    motif: "lines", motionStyle: "subtle", mediaFit: "contain",
    artworkUrl: "https://atlas.example.test/api/media/asset/preview",
    backgroundUrl: "/api/media/background/preview",
  });
});

test("drops invalid fields without losing valid choices", () => {
  assert.deepEqual(parseShowcase({accentColor:"expression(alert(1))", layout:"editorial", motif:"unknown", artworkUrl:"javascript:alert(1)"}), {layout:"editorial"});
  assert.equal(parseShowcase({backgroundColor:"red", mediaFit:"fill", artworkUrl:"//evil.test/x"}), undefined);
  assert.equal(parseShowcase(null), undefined);
  assert.equal(safeMediaUrl("http://untrusted.test/media"), undefined);
  assert.equal(safeMediaUrl('/x");background:url(javascript:bad)'), undefined);
  assert.equal(NEUTRAL_SHOWCASE.backgroundColor, "#0c0d10");
});
