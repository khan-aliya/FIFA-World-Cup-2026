// src/components/HeroScene.jsx
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useWorldCup } from "../hooks/useWorldCup";

// ─────────────────────────────────────────────
// FOOTBALL ICONS
// Each has a position (%), size, and which
// animation variant to use (controls speed/delay)
// ─────────────────────────────────────────────
const FOOTBALLS = [
  { id: 1, x: 8, y: 15, size: "text-5xl", anim: "animate-float" },
  { id: 2, x: 88, y: 10, size: "text-7xl", anim: "animate-float-slow" },
  { id: 3, x: 75, y: 70, size: "text-4xl", anim: "animate-float-delayed" },
  { id: 4, x: 15, y: 75, size: "text-6xl", anim: "animate-float-slow" },
  { id: 5, x: 50, y: 5, size: "text-3xl", anim: "animate-float" },
  { id: 6, x: 92, y: 45, size: "text-5xl", anim: "animate-float-delayed" },
  { id: 7, x: 5, y: 45, size: "text-4xl", anim: "animate-float-slow" },
  { id: 8, x: 60, y: 85, size: "text-6xl", anim: "animate-float" },
];

// Host countries for the rotating subtitle
const HOST_NATIONS = ["🇺🇸 USA", "🇨🇦 Canada", "🇲🇽 Mexico"];

// Tournament start date
const TOURNAMENT_END = new Date("2026-07-19T18:00:00-04:00");

// ─────────────────────────────────────────────
// CUSTOM HOOK — useCountdown
// Returns days, hours, minutes, seconds
// until a target date
// ─────────────────────────────────────────────

// REPLACE the entire useCountdown function with this

// ── outside the hook ──────────────────────────
const calcTimeLeft = (targetDate) => {
  const diff = targetDate - new Date();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, started: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    started: false,
  };
};

// ── the hook itself ───────────────────────────
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]); // ← targetDate in deps, not calculate

  return timeLeft;
}
// ─────────────────────────────────────────────
// CUSTOM HOOK — useRotatingText
// Cycles through an array of strings
// ─────────────────────────────────────────────
function useRotatingText(items, intervalMs = 2500) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      // Fade out
      setVisible(false);

      // After fade out (300ms), swap text and fade in
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % items.length);
        setVisible(true);
      }, 300);
    }, intervalMs);

    return () => clearInterval(cycle);
  }, [items.length, intervalMs]);

  return { text: items[index], visible };
}

