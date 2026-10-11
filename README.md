# Business Valuation Calculator — Aspen Valuations

A three-step lead generation calculator that produces an indicative business
valuation range from EBITDA, industry and business profile. Built to the
specification in [docs/](docs/).

All calculation happens in the browser. No contact details are collected — users
provide those on the Aspen contact page via the result CTAs.

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
    globals.css          # Aspen brand tokens
  components/
    Calculator.tsx       # 3-step form, step indicator, validation
    ValuationResults.tsx # range, breakdown, industry insight, CTAs, disclaimer
    SiteHeader.tsx, SiteFooter.tsx, AspenLogo.tsx
  lib/
    valuation.ts         # industries, profiles, multiples, formula, formatting
    insights.ts          # 8 industries × 4 profiles = 32 context insights
```

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
