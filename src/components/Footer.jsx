// src/components/Footer.jsx
import { useTheme } from "../context/ThemeContext";

// Host cities data
const HOST_CITIES = [
  {
    city: "New York / New Jersey",
    country: "USA",
    flag: "🇺🇸",
    venue: "MetLife Stadium",
    capacity: "82,500",
  },
  {
    city: "Los Angeles",
    country: "USA",
    flag: "🇺🇸",
    venue: "SoFi Stadium",
    capacity: "70,240",
  },
  {
    city: "Dallas",
    country: "USA",
    flag: "🇺🇸",
    venue: "AT&T Stadium",
    capacity: "80,000",
  },
  {
    city: "San Francisco",
    country: "USA",
    flag: "🇺🇸",
    venue: "Levi's Stadium",
    capacity: "68,500",
  },
  {
    city: "Miami",
    country: "USA",
    flag: "🇺🇸",
    venue: "Hard Rock Stadium",
    capacity: "65,326",
  },
  {
    city: "Seattle",
    country: "USA",
    flag: "🇺🇸",
    venue: "Lumen Field",
    capacity: "69,000",
  },
  {
    city: "Boston",
    country: "USA",
    flag: "🇺🇸",
    venue: "Gillette Stadium",
    capacity: "65,878",
  },
  {
    city: "Kansas City",
    country: "USA",
    flag: "🇺🇸",
    venue: "Arrowhead Stadium",
    capacity: "76,416",
  },
  {
    city: "Atlanta",
    country: "USA",
    flag: "🇺🇸",
    venue: "Mercedes-Benz Stadium",
    capacity: "71,000",
  },
  {
    city: "Philadelphia",
    country: "USA",
    flag: "🇺🇸",
    venue: "Lincoln Financial Field",
    capacity: "69,176",
  },
  {
    city: "Houston",
    country: "USA",
    flag: "🇺🇸",
    venue: "NRG Stadium",
    capacity: "72,220",
  },
  {
    city: "Vancouver",
    country: "CAN",
    flag: "🇨🇦",
    venue: "BC Place",
    capacity: "54,500",
  },
  {
    city: "Toronto",
    country: "CAN",
    flag: "🇨🇦",
    venue: "BMO Field",
    capacity: "45,000",
  },
  {
    city: "Mexico City",
    country: "MEX",
    flag: "🇲🇽",
    venue: "Estadio Azteca",
    capacity: "87,523",
  },
  {
    city: "Guadalajara",
    country: "MEX",
    flag: "🇲🇽",
    venue: "Estadio Akron",
    capacity: "49,850",
  },
  {
    city: "Monterrey",
    country: "MEX",
    flag: "🇲🇽",
    venue: "Estadio BBVA",
    capacity: "53,500",
  },
];

// Quick nav links — mirrors the Navbar
const NAV_LINKS = [
  { label: "Fixtures", href: "#fixtures" },
  { label: "Standings", href: "#standings" },
  { label: "Knockout", href: "#knockout" },
  { label: "Scorers", href: "#scorers" },
];

