/**
 * Messages between the /embed page and the snippet pasted on the host page.
 * The snippet lives in the README ("Embedding on aspenval.com"); keep the
 * names in sync with it.
 */
export const EMBED_MESSAGES = {
  /** Embed → host: the content's height in px, so the iframe can match it. */
  height: "aspen-calculator:height",
  /** Embed → host: the user moved to another step; bring the frame into view. */
  navigate: "aspen-calculator:navigate",
  /** Host → embed: please report your height again. */
  requestHeight: "aspen-calculator:request-height",
} as const;

export function postToHost(message: { type: string; height?: number }) {
  if (typeof window === "undefined" || window.parent === window) return;
  // Only a height and a scroll hint, nothing private, so any origin may
  // receive it. The host snippet checks the sender instead.
  window.parent.postMessage(message, "*");
}
