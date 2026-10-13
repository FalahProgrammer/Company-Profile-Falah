"use client";

import { useEffect } from "react";

import { uniqueSelector } from "@/lib/studio/tutorial-selector";

/**
 * The CMS tutorial highlights elements of this editor too. The editor lives in
 * a cross-origin iframe, so the CMS asks where an element is and this answers
 * (and clicks a tab first, scrolls it into view); in the CMS's element picker
 * it lets the admin click an element here. Only the CMS origin is answered.
 * Protocol: the CMS's src/tutorial/messages.ts — keep in sync.
 */
const MEASURE = "falah-tutorial:measure";
const MEASURED = "falah-tutorial:measured";
const PICK = "falah-tutorial:pick";
const PICKED = "falah-tutorial:picked";

const visible = (el: Element) => {
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0;
};

/** Already selected (an active tab…): clicking it again may close it. Same rule as the CMS's isActive. */
function isActive(el: Element) {
  for (let node: Element | null = el, i = 0; node && i < 3; node = node.parentElement, i++) {
    if ([...node.classList].some((c) => /(--|-is-|^is-)(active|selected|open)(?![a-z])/i.test(c))) return true;
    if (["aria-selected", "aria-pressed", "aria-expanded"].some((a) => node!.getAttribute(a) === "true")) return true;
    if (node.getAttribute("aria-current") && node.getAttribute("aria-current") !== "false") return true;
  }
  return false;
}

function query(selector: string) {
  try {
    return [...document.querySelectorAll(selector)].filter(visible);
  } catch {
    return [];
  }
}

function rectOf(els: Element[]) {
  const rects = els.map((el) => el.getBoundingClientRect());
  const x = Math.min(...rects.map((r) => r.left));
  const y = Math.min(...rects.map((r) => r.top));
  return {
    x,
    y,
    width: Math.max(...rects.map((r) => r.right)) - x,
    height: Math.max(...rects.map((r) => r.bottom)) - y,
  };
}

export function useTutorialBridge(cmsUrl: string, enabled: boolean) {
  useEffect(() => {
    if (!enabled || window.parent === window) return;
    let cmsOrigin: string;
    try {
      cmsOrigin = new URL(cmsUrl).origin;
    } catch {
      return;
    }
    const reply = (data: object) => window.parent.postMessage(data, cmsOrigin);

    // Element picker: a highlight follows the mouse, a click answers with a selector.
    let hover: HTMLDivElement | null = null;
    const onMove = (event: MouseEvent) => {
      const el = document.elementFromPoint(event.clientX, event.clientY);
      if (!hover || !el || el === hover) return;
      const r = el.getBoundingClientRect();
      Object.assign(hover.style, {
        top: `${r.top - 4}px`,
        left: `${r.left - 4}px`,
        width: `${r.width + 8}px`,
        height: `${r.height + 8}px`,
      });
    };
    const block = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const onClick = (event: MouseEvent) => {
      block(event);
      reply({ type: PICKED, selector: uniqueSelector(event.target as Element) });
    };
    const picking = (on: boolean) => {
      if (on === Boolean(hover)) return;
      if (on) {
        hover = document.createElement("div");
        Object.assign(hover.style, {
          position: "fixed",
          zIndex: "2147483647",
          border: "2px solid #38bdf8",
          borderRadius: "8px",
          background: "rgb(56 189 248 / 0.12)",
          pointerEvents: "none",
          transition: "all 0.08s",
        });
        document.body.appendChild(hover);
        document.addEventListener("mousemove", onMove, true);
        document.addEventListener("pointerdown", block, true);
        document.addEventListener("mousedown", block, true);
        document.addEventListener("click", onClick, true);
      } else {
        hover?.remove();
        hover = null;
        document.removeEventListener("mousemove", onMove, true);
        document.removeEventListener("pointerdown", block, true);
        document.removeEventListener("mousedown", block, true);
        document.removeEventListener("click", onClick, true);
      }
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== cmsOrigin || event.source !== window.parent) return;
      const data = event.data as {
        type?: string;
        id?: string;
        selector?: string;
        click?: string;
        scroll?: boolean;
        on?: boolean;
      };
      if (data?.type === PICK) {
        picking(Boolean(data.on));
        return;
      }
      if (data?.type !== MEASURE || !data.selector) return;
      // `clicked`: the step's tab is open (now or already); `opening`: it was
      // just clicked and opens on the next frame, so it's measured on the CMS's next ask.
      let clicked = false;
      let opening = false;
      if (data.click) {
        const button = query(data.click)[0] as HTMLElement | undefined;
        if (button) {
          clicked = true;
          if (!isActive(button)) {
            button.click();
            opening = true;
          }
        }
      }
      const els = query(data.selector);
      if (els.length && data.scroll) {
        const r = els[0].getBoundingClientRect();
        if (r.top < 0 || r.bottom > window.innerHeight) els[0].scrollIntoView({ block: "center" });
      }
      reply({ type: MEASURED, id: data.id, rect: els.length && !opening ? rectOf(els) : null, clicked });
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      picking(false);
    };
  }, [cmsUrl, enabled]);
}