// Tournament key facts
const KEY_FACTS = [
  { value: "48", label: "Teams" },
  { value: "104", label: "Matches" },
  { value: "16", label: "Host Cities" },
  { value: "3", label: "Host Nations" },
];
const scrollTo = (href) => {
  const el = document.querySelector(href);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 68;
  window.scrollTo({ top, behavior: "smooth" });
};
export default function Footer() {
  const { theme, toggleTheme } = useTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      <div className="container-main">
        {/* ── Top grid ────────────────────────────── */}
        <div
          className={[
            "grid gap-12",
            "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
            "mb-12",
          ].join(" ")}
        >
          {/* ── Col 1: Brand ────────────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div>
              <p className="footer-logo">
                ⚽ FIFA <span>2026</span>
              </p>
              <p className="text-text-muted text-sm mt-2 leading-relaxed">
                Your companion for the FIFA World Cup 2026 — hosted across USA,
                Canada and Mexico.
              </p>
            </div>

            {/* Key facts */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {KEY_FACTS.map(({ value, label }) => (
                <div
                  key={label}
                  className={[
                    "card py-3 px-3 flex flex-col items-center",
                    "text-center gap-0.5",
                  ].join(" ")}
                >
                  <span className="font-heading font-black text-xl text-accent tabular-nums">
                    {value}
                  </span>
                  <span className="text-text-muted text-xs">{label}</span>
                </div>
              ))}
            </div>

            {/* Theme toggle */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-text-muted text-xs">Theme:</span>
              <button
                onClick={toggleTheme}
                className="theme-toggle"
                aria-label={
                  theme === "electric"
                    ? "Switch to Bold & Vivid theme"
                    : "Switch to Dark & Electric theme"
                }
                aria-pressed={theme === "vivid"}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "text-xl transition-all duration-300 select-none",
                    theme === "vivid"
                      ? "drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]"
                      : "opacity-80",
                  ].join(" ")}
                >
                  ⚽
                </span>
              </button>
              <span className="text-text-muted text-xs">
                {theme === "electric" ? "Dark & Electric" : "Bold & Vivid"}
              </span>
            </div>
          </div>

          {/* ── Col 2: Navigation ───────────────────── */}
          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            <p className="text-text-primary font-heading font-bold text-sm uppercase tracking-wider">
              Navigate
            </p>
            <ul className="flex flex-col gap-2" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(href);
                    }}
                    className={[
                      "text-text-secondary text-sm",
                      "hover:text-accent transition-colors duration-150",
                      "flex items-center gap-2 group",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "text-text-muted group-hover:text-accent",
                        "transition-colors duration-150",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      →
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className={[
                "flex items-center gap-2 mt-4",
                "text-text-muted text-sm",
                "hover:text-accent transition-colors duration-150",
                "group w-fit",
              ].join(" ")}
              aria-label="Scroll back to top of page"
            >
              <span
                className={[
                  "group-hover:-translate-y-1",
                  "transition-transform duration-200",
                ].join(" ")}
                aria-hidden="true"
              >
                ↑
              </span>
              Back to top
            </button>
          </nav>

          {/* ── Col 3 & 4: Host cities ──────────────── */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col gap-3">
            <p className="text-text-primary font-heading font-bold text-sm uppercase tracking-wider">
              Host Cities
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HOST_CITIES.map(({ city, country, flag, venue, capacity }) => (
                <div
                  key={city}
                  className={[
                    "flex items-start gap-2.5 py-2 px-3",
                    "rounded-lg border border-border",
                    "hover:border-border-accent hover:bg-bg-card",
                    "transition-colors duration-150",
                    "group",
                  ].join(" ")}
                >
                  <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                    {flag}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={[
                        "text-xs font-semibold truncate",
                        "text-text-secondary",
                        "group-hover:text-text-primary",
                        "transition-colors duration-150",
                      ].join(" ")}
                    >
                      {city}
                    </p>
                    <p className="text-text-muted text-xs truncate">{venue}</p>
                    <p className="text-text-muted text-xs">Cap. {capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────── */}
        <div className="border-t border-border pt-8">
          <div
            className={[
              "flex flex-col sm:flex-row",
              "items-center justify-between",
              "gap-4",
            ].join(" ")}
          >
            {/* Copyright */}
            <p className="text-text-muted text-xs text-center sm:text-left">
              © {year} FIFA 2026 Tracker · Built with React & Tailwind v4
            </p>

            {/* Host nations */}
            <div className="flex items-center gap-3" aria-label="Host nations">
              {[
                { flag: "🇺🇸", name: "USA" },
                { flag: "🇨🇦", name: "Canada" },
                { flag: "🇲🇽", name: "Mexico" },
              ].map(({ flag, name }) => (
                <span
                  key={name}
                  className="flex items-center gap-1.5 text-text-muted text-xs"
                  aria-label={name}
                >
                  <span aria-hidden="true">{flag}</span>
                  <span className="hidden sm:inline">{name}</span>
                </span>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-text-muted text-xs text-center sm:text-right max-w-xs">
              Fan project · Not affiliated with FIFA
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
