export default function BrandLogo({ className = "h-9 w-auto" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-full w-auto brand-logo-spin" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="verdexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.58 0.24 258)" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 230)" />
          </linearGradient>
        </defs>
        {/* Refined geometric V — two angled facets forming a sharp apex */}
        <path
          d="M4 6 L18 30 L20 26 L8 6 Z"
          fill="url(#verdexGradient)"
        />
        <path
          d="M36 6 L22 30 L20 26 L32 6 Z"
          fill="url(#verdexGradient)"
          opacity="0.55"
        />
        <circle cx="20" cy="33" r="2.4" fill="url(#verdexGradient)" />
      </svg>
      <span className="font-sans font-bold text-xl tracking-tight text-foreground">
        Verdex<span style={{ background: "linear-gradient(90deg, oklch(0.52 0.22 258), oklch(0.55 0.18 230))", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>AI</span>
      </span>
    </div>
  );
}