"use client";

import { getInsight } from "@/lib/insights";
import {
  formatAdjustment,
  formatAppliedMultiple,
  formatCurrency,
  formatMultiple,
  formatValuation,
  type Valuation,
} from "@/lib/valuation";

const CONTACT_URL = "https://aspenval.com/ca/contact-us/";

function BreakdownRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-line py-3 last:border-b-0">
      <dt className="text-sm text-charcoal/60">{label}</dt>
      <dd className="text-right font-semibold text-forest">{value}</dd>
    </div>
  );
}

export function ValuationResults({
  valuation,
  onStartOver,
}: {
  valuation: Valuation;
  onStartOver: () => void;
}) {
  const insight = getInsight(valuation);

  return (
    <div className="animate-fade-up">
      {/* Component A — valuation range */}
      <div className="text-center">
        <p className="eyebrow text-teal">Know your worth</p>
        <h2 className="mt-3 text-3xl font-bold text-forest sm:text-4xl">
          Your indicative valuation range
        </h2>

        <p className="mt-8 text-4xl leading-tight font-bold text-teal sm:text-6xl">
          {formatValuation(valuation.low)}
          <span className="px-3 text-charcoal/30">to</span>
          {formatValuation(valuation.high)}
        </p>

        <p className="mt-4 text-sm text-charcoal/60">
          Based on EBITDA multiple methodology
        </p>
      </div>

      {/* Component B — calculation breakdown */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-bone p-6 sm:p-7">
          <h3 className="eyebrow text-charcoal/45">How we got there</h3>
          <dl className="mt-4">
            <BreakdownRow
              label="EBITDA"
              value={formatCurrency(valuation.ebitda)}
            />
            <BreakdownRow label="Industry" value={valuation.industry.name} />
            <BreakdownRow
              label="Industry multiple range"
              value={`${formatMultiple(valuation.industry.lowMultiple)} – ${formatMultiple(
                valuation.industry.highMultiple,
              )}`}
            />
            <BreakdownRow
              label="Business profile adjustment"
              value={formatAdjustment(valuation.profile.adjustment)}
            />
            <BreakdownRow
              label="Applied multiple range"
              value={`${formatAppliedMultiple(
                valuation.adjustedLowMultiple,
              )} – ${formatAppliedMultiple(valuation.adjustedHighMultiple)}`}
            />
          </dl>
        </div>

        {/* Component C — industry context */}
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
          <h3 className="eyebrow text-charcoal/45">
            What this means in {valuation.industry.shortName}
          </h3>
          <p className="mt-4 leading-relaxed text-charcoal/75">{insight}</p>
        </div>
      </div>

      {/* Component D — calls to action */}
      <div className="mt-10 rounded-2xl bg-forest px-6 py-10 text-center sm:px-10">
        <h3 className="text-2xl font-bold text-white sm:text-3xl">
          A range is a starting point. A valuation is evidence.
        </h3>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/70">
          Talk through what sits behind your number with a Chartered Business
          Valuator, and what it would take to move the top of that range.
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={CONTACT_URL}
            className="rounded-full bg-teal px-8 py-3.5 font-semibold text-white transition hover:bg-teal-dark"
          >
            Book a consultation
          </a>
          <a
            href={CONTACT_URL}
            className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition hover:border-teal hover:text-teal"
          >
            Request a quote
          </a>
        </div>

        <button
          type="button"
          onClick={onStartOver}
          className="mt-6 text-sm font-semibold text-white/60 underline-offset-4 transition hover:text-teal hover:underline"
        >
          Start over
        </button>
      </div>

      {/* Component E — disclaimer */}
      <p className="mt-8 text-center text-xs leading-relaxed text-charcoal/50">
        Indicative only. Not a formal valuation opinion. This calculator
        provides an estimate based on industry multiples and should not be
        relied upon as a professional valuation. A formal valuation by a
        Chartered Business Valuator considers many more factors and is required
        for legal, tax, or transaction purposes.
      </p>
    </div>
  );
}
