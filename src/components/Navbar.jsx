// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const NAV_LINKS = [
  { label: "Fixtures", href: "#fixtures" },
  { label: "Standings", href: "#standings" },
  { label: "Knockout", href: "#knockout" },
  { label: "Scorers", href: "#scorers" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  // Scroll → frosted navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track which section is in view → highlight nav link
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector(link.href),
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveLink("#" + entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;

    // Small delay before attaching — lets the opening click finish
    // before we start listening for outside clicks
    const timer = setTimeout(() => {
      const handleOutsideClick = (e) => {
        if (!e.target.closest("[data-navbar-menu]")) {
          setMenuOpen(false);
        }
      };

      document.addEventListener("click", handleOutsideClick);

      // Store cleanup in the timeout's scope
      return () => document.removeEventListener("click", handleOutsideClick);
    }, 10);

    return () => clearTimeout(timer);
  }, [menuOpen]);

  // Smooth scroll with navbar offset
  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <header role="banner">
      <nav
        className={["navbar", scrolled ? "scrolled" : ""].join(" ")}
        aria-label="Main navigation"
      >
        {/* ── Logo ──────────────────────────────────── */}

        <a
          href="#"
          className="navbar-logo"
          aria-label="FIFA 2026 Tracker - go to top"
        >
          <span aria-hidden="true">⚽</span>
          FIFA <span>2026</span>
        </a>

        {/* ── Desktop nav links ────────────────────── */}
        <nav
          className="hidden md:flex items-center gap-1 ml-10"
          aria-label="Site sections"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              aria-current={activeLink === href ? "true" : undefined}
              className={[
                "px-4 py-2 rounded-full text-sm font-semibold",
                "transition-all duration-200",
                "min-h-11 flex items-center",
                activeLink === href
                  ? "text-accent bg-accent/10 border border-border-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card",
              ].join(" ")}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Right side controls ──────────────────── */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
              theme === "electric"
                ? "Switch to Bold & Vivid theme"
                : "Switch to Dark & Electric theme"
            }
            aria-pressed={theme === "vivid"}
            title={theme === "electric" ? "Bold & Vivid" : "Dark & Electric"}
          >
            <span
              aria-hidden="true"
              className={[
                "transition-all duration-300 select-none text-xl",
                theme === "vivid"
                  ? "drop-shadow-[0_0_8px_rgba(230,57,70,0.8)]"
                  : "opacity-80",
              ].join(" ")}
            >
              ⚽
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            data-navbar-menu=""
            className={[
              "md:hidden flex flex-col justify-center items-center",
              "w-11 h-11 gap-1.25 rounded-lg",
              "border border-border bg-bg-card",
              "hover:border-border-accent transition-colors duration-200",
            ].join(" ")}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            <span
              aria-hidden="true"
              className={[
                "block w-5 h-0.5 bg-text-primary rounded",
                "transition-all duration-300 origin-center",
                menuOpen ? "rotate-45 translate-y-1.75" : "",
              ].join(" ")}
            />
            <span
              aria-hidden="true"
              className={[
                "block w-5 h-0.5 bg-text-primary rounded",
                "transition-all duration-300",
                menuOpen ? "opacity-0 scale-x-0" : "",
              ].join(" ")}
            />
            <span
              aria-hidden="true"
              className={[
                "block w-5 h-0.5 bg-text-primary rounded",
                "transition-all duration-300 origin-center",
                menuOpen ? "-rotate-45 -translate-y-1.75" : "",
              ].join(" ")}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ─────────────────────────────── */}
      <div
        id="mobile-menu"
        data-navbar-menu=""
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={[
          "md:hidden fixed inset-x-0 top-16 z-90",
          "bg-bg-navy/95 backdrop-blur-md",
          "border-b border-border",
          "transition-all duration-300 ease-in-out",
          menuOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <nav
          className="container-main py-4 flex flex-col gap-1"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
              aria-current={activeLink === href ? "true" : undefined}
              className={[
                "px-4 py-3 rounded-lg text-sm font-semibold",
                "min-h-11 flex items-center",
                "transition-colors duration-150",
                activeLink === href
                  ? "text-accent bg-accent/10"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-card",
              ].join(" ")}
            >
              {label}
            </a>
          ))}

          {/* Theme label */}
          <div className="mt-3 pt-3 border-t border-border px-4">
            <p className="text-text-muted text-xs">
              Current theme:
              <span className="text-accent font-semibold ml-1">
                {theme === "electric" ? "Dark & Electric" : "Bold & Vivid"}
              </span>
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
