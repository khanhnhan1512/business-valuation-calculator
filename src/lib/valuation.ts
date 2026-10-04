export type IndustryId =
  | "manufacturing"
  | "construction"
  | "distribution"
  | "services"
  | "healthcare"
  | "hospitality"
  | "technology"
  | "other";

export type ProfileId = "growing" | "stable" | "owner-dependent" | "mixed";

export interface Industry {
  id: IndustryId;
  name: string;
  /** Short label used in the results breakdown. */
  shortName: string;
  icon: string;
  lowMultiple: number;
  highMultiple: number;
}

export interface Profile {
  id: ProfileId;
  icon: string;
  label: string;
  /** Multiple adjustment, e.g. 0.2 = +20%. */
  adjustment: number;
}

/**
 * Industry multiples — Canadian market, $5M–$20M EBITDA band.
 * Source: docs/Business_Valuation_Calculator_Spec.docx.
 * These can be revised without touching the calculation code.
 */
export const INDUSTRIES: Industry[] = [
  {
    id: "manufacturing",
    name: "Manufacturing & Industrial",
    shortName: "Manufacturing",
    icon: "🏭",
    lowMultiple: 4,
    highMultiple: 6.5,
  },
  {
    id: "construction",
    name: "Construction & Trades",
    shortName: "Construction",
    icon: "🏗️",
    lowMultiple: 4,
    highMultiple: 5.5,
  },
  {
    id: "distribution",
    name: "Distribution & Logistics",
    shortName: "Distribution",
    icon: "🚚",
    lowMultiple: 4.5,
    highMultiple: 6.5,
  },
  {
    id: "services",
    name: "Business Services & Professional",
    shortName: "Business Services",
    icon: "💼",
    lowMultiple: 4.5,
    highMultiple: 6.5,
  },
  {
    id: "healthcare",
    name: "Healthcare & Medical",
    shortName: "Healthcare",
    icon: "🩺",
    lowMultiple: 5.5,
    highMultiple: 8,
  },
  {
    id: "hospitality",
    name: "Food, Beverage & Hospitality",
    shortName: "Food & Beverage",
    icon: "🍽️",
    lowMultiple: 3.5,
    highMultiple: 5,
  },
  {
    id: "technology",
    name: "Technology & Software",
    shortName: "Technology",
    icon: "💻",
    lowMultiple: 6.5,
    highMultiple: 9,
  },
  {
    id: "other",
    name: "Other",
    shortName: "Other",
    icon: "🧭",
    lowMultiple: 4,
    highMultiple: 5.5,
  },
];

/** Business quality profile adjustments, per the specification. */
export const PROFILES: Profile[] = [
  {
    id: "growing",
    icon: "📈",
    label: "Growing, strong team, recurring customers",
    adjustment: 0.2,
  },
  {
    id: "stable",
    icon: "➡️",
    label: "Stable, profitable, runs without me daily",
    adjustment: 0,
  },
  {
    id: "owner-dependent",
    icon: "👤",
    label: "Profitable but relies heavily on me",
    adjustment: -0.25,
  },
  {
    id: "mixed",
    icon: "⚖️",
    label: "Mixed profile, some growth and some challenges",
    adjustment: -0.1,
  },
];

export function getIndustry(id: IndustryId): Industry {
  const industry = INDUSTRIES.find((item) => item.id === id);
  if (!industry) throw new Error(`Unknown industry: ${id}`);
  return industry;
}

export function getProfile(id: ProfileId): Profile {
  const profile = PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`Unknown profile: ${id}`);
  return profile;
}

export interface Valuation {
  ebitda: number;
  industry: Industry;
  profile: Profile;
  /** Industry multiples after the profile adjustment is applied. */
  adjustedLowMultiple: number;
  adjustedHighMultiple: number;
  low: number;
  high: number;
}

/**
 * Indicative valuation range.
 *
 *   adjusted multiple = industry multiple x (1 + profile adjustment)
 *   low  = EBITDA x adjusted low multiple
 *   high = EBITDA x adjusted high multiple
 */
export function calculateValuation(
  ebitda: number,
  industryId: IndustryId,
  profileId: ProfileId,
): Valuation {
  const industry = getIndustry(industryId);
  const profile = getProfile(profileId);
  const factor = 1 + profile.adjustment;

  const adjustedLowMultiple = industry.lowMultiple * factor;
  const adjustedHighMultiple = industry.highMultiple * factor;

  return {
    ebitda,
    industry,
    profile,
    adjustedLowMultiple,
    adjustedHighMultiple,
    low: ebitda * adjustedLowMultiple,
    high: ebitda * adjustedHighMultiple,
  };
}

/** "$1.5M" above a million, "$750K" below it. */
export function formatValuation(amount: number): string {
  // Decide on the rounded thousands so 999,900 reads "$1M", not "$1,000K".
  const thousands = Math.round(amount / 1000);

  if (thousands >= 1000) {
    const millions = amount / 1_000_000;
    const decimals = millions >= 10 ? 1 : 2;
    const text = millions
      .toFixed(decimals)
      .replace(/\.0+$/, "")
      .replace(/(\.\d)0$/, "$1");
    return `$${text}M`;
  }

  return `$${thousands.toLocaleString("en-CA")}K`;
}

/** "$500,000" — used for echoing the EBITDA back in the breakdown. */
export function formatCurrency(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-CA")}`;
}

/** "4.0×" — one decimal, as shown in the specification's examples. */
export function formatMultiple(multiple: number): string {
  return `${multiple.toFixed(1)}×`;
}

/**
 * Adjusted multiples carry a second decimal where they need one (4.875 ->
 * "4.88×"), so the range shown on the results page reconciles with the
 * valuation figures beside it.
 */
export function formatAppliedMultiple(multiple: number): string {
  const text = multiple.toFixed(2).replace(/(\.\d)0$/, "$1");
  return `${text}×`;
}

export function formatAdjustment(adjustment: number): string {
  if (adjustment === 0) return "Baseline";
  const percent = Math.round(adjustment * 100);
  return `${percent > 0 ? "+" : ""}${percent}%`;
}
