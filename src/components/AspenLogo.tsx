/**
 * Placeholder brand lockup.
 *
 * Drop the official Aspen primary logo at `public/aspen-logo.svg` and swap this
 * component for an <Image /> when the asset is available — the sizing below is
 * already tuned for the header and footer.
 */
export function AspenLogo({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const wordmark = variant === "dark" ? "text-forest" : "text-white";
  const sub = variant === "dark" ? "text-charcoal/60" : "text-white/70";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        className="h-8 w-8 shrink-0"
        fill="none"
      >
        <path
          d="M16 2 30 30H2L16 2Z"
          className={variant === "dark" ? "fill-forest" : "fill-white"}
        />
        <path d="M16 11 23.5 26h-15L16 11Z" fill="#05B4C9" />
      </svg>
      <span className="leading-none">
        <span
          className={`block text-lg font-bold tracking-[0.14em] ${wordmark}`}
        >
          ASPEN
        </span>
        <span className={`block text-[0.65rem] tracking-[0.3em] ${sub}`}>
          VALUATIONS
        </span>
      </span>
    </span>
  );
}
