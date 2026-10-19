"use client";

import { useEffect } from "react";

/** Keep a modest keyboard-only focus cue without sticky rings on activation. */
export function FocusNavigationIntent() {
  useEffect(() => {
    const root = document.documentElement;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        root.dataset.focusNavigation = "tab";
      } else if (!["Shift", "Control", "Alt", "Meta"].includes(event.key)) {
        root.removeAttribute("data-focus-navigation");
      }
    };
    const onPointerDown = () => root.removeAttribute("data-focus-navigation");

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      root.removeAttribute("data-focus-navigation");
    };
  }, []);

  return null;
}
