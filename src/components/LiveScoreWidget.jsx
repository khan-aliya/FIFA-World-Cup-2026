// src/components/LiveScoreWidget.jsx
import { useState, useEffect } from "react";
import { useLiveMatches } from "../hooks/useWorldCup";
import { getTeam, formatScore } from "../data/mockData";

const UPDATE_FLASH_DURATION = 2000;

export default function LiveScoreWidget() {
  const { matches, loading, lastUpdated, refresh } = useLiveMatches();
  const [isOpen, setIsOpen] = useState(true);
  const [showFlash, setShowFlash] = useState(false);
  const [prevCount, setPrevCount] = useState(0);

  // Flash "Updated ✓" briefly after each refresh
  useEffect(() => {
    if (!lastUpdated) return;
    setShowFlash(true);
    const timer = setTimeout(() => setShowFlash(false), UPDATE_FLASH_DURATION);
    return () => clearTimeout(timer);
  }, [lastUpdated]);

  // Auto-open sidebar when matches go live
  useEffect(() => {
    if (matches.length > prevCount && prevCount === 0) setIsOpen(true);
    setPrevCount(matches.length);
  }, [matches.length]);

  const formatTime = (date) => {
    if (!date) return null;
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const hasMatches = matches.length > 0;

  return (
    <>
      {/* ── Collapsed tab — shown when sidebar is closed ──── */}
      {!isOpen && (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className={[
              "bg-bg-card border border-border border-r-0",
              "rounded-l-lg px-2 py-4",
              "flex flex-col items-center gap-2",
              "text-text-muted hover:text-text-primary",
              "hover:bg-bg-card-hover transition-colors duration-200",
              "min-h-11",
            ].join(" ")}
            aria-label="Open live scores panel"
            aria-expanded="false"
          >
            {/* Red pulse dot — only when matches are live */}
            {hasMatches && (
              <span
                className="w-2 h-2 rounded-full bg-red mb-1 animate-pulse-dot"
                aria-hidden="true"
              />
            )}
            <span className="text-lg" aria-hidden="true">
              ⚽
            </span>
            <span
              className="text-xs font-bold tracking-widest uppercase text-accent"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
              }}
            >
              Live
            </span>
          </button>
        </div>
      )}

      {/* ── Main sidebar ─────────────────────────────────── */}
      <aside
        className={[
          "fixed right-0 top-1/2 -translate-y-1/2 z-50",
          "w-72",
          hasMatches ? "flex" : "hidden md:flex",
          "flex-col",
          "bg-bg-card/95 backdrop-blur-md",
          "border border-border border-r-0",
          "rounded-l-xl overflow-hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        aria-label="Live scores sidebar"
        aria-live="polite"
        role="complementary"
      >
        {/* ── Header ──────────────────────────────────────── */}
        <div
          className={[
            "flex items-center justify-between",
            "px-4 py-3 border-b border-border bg-bg-navy",
          ].join(" ")}
        >
          <div className="flex items-center gap-2">
            {hasMatches ? (
              <span
                className="live-badge"
                aria-label={`${matches.length} match${matches.length > 1 ? "es" : ""} live`}
              >
                <span className="live-dot" aria-hidden="true" />
                {matches.length} Live
              </span>
            ) : (
              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider">
                Live Scores
              </span>
            )}

            {showFlash && (
              <span className="text-accent text-xs font-semibold" role="status">
                Updated ✓
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Manual refresh */}
            <button
              onClick={refresh}
              className={[
                "w-7 h-7 flex items-center justify-center rounded-md",
                "text-text-muted hover:text-text-primary hover:bg-bg-card-hover",
                "transition-colors duration-150",
                loading ? "animate-spin" : "",
              ].join(" ")}
              aria-label="Refresh live scores"
              disabled={loading}
            >
              ↻
            </button>

            {/* Collapse */}
            <button
              onClick={() => setIsOpen(false)}
              className={[
                "w-7 h-7 flex items-center justify-center rounded-md",
                "text-text-muted hover:text-text-primary hover:bg-bg-card-hover",
                "transition-colors duration-150",
              ].join(" ")}
              aria-label="Collapse live scores panel"
              aria-expanded="true"
            >
              ✕
            </button>
          </div>
        </div>

        {/* ── Match list ───────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain"
          role="list"
          aria-label="Live match scores"
        >
          {loading && matches.length === 0 ? (
            /* Skeleton */
            <div className="p-4 flex flex-col gap-3" aria-busy="true">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="skeleton h-3 w-1/2" />
                  <div className="skeleton h-8 w-full" />
                </div>
              ))}
            </div>
          ) : matches.length === 0 ? (
            /* Empty state */
            <div className="p-6 flex flex-col items-center gap-3 text-center">
              <span className="text-3xl" aria-hidden="true">
                ⚽
              </span>
              <p className="text-text-secondary text-sm font-medium">
                No matches live right now
              </p>
              <p className="text-text-muted text-xs">
                Check the fixtures for upcoming kickoff times
              </p>

              <a
                href="#fixtures"
                className="btn-ghost text-xs py-2 px-4 mt-1"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("fixtures")
                    ?.scrollIntoView({ behavior: "smooth" });
                  setIsOpen(false);
                }}
              >
                View Fixtures →
              </a>
            </div>
          ) : (
            /* Live match cards */
            matches.map((match) => {
              const home = getTeam(match.home);
              const away = getTeam(match.away);

              return (
                <div
                  key={match.id}
                  role="listitem"
                  className={[
                    "px-4 py-3 border-b border-border last:border-b-0",
                    "hover:bg-bg-card-hover transition-colors duration-150",
                  ].join(" ")}
                >
                  {/* Group + minute */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-muted text-xs">
                      {match.group ? `Group ${match.group}` : "Knockout"}
                    </span>
                    <span
                      className="text-red text-xs font-bold"
                      aria-label={`Match minute: ${match.minute || "live"}`}
                    >
                      {match.minute ? `${match.minute}'` : "● LIVE"}
                    </span>
                  </div>

                  {/* Teams + score */}
                  <div
                    className="flex items-center justify-between gap-2"
                    aria-label={`${home.name} ${formatScore(match.homeScore, match.awayScore)} ${away.name}`}
                  >
                    {/* Home */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-xl shrink-0" aria-hidden="true">
                        {home.flag}
                      </span>
                      <span
                        className={[
                          "text-sm font-semibold truncate",
                          match.homeScore > match.awayScore
                            ? "text-text-primary"
                            : "text-text-secondary",
                        ].join(" ")}
                      >
                        {home.code}
                      </span>
                    </div>

                    {/* Score */}
                    <div
                      className={[
                        "flex items-center gap-1.5 px-3 py-1",
                        "bg-bg-deep rounded-lg",
                        "font-heading font-black text-base",
                        "tabular-nums shrink-0",
                      ].join(" ")}
                      aria-hidden="true"
                    >
                      <span
                        className={
                          match.homeScore > match.awayScore
                            ? "text-accent"
                            : "text-text-primary"
                        }
                      >
                        {match.homeScore ?? 0}
                      </span>
                      <span className="text-text-muted text-xs">–</span>
                      <span
                        className={
                          match.awayScore > match.homeScore
                            ? "text-accent"
                            : "text-text-primary"
                        }
                      >
                        {match.awayScore ?? 0}
                      </span>
                    </div>

                    {/* Away */}
                    <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                      <span
                        className={[
                          "text-sm font-semibold truncate",
                          match.awayScore > match.homeScore
                            ? "text-text-primary"
                            : "text-text-secondary",
                        ].join(" ")}
                      >
                        {away.code}
                      </span>
                      <span className="text-xl shrink-0" aria-hidden="true">
                        {away.flag}
                      </span>
                    </div>
                  </div>

                  {/* Venue */}
                  {match.venue && (
                    <p className="text-text-muted text-xs mt-1.5 text-center truncate">
                      {match.venue}, {match.city}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div
          className={[
            "px-4 py-2 border-t border-border bg-bg-navy",
            "flex items-center justify-between",
          ].join(" ")}
        >
          <span className="text-text-muted text-xs">
            {lastUpdated
              ? `Updated ${formatTime(lastUpdated)}`
              : "Connecting..."}
          </span>
          <span className="text-text-muted text-xs">Refreshes every 30s</span>
        </div>
      </aside>
    </>
  );
}