export default function HeroScene() {
  const { theme } = useTheme();
  const { hasLive, liveCount, live } = useWorldCup();
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const { days, hours, minutes, seconds, started } =
    useCountdown(TOURNAMENT_END);
  const { text: hostText, visible: hostVisible } =
    useRotatingText(HOST_NATIONS);
  const hasAnimated = useRef(false);

  // REPLACE the existing GSAP useEffect with this
  useEffect(() => {
    // Guard against StrictMode double-invocation
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    import("gsap").then(({ gsap }) => {
      if (!contentRef.current) return;

      contentRef.current.style.visibility = "visible";
      const children = Array.from(contentRef.current.children);

      gsap.fromTo(
        children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.1,
        },
      );
    });
  }, []);
  const gradients = {
    electric: {
      bg: "from-bg-deep via-bg-navy to-bg-deep",
      orb1: "bg-green/10",
      orb2: "bg-blue/8",
      orb3: "bg-gold/6",
    },
    vivid: {
      bg: "from-bg-deep via-bg-navy to-bg-deep",
      orb1: "bg-red/10",
      orb2: "bg-blue/8",
      orb3: "bg-accent/6",
    },
  };

  const g = gradients[theme] || gradients.electric;

  return (
    <section
      ref={heroRef}
      className={[
        "relative min-h-screen flex items-center justify-center",
        "overflow-hidden bg-linear-to-br",
        g.bg,
      ].join(" ")}
      aria-label="FIFA World Cup 2026 hero section"
    >
      {/* ── Ambient gradient orbs ─────────────────
          Absolutely positioned blurred circles that
          create the atmospheric glow effect          */}
      <div
        aria-hidden="true"
        className={[
          "absolute top-1/4 left-1/4 w-96 h-96",
          "rounded-full blur-3xl opacity-40",
          g.orb1,
        ].join(" ")}
      />
      <div
        aria-hidden="true"
        className={[
          "absolute bottom-1/4 right-1/4 w-80 h-80",
          "rounded-full blur-3xl opacity-30",
          g.orb2,
        ].join(" ")}
      />
      <div
        aria-hidden="true"
        className={[
          "absolute top-1/2 left-1/2 w-64 h-64",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-full blur-3xl opacity-20",
          g.orb3,
        ].join(" ")}
      />

      {/* ── Floating footballs ───────────────────── */}
      <div aria-hidden="true">
        {FOOTBALLS.map((ball) => (
          <span
            key={ball.id}
            className={[
              "absolute select-none pointer-events-none",
              "opacity-15",
              ball.size,
              ball.anim,
            ].join(" ")}
            style={{
              left: `${ball.x}%`,
              top: `${ball.y}%`,
            }}
          >
            ⚽
          </span>
        ))}
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div
        ref={contentRef}
        className={[
          "relative z-10 container-main",
          "flex flex-col items-center text-center",
          "gap-6 py-24 md:py-32",
        ].join(" ")}
        style={{ visibility: "hidden" }}
      >
        {/* Label row */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <span className="section-label text-base tracking-widest">
            FIFA World Cup
          </span>

          {/* Live badge — only shown when matches are live */}
          {hasLive && (
            <span
              className="live-badge"
              role="status"
              aria-label={`${liveCount} match${liveCount > 1 ? "es" : ""} live now`}
            >
              <span className="live-dot" aria-hidden="true" />
              {liveCount} Live
            </span>
          )}
        </div>

        {/* Main heading */}
        <h1
          className={[
            "font-heading font-black tracking-tight",
            "text-5xl sm:text-7xl md:text-8xl lg:text-9xl",
            "text-text-primary leading-none",
          ].join(" ")}
        >
          USA · CAN
          <span className="block text-accent">· MEX</span>
        </h1>

        {/* Rotating host subtitle */}
        <p
          className="text-text-secondary text-lg sm:text-xl font-medium"
          aria-live="polite"
          aria-label={`Hosted by ${hostText}`}
        >
          Hosted by{" "}
          <span
            className={[
              "text-text-primary font-semibold",
              "transition-opacity duration-300",
              hostVisible ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden="true"
          >
            {hostText}
          </span>
        </p>

        {/* ── Countdown ─────────────────────────── */}
        {!started ? (
          <div
            className="w-full"
            role="timer"
            aria-label="Countdown to tournament start"
            aria-live="off"
          >
            <p className="section-label text-center mb-4">
              {started ? "Tournament Complete" : "Final in"}
            </p>

            <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto sm:max-w-md">
              {[
                { value: days, label: "Days" },
                { value: hours, label: "Hours" },
                { value: minutes, label: "Mins" },
                { value: seconds, label: "Secs" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="card flex flex-col items-center py-3 px-2 gap-1"
                >
                  <span
                    className={[
                      "font-heading font-black text-3xl sm:text-4xl",
                      "text-accent tabular-nums",
                    ].join(" ")}
                  >
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-text-muted text-xs uppercase tracking-wider">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card px-8 py-4">
            <p className="text-accent font-heading font-bold text-xl">
              🏆 Tournament is Underway!
            </p>
          </div>
        )}

        {/* ── Live match preview ─────────────────
            Shows the first live match if one exists */}
        {hasLive && live[0] && (
          <div
            className={[
              "card border-red/30 bg-red/5",
              "flex items-center gap-4 px-6 py-4",
              "max-w-sm w-full",
            ].join(" ")}
            role="status"
            aria-label="Currently live match"
          >
            <span className="live-dot" aria-hidden="true" />
            <span className="text-text-secondary text-sm">Live now:</span>
            <span className="text-text-primary font-bold text-sm">
              {live[0].home} {live[0].homeScore ?? 0} – {live[0].awayScore ?? 0}{" "}
              {live[0].away}
            </span>
            {live[0].minute && (
              <span className="text-red text-xs font-bold ml-auto">
                {live[0].minute}'
              </span>
            )}
          </div>
        )}

        {/* ── CTA buttons ───────────────────────── */}
        <div className="flex gap-4 flex-wrap justify-center mt-2">
          <a
            href="#fixtures"
            className="btn-primary"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("fixtures")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View Fixtures →
          </a>

          <a
            href="#standings"
            className="btn-ghost"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("standings")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Group Standings
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────── */}
      <div
        className={[
          "absolute bottom-8 left-1/2 -translate-x-1/2",
          "flex flex-col items-center gap-2",
          "text-text-muted animate-float",
        ].join(" ")}
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <span className="text-lg">↓</span>
      </div>
    </section>
  );
}
