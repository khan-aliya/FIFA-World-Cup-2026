// src/components/FixturesSection.jsx
import { useState, useMemo } from "react";
import { useWorldCup } from "../hooks/useWorldCup";
import { getTeam, formatScore } from "../data/mockData";

// Filter options shown as tab buttons
const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "upcoming", label: "Upcoming" },
  { value: "finished", label: "Finished" },
];

// Returns the right badge class + label for each match status
const getStatusBadge = (match) => {
  if (match.status === "live") {
    return {
      className: "badge badge-live",
      label: match.minute ? `${match.minute}'` : "LIVE",
      ariaLabel: `Live — minute ${match.minute || "unknown"}`,
    };
  }
  if (match.status === "finished") {
    return {
      className: "badge badge-finished",
      label: "FT",
      ariaLabel: "Full time",
    };
  }
  return {
    className: "badge badge-upcoming",
    label: match.time || "TBC",
    ariaLabel: `Upcoming — kickoff at ${match.time || "time to be confirmed"}`,
  };
};

function MatchCard({ match }) {
  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const badge = getStatusBadge(match);
  const isLive = match.status === "live";
  const isDone = match.status === "finished";

  // Who's winning? null if draw or not started
  const homeWinning = isDone && match.homeScore > match.awayScore;
  const awayWinning = isDone && match.awayScore > match.homeScore;

  return (
    <article
      className={[
        "card",
        "flex flex-col gap-3",
        isLive ? "border-red/30 shadow-(--color-shadow-glow)" : "",
      ].join(" ")}
      aria-label={`${home.name} versus ${away.name}, ${badge.ariaLabel}`}
    >
      {/* ── Top row: group + date + status badge ── */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-xs">
            {match.group ? `Group ${match.group}` : "Knockout"}
          </span>
          <span className="text-text-muted text-xs" aria-hidden="true">
            ·
          </span>
          <span className="text-text-muted text-xs">MD{match.matchday}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-muted text-xs">{match.date}</span>
          <span className={badge.className} aria-label={badge.ariaLabel}>
            {isLive && <span className="live-dot" aria-hidden="true" />}
            {badge.label}
          </span>
        </div>
      </div>

      {/* ── Score row ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {/* Home team */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-3xl sm:text-4xl shrink-0" aria-hidden="true">
            {home.flag}
          </span>
          <div className="min-w-0">
            <p
              className={[
                "font-heading font-bold text-sm sm:text-base truncate",
                homeWinning
                  ? "text-text-primary"
                  : isDone
                    ? "text-text-secondary"
                    : "text-text-primary",
              ].join(" ")}
            >
              {home.name}
            </p>
            <p className="text-text-muted text-xs">{home.confederation}</p>
          </div>
        </div>

        {/* Score / vs */}
        <div className="flex flex-col items-center shrink-0">
          {match.homeScore !== null ? (
            <div
              className={[
                "flex items-center gap-2",
                "font-heading font-black",
                "text-2xl sm:text-3xl tabular-nums",
              ].join(" ")}
              aria-label={`Score: ${match.homeScore} to ${match.awayScore}`}
            >
              <span
                className={homeWinning ? "text-accent" : "text-text-primary"}
              >
                {match.homeScore}
              </span>
              <span className="text-text-muted text-lg">–</span>
              <span
                className={awayWinning ? "text-accent" : "text-text-primary"}
              >
                {match.awayScore}
              </span>
            </div>
          ) : (
            <span
              className="text-text-muted font-heading font-bold text-lg"
              aria-label="Match not yet started"
            >
              vs
            </span>
          )}

          {/* Venue below score */}
          <p className="text-text-muted text-xs mt-1 text-center max-w-24 truncate">
            {match.city}
          </p>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-3 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p
              className={[
                "font-heading font-bold text-sm sm:text-base truncate",
                awayWinning
                  ? "text-text-primary"
                  : isDone
                    ? "text-text-secondary"
                    : "text-text-primary",
              ].join(" ")}
            >
              {away.name}
            </p>
            <p className="text-text-muted text-xs">{away.confederation}</p>
          </div>
          <span className="text-3xl sm:text-4xl shrink-0" aria-hidden="true">
            {away.flag}
          </span>
        </div>
      </div>

      {/* ── Bottom row: venue ─────────────────────── */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-border">
        <span className="text-text-muted text-xs" aria-hidden="true">
          📍
        </span>
        <p className="text-text-muted text-xs truncate">
          {match.venue}, {match.city}
        </p>
      </div>
    </article>
  );
}

export default function FixturesSection() {
  const { fixtures, loading, error, refresh } = useWorldCup();

  const [statusFilter, setStatusFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [showCount, setShowCount] = useState(9);

  // useMemo recomputes only when fixtures/filters change
  // not on every render
  const filtered = useMemo(() => {
    return fixtures.filter((f) => {
      const statusMatch = statusFilter === "all" || f.status === statusFilter;
      const groupMatch = groupFilter === "all" || f.group === groupFilter;
      return statusMatch && groupMatch;
    });
  }, [fixtures, statusFilter, groupFilter]);

  const groupFilters = useMemo(() => {
    // Get only groups that have at least one fixture
    const groupsWithData = [
      ...new Set(fixtures.map((f) => f.group).filter(Boolean)),
    ].sort();

    return [
      { value: "all", label: "All Groups" },
      ...groupsWithData.map((g) => ({ value: g, label: `Group ${g}` })),
    ];
  }, [fixtures]);

  // How many live matches in current filter
  const liveCount = useMemo(() => {
    return filtered.filter((f) => f.status === "live").length;
  }, [filtered]);

  // Slice to current page
  const visible = filtered.slice(0, showCount);
  const hasMore = filtered.length > showCount;

  // Reset to first page when user changes a filter
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    setShowCount(9);
  };

  const handleGroupFilter = (value) => {
    setGroupFilter(value);
    setShowCount(9);
  };

  return (
    <section
      id="fixtures"
      className="section-pad"
      aria-labelledby="fixtures-heading"
    >
      <div className="container-main">
        {/* ── Section header ──────────────────────── */}
        <div className="flex flex-col gap-1 mb-8">
          <span className="section-label">Group Stage</span>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 id="fixtures-heading" className="section-title">
              Fixtures
              {liveCount > 0 && (
                <span
                  className="live-badge ml-3 align-middle text-sm"
                  aria-label={`${liveCount} live matches`}
                >
                  <span className="live-dot" aria-hidden="true" />
                  {liveCount} Live
                </span>
              )}
            </h2>

            {/* Refresh button */}
            <button
              onClick={refresh}
              className="btn-ghost text-sm py-2 px-4"
              aria-label="Refresh fixtures"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* ── Error banner ────────────────────────── */}
        {error && (
          <div
            className={[
              "card border-gold/30 bg-gold/5 mb-6",
              "flex items-center gap-3",
            ].join(" ")}
            role="alert"
          >
            <span aria-hidden="true">⚠️</span>
            <p className="text-text-secondary text-sm">{error}</p>
          </div>
        )}

        {/* ── Filters ─────────────────────────────── */}
        <div
          className="flex flex-col gap-3 mb-8"
          role="group"
          aria-label="Filter fixtures"
        >
          {/* Status filter */}
          <div
            className="flex gap-2 flex-wrap"
            role="radiogroup"
            aria-label="Filter by match status"
          >
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleStatusFilter(value)}
                className={[
                  "tab-btn",
                  statusFilter === value ? "active" : "",
                ].join(" ")}
                role="radio"
                aria-checked={statusFilter === value}
                aria-label={`Show ${label} matches`}
              >
                {label}
                {value === "live" && liveCount > 0 && (
                  <span
                    className="ml-1.5 text-red font-black"
                    aria-hidden="true"
                  >
                    {liveCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Group filter — horizontal scroll on mobile */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            role="radiogroup"
            aria-label="Filter by group"
          >
            {groupFilters.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleGroupFilter(value)}
                className={[
                  "tab-btn shrink-0",
                  groupFilter === value ? "active" : "",
                ].join(" ")}
                role="radio"
                aria-checked={groupFilter === value}
                aria-label={`Show ${label}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Match grid ──────────────────────────── */}
        {loading && fixtures.length === 0 ? (
          /* Skeleton grid */
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-busy="true"
            aria-label="Loading fixtures"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card flex flex-col gap-3">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center gap-4 py-16 text-center"
            role="status"
          >
            <span className="text-5xl" aria-hidden="true">
              🔍
            </span>
            <p className="text-text-secondary font-semibold">
              No fixtures match your filters
            </p>
            <button
              onClick={() => {
                handleStatusFilter("all");
                handleGroupFilter("all");
              }}
              className="btn-ghost"
            >
              Clear filters
            </button>
          </div>
        ) : (
          /* Fixture cards */
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label={`${visible.length} fixtures shown`}
          >
            {visible.map((match) => (
              <div key={match.id} role="listitem">
                <MatchCard match={match} />
              </div>
            ))}
          </div>
        )}

        {/* ── Load more ───────────────────────────── */}
        {hasMore && (
          <div className="flex flex-col items-center gap-2 mt-8">
            <button
              onClick={() => setShowCount((prev) => prev + 9)}
              className="btn-primary"
              aria-label={`Load more fixtures, ${filtered.length - showCount} remaining`}
            >
              Load more
              <span className="text-bg-deep/70 text-xs ml-1">
                ({filtered.length - showCount} more)
              </span>
            </button>

            <p className="text-text-muted text-xs">
              Showing {visible.length} of {filtered.length} fixtures
            </p>
          </div>
        )}

        {/* ── Result count ─────────────────────────── */}
        {!loading && visible.length > 0 && (
          <p
            className="text-text-muted text-xs text-center mt-4"
            aria-live="polite"
            role="status"
          >
            {filtered.length === fixtures.length
              ? `${fixtures.length} total fixtures`
              : `${filtered.length} of ${fixtures.length} fixtures`}
          </p>
        )}
      </div>
    </section>
  );
}
