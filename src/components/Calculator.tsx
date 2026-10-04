"use client";

import { useMemo, useRef, useState } from "react";
import {
  INDUSTRIES,
  PROFILES,
  calculateValuation,
  formatCurrency,
  type IndustryId,
  type ProfileId,
} from "@/lib/valuation";
import { ValuationResults } from "./ValuationResults";

const TOTAL_STEPS = 3;
/** Below this the multiples are a poor guide, so we show a note (but allow it). */
const RECOMMENDED_MINIMUM = 50_000;

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-4">
        <span className="eyebrow text-teal">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-sm font-semibold text-charcoal/50">
          {["Annual profit", "Industry", "Business profile"][step - 1]}
        </span>
      </div>
      <div className="mt-3 flex gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, position) => (
          <div
            key={position}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              position < step ? "bg-teal" : "bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export function Calculator() {
  const [step, setStep] = useState(1);
  const [ebitdaInput, setEbitdaInput] = useState("");
  const [industry, setIndustry] = useState<IndustryId | null>(null);
  const [profile, setProfile] = useState<ProfileId | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep only digits so the field accepts "500,000" and "$500000" alike.
  const ebitda = Number(ebitdaInput.replace(/\D/g, ""));
  const ebitdaValid = ebitda > 0;

  const valuation = useMemo(
    () =>
      ebitdaValid && industry && profile
        ? calculateValuation(ebitda, industry, profile)
        : null,
    [ebitda, ebitdaValid, industry, profile],
  );

  function scrollToPanel() {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goTo(next: number) {
    setStep(next);
    scrollToPanel();
  }

  function handleEbitdaChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    setEbitdaInput(digits === "" ? "" : Number(digits).toLocaleString("en-CA"));
  }

  function handleStartOver() {
    setEbitdaInput("");
    setIndustry(null);
    setProfile(null);
    goTo(1);
  }

  return (
    <div
      ref={panelRef}
      className="scroll-mt-24 rounded-3xl border border-line bg-white p-6 shadow-[0_18px_60px_-30px_rgba(26,50,47,0.35)] sm:p-10"
    >
      {step === 1 ? (
        <div className="animate-fade-up">
          <StepIndicator step={1} />

          <h2 className="text-2xl leading-snug font-bold text-forest sm:text-3xl">
            What is your annual profit?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
            Enter your EBITDA (earnings before interest, tax, depreciation, and
            amortization). If unsure, use net profit before tax plus your
            salary.
          </p>

          <div className="mt-8">
            <label
              htmlFor="ebitda"
              className="eyebrow block text-charcoal/50"
            >
              Annual EBITDA
            </label>
            <div className="mt-3 flex items-center rounded-xl border border-line bg-white transition focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/25">
              <span className="pl-5 text-2xl font-bold text-charcoal/40">$</span>
              <input
                id="ebitda"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={ebitdaInput}
                onChange={(event) => handleEbitdaChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && ebitdaValid) goTo(2);
                }}
                placeholder="500,000"
                aria-describedby="ebitda-hint"
                className="w-full bg-transparent px-3 py-4 text-2xl font-bold text-forest outline-none placeholder:font-normal placeholder:text-charcoal/25"
              />
            </div>
            <p
              id="ebitda-hint"
              className={`mt-3 text-sm ${
                ebitdaValid && ebitda < RECOMMENDED_MINIMUM
                  ? "text-forest"
                  : "text-charcoal/55"
              }`}
            >
              {!ebitdaValid
                ? "Enter a figure above zero. $50,000 or more gives the most meaningful result."
                : ebitda < RECOMMENDED_MINIMUM
                  ? "Below $50,000 these industry multiples are a rough guide at best — treat the result with caution."
                  : `Using ${formatCurrency(ebitda)} as annual EBITDA.`}
            </p>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => goTo(2)}
              disabled={!ebitdaValid}
              className="rounded-full bg-teal px-8 py-3 font-semibold text-white transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:bg-charcoal/20"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="animate-fade-up">
          <StepIndicator step={2} />

          <h2 className="text-2xl leading-snug font-bold text-forest sm:text-3xl">
            What industry are you in?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
            Different industries trade at different valuations in the current
            Canadian market.
          </p>

          <fieldset className="mt-7">
            <legend className="sr-only">Industry</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {INDUSTRIES.map((item) => {
                const isSelected = industry === item.id;
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      isSelected
                        ? "border-teal bg-teal-soft shadow-[0_0_0_1px_var(--color-teal)]"
                        : "border-line bg-white hover:border-teal/50 hover:bg-bone"
                    }`}
                  >
                    <input
                      type="radio"
                      name="industry"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setIndustry(item.id)}
                    />
                    <span aria-hidden="true" className="text-2xl">
                      {item.icon}
                    </span>
                    <span className="font-semibold text-forest">
                      {item.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => goTo(1)}
              className="text-sm font-semibold text-charcoal/60 transition hover:text-teal"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => goTo(3)}
              disabled={!industry}
              className="rounded-full bg-teal px-8 py-3 font-semibold text-white transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:bg-charcoal/20"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="animate-fade-up">
          <StepIndicator step={3} />

          <h2 className="text-2xl leading-snug font-bold text-forest sm:text-3xl">
            How would you describe the business?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
            Pick the option that best fits. This affects how buyers value the
            business.
          </p>

          <fieldset className="mt-7">
            <legend className="sr-only">Business profile</legend>
            <div className="space-y-3">
              {PROFILES.map((item) => {
                const isSelected = profile === item.id;
                return (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                      isSelected
                        ? "border-teal bg-teal-soft shadow-[0_0_0_1px_var(--color-teal)]"
                        : "border-line bg-white hover:border-teal/50 hover:bg-bone"
                    }`}
                  >
                    <input
                      type="radio"
                      name="profile"
                      className="sr-only"
                      checked={isSelected}
                      onChange={() => setProfile(item.id)}
                    />
                    <span aria-hidden="true" className="text-2xl">
                      {item.icon}
                    </span>
                    <span className="font-semibold text-forest">
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => goTo(2)}
              className="text-sm font-semibold text-charcoal/60 transition hover:text-teal"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => goTo(4)}
              disabled={!profile}
              className="rounded-full bg-teal px-8 py-3 font-semibold text-white transition hover:bg-teal-dark disabled:cursor-not-allowed disabled:bg-charcoal/20"
            >
              See my valuation
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 && valuation ? (
        <ValuationResults valuation={valuation} onStartOver={handleStartOver} />
      ) : null}
    </div>
  );
}
