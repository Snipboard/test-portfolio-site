import assert from "node:assert/strict";
import test from "node:test";
import { applyThemeVariables, getThemeStyle, hexToRgba, themes } from "../lib/theme.ts";
import { getPspThemeStyle } from "../components/psp/psp-showcase-style.ts";

test("uses one neutral XMB environment with optional Atlas colour values", () => {
  const neutral = getPspThemeStyle() as Record<string, string>;
  const selected = getPspThemeStyle({ accentColor: "#aa3311", backgroundColor: "#101820" }) as Record<string, string>;
  assert.equal(neutral["--psp-bg"], "#0c0d10");
  assert.equal(selected["--psp-accent"], "#aa3311");
  assert.equal(selected["--psp-bg"], "#101820");
});

test("creates and applies the classic site theme variables", () => {
  const style = getThemeStyle("dark") as Record<string, string>;
  const applied = new Map<string, string>();
  const declaration = { setProperty: (name: string, value: string) => applied.set(name, value) } as unknown as CSSStyleDeclaration;
  applyThemeVariables(declaration, "dark");
  assert.equal(style["--background"], themes.dark.background);
  assert.equal(applied.get("--background"), themes.dark.background);
  assert.equal(applied.size, 8);
});

test("converts short and long hex colours to rgba", () => {
  assert.equal(hexToRgba("#abc", 0.5), "rgba(170, 187, 204, 0.5)");
  assert.equal(hexToRgba("112233", 1), "rgba(17, 34, 51, 1)");
});
