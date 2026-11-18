# Business Valuation Calculator — Aspen Valuations

A three-step lead generation calculator that produces an indicative business
valuation range from EBITDA, industry and business profile. Built to the
specification in [docs/](docs/).

All calculation happens in the browser. No contact details are collected — users
provide those on the Aspen contact page via the result CTAs.

Step 1 links owners who do not know their EBITDA to the companion
[Adjusted EBITDA Calculator](https://adjusted-ebitda-calculator.vercel.app),
opened in a new tab so they can come back and enter the figure. Its URL is
`EBITDA_CALCULATOR_URL` in [`src/components/Calculator.tsx`](src/components/Calculator.tsx).

## Calculation

```
adjusted multiple = industry multiple × (1 + profile adjustment)

low  = EBITDA × adjusted low multiple
high = EBITDA × adjusted high multiple
```

**Industry multiples** (Canadian market, $5M–$20M EBITDA band):

| Industry                        |  Low |  High |
| ------------------------------- | ---: | ----: |
| Manufacturing & Industrial      | 4.0× |  6.5× |
| Construction & Trades           | 4.0× |  5.5× |
| Distribution & Logistics        | 4.5× |  6.5× |
| Business Services & Professional| 4.5× |  6.5× |
| Healthcare & Medical            | 5.5× |  8.0× |
| Food, Beverage & Hospitality    | 3.5× |  5.0× |
| Technology & Software           | 6.5× |  9.0× |
| Other                           | 4.0× |  5.5× |

**Profile adjustments**: growing `+20%`, stable `0%`, owner-dependent `-25%`,
mixed `-10%`.

Both tables live in [`src/lib/valuation.ts`](src/lib/valuation.ts) and can be
revised without touching the calculation code.

## Verified against the spec's test scenarios

| Scenario                  | EBITDA | Industry / Profile              | Spec expects   | This build      |
| ------------------------- | -----: | ------------------------------- | -------------- | --------------- |
| Growing Tech SaaS         |  $500K | Technology / Growing            | $3.9M–$5.4M    | $3.9M–$5.4M ✓   |
| Hospitality (Mixed)       |  $400K | Food & Beverage / Mixed         | $1.26M–$1.8M   | $1.26M–$1.8M ✓  |
| Owner-Dependent Services  |  $750K | Business Services / Owner-dep.  | $2.5M–$3.7M    | $2.53M–$3.66M ✓ |
| Small Stable Manufacturing|  $250K | Manufacturing / Stable          | $750K–$1.6M    | $1M–$1.63M ⚠    |

The third row differs only in rounding. The fourth row is a discrepancy in the
spec itself: its expected low of $750K is `$250K × 3.0×`, which is the
manufacturing low multiple with the **owner-dependent** −25% adjustment applied,
but the scenario specifies the **stable** profile (0% adjustment). The formula
as written in the spec gives `$250K × 4.0× = $1M`. This build follows the
formula; confirm with Aspen which is intended.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- No backend, no environment variables

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Project structure

```
src/
  app/
    layout.tsx           # fonts, metadata
    page.tsx             # hero, calculator, how it works, multiples, value drivers
    embed/page.tsx       # the calculator alone, for the iframe on aspenval.com
    globals.css          # Aspen brand tokens
  components/
    Calculator.tsx       # 3-step form, step indicator, validation
    ValuationResults.tsx # range, breakdown, industry insight, CTAs, disclaimer
    EmbedRoot.tsx        # reports the embed's height to the host page
    SiteHeader.tsx, SiteFooter.tsx, AspenLogo.tsx
  lib/
    valuation.ts         # industries, profiles, multiples, formula, formatting
    insights.ts          # 8 industries × 4 profiles = 32 context insights
    embed.ts             # message names shared with the host snippet
next.config.ts           # frame-ancestors: who may embed the site
```

## Embedding on aspenval.com

`/embed` shows only the calculator card, with no header, sections or footer,
for an Elementor HTML widget on aspenval.com. It is set up so that:

- **Only Aspen can frame it.** `next.config.ts` sends
  `Content-Security-Policy: frame-ancestors 'self' https://aspenval.com https://www.aspenval.com`
  on every page. Add a domain there if Aspen ever previews pages elsewhere.
- **The frame fits the content.** `EmbedRoot` posts the card's height to the
  parent page whenever it changes; the snippet below resizes the iframe, so it
  never shows an inner scrollbar.
- **Links leave the frame.** The contact buttons use `target="_top"` and the
  EBITDA calculator link opens a new tab.
- **Scrolling is the host's job.** On each step change the embed asks the host
  to bring the frame into view, instead of scrolling the host page itself.

The snippet to paste into the Elementor HTML widget:

```html
<iframe
  id="aspen-valuation-calculator"
  src="https://calculator.aspenval.com/embed"
  title="Business Valuation Calculator"
  style="display:block;width:100%;height:700px;border:0"
></iframe>
<script>
  (function () {
    var ORIGIN = "https://calculator.aspenval.com";
    var frame = document.getElementById("aspen-valuation-calculator");

    window.addEventListener("message", function (event) {
      if (event.origin !== ORIGIN || event.source !== frame.contentWindow) return;
      var data = event.data || {};
      if (data.type === "aspen-calculator:height" && data.height > 0) {
        frame.style.height = data.height + "px";
      } else if (data.type === "aspen-calculator:navigate") {
        // New step: bring the top of the calculator into view, clear of a sticky header.
        var top = frame.getBoundingClientRect().top;
        if (top < 100) window.scrollBy({ top: top - 100, behavior: "smooth" });
      }
    });

    frame.addEventListener("load", function () {
      frame.contentWindow.postMessage({ type: "aspen-calculator:request-height" }, ORIGIN);
    });
  })();
</script>
```

The message names match `EMBED_MESSAGES` in [`src/lib/embed.ts`](src/lib/embed.ts).
If the calculator moves to another domain, update `ORIGIN` and `src` together.

## Outstanding items

- **Insight copy** — the 32 industry/profile insights in
  [`src/lib/insights.ts`](src/lib/insights.ts) are written to the spec's
  template and need review by Aspen's valuation team before launch.
- **Brand logo** — [`src/components/AspenLogo.tsx`](src/components/AspenLogo.tsx)
  uses the official PNG at `public/aspen-logo.png`. The white footer version
  (`public/aspen-logo-white.png`) was recoloured from it; swap in Aspen's own
  reversed logo, and an SVG of both, if available.
- **CBV stamp** — the footer submark is a placeholder; replace with the official
  stamp at `public/cbv-stamp.svg`.
- **Typography** — DIN Next LT Pro is first in the font stack, with Barlow as
  the free web fallback and Arial last. Self-host the licensed files under
  `public/fonts/` to use the real brand face.
- **Analytics** — step completion and abandonment tracking is not wired up yet
  (listed as "consider" in the spec).

## Deployment

Push to GitHub and import the repository into Vercel. No build configuration or
environment variables are required.
