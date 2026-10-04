import { Calculator } from "@/components/Calculator";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { INDUSTRIES, PROFILES, formatMultiple } from "@/lib/valuation";

const STEPS = [
  {
    number: "01",
    title: "Tell us your annual profit",
    body: "Your EBITDA — earnings before interest, tax, depreciation and amortization. Net profit before tax plus your own salary is close enough to start.",
  },
  {
    number: "02",
    title: "Pick your industry",
    body: "Multiples vary widely by sector. We use ranges drawn from the current Canadian market rather than a single national average.",
  },
  {
    number: "03",
    title: "Describe the business",
    body: "Growth, stability and owner dependency move the multiple up or down. This is where most of the difference between two similar businesses comes from.",
  },
];

const DRIVERS = [
  {
    title: "Earnings quality",
    body: "Clean, consistent EBITDA with few add-backs. Buyers pay for earnings they can rely on, not earnings that need explaining.",
  },
  {
    title: "Transferability",
    body: "A business that runs without the owner is worth materially more than one that does not. It is the single largest adjustment in this calculator for a reason.",
  },
  {
    title: "Revenue durability",
    body: "Recurring contracts, repeat customers and low concentration. Durable revenue moves you toward the top of your industry range.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="top">
        {/* Hero */}
        <section className="relative overflow-hidden bg-forest">
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal/15 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-5 py-20 md:py-24">
            <div className="max-w-2xl">
              <p className="eyebrow text-teal">Business Valuation Calculator</p>
              <h1 className="mt-4 text-4xl leading-[1.08] font-bold text-white sm:text-5xl lg:text-6xl">
                What is your business worth?
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/75">
                Three questions and an indicative range, built from the EBITDA
                multiples businesses like yours are actually trading at in
                Canada today.
              </p>
              <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-2 text-sm text-white/60">
                <li>Takes about a minute</li>
                <li>No contact details required</li>
                <li>Calculated in your browser</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="scroll-mt-20 bg-bone">
          <div className="mx-auto max-w-4xl px-5 py-16 md:py-20">
            <Calculator />
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="eyebrow text-teal">How it works</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-forest sm:text-4xl">
              EBITDA multiples, adjusted for the business behind them
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.number} className="border-t-2 border-teal pt-5">
                  <span className="text-sm font-bold tracking-widest text-teal">
                    {step.number}
                  </span>
                  <h3 className="mt-2 text-xl font-bold text-forest">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-charcoal/70">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industry multiples */}
        <section id="multiples" className="scroll-mt-24 bg-forest">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="eyebrow text-teal">The underlying data</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-white sm:text-4xl">
              Industry multiples we use
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/70">
              Canadian market ranges for the $5M–$20M EBITDA band. Your business
              profile then adjusts these up or down.
            </p>

            <div className="mt-11 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div className="overflow-hidden rounded-2xl border border-white/12">
                {INDUSTRIES.map((industry, position) => (
                  <div
                    key={industry.id}
                    className={`flex items-center gap-4 px-6 py-4 ${
                      position % 2 === 0 ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <span aria-hidden="true" className="text-xl">
                      {industry.icon}
                    </span>
                    <span className="flex-1 text-white/85">
                      {industry.name}
                    </span>
                    <span className="font-bold text-teal">
                      {formatMultiple(industry.lowMultiple)} –{" "}
                      {formatMultiple(industry.highMultiple)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/12 p-6">
                <h3 className="eyebrow text-white/50">Profile adjustment</h3>
                <ul className="mt-5 space-y-4">
                  {PROFILES.map((profile) => (
                    <li key={profile.id} className="flex items-start gap-3">
                      <span aria-hidden="true" className="text-lg">
                        {profile.icon}
                      </span>
                      <span className="flex-1 text-sm leading-relaxed text-white/80">
                        {profile.label}
                      </span>
                      <span className="font-bold text-teal">
                        {profile.adjustment === 0
                          ? "—"
                          : `${profile.adjustment > 0 ? "+" : ""}${Math.round(
                              profile.adjustment * 100,
                            )}%`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* What drives value */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="eyebrow text-teal">Beyond the arithmetic</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold text-forest sm:text-4xl">
              What moves you within the range
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {DRIVERS.map((driver) => (
                <article
                  key={driver.title}
                  className="rounded-2xl border border-line bg-bone p-7"
                >
                  <h3 className="text-xl font-bold text-forest">
                    {driver.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-charcoal/70">
                    {driver.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-14 rounded-2xl bg-bone px-6 py-10 text-center sm:px-10">
              <p className="eyebrow text-teal">Know your worth</p>
              <h3 className="mt-3 text-2xl font-bold text-forest sm:text-3xl">
                Want the number you can actually rely on?
              </h3>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-charcoal/70">
                A formal valuation by a Chartered Business Valuator considers
                far more than industry multiples, and is what lenders, courts
                and the CRA will accept.
              </p>
              <a
                href="https://aspenval.com/ca/contact-us/"
                className="mt-7 inline-block rounded-full bg-teal px-9 py-4 font-semibold text-white transition hover:bg-teal-dark"
              >
                Talk to a valuator
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
