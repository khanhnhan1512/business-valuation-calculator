import type { Metadata } from "next";
import { Calculator } from "@/components/Calculator";
import { EmbedRoot } from "@/components/EmbedRoot";

export const metadata: Metadata = {
  // Same calculator as the home page; keep this bare copy out of search results.
  robots: { index: false, follow: false },
};

/**
 * The calculator on its own, for the iframe on aspenval.com. The host page
 * supplies its own header and footer.
 */
export default function EmbedPage() {
  return (
    <EmbedRoot>
      <Calculator embedded />
    </EmbedRoot>
  );
}
