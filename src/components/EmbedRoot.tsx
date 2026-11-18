"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { EMBED_MESSAGES, postToHost } from "@/lib/embed";

/**
 * Wraps the /embed page and keeps the host page's iframe the same height as
 * the content, so the frame grows and shrinks with each step and never shows
 * an inner scrollbar.
 */
export function EmbedRoot({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.parent === window) return;

    // Measure this wrapper rather than the document: <html> fills the iframe,
    // so the document height could never shrink back after a tall step.
    let lastHeight = 0;
    function reportHeight(force = false) {
      const height = Math.ceil(root!.getBoundingClientRect().height);
      if (force || height !== lastHeight) {
        lastHeight = height;
        postToHost({ type: EMBED_MESSAGES.height, height });
      }
    }

    function handleMessage(event: MessageEvent) {
      if (
        event.source === window.parent &&
        event.data?.type === EMBED_MESSAGES.requestHeight
      ) {
        reportHeight(true);
      }
    }

    // ResizeObserver catches font loads and width changes, but only fires when
    // the browser renders the frame, which it may postpone for a cross-origin
    // iframe. Step changes also re-measure straight after the DOM updates.
    const resizes = new ResizeObserver(() => reportHeight());
    resizes.observe(root);
    const mutations = new MutationObserver(() => reportHeight());
    mutations.observe(root, { childList: true, subtree: true });
    window.addEventListener("message", handleMessage);
    reportHeight(true);

    return () => {
      resizes.disconnect();
      mutations.disconnect();
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <div ref={rootRef} className="embed-root px-2 pt-2 pb-4">
      {children}
    </div>
  );
}
