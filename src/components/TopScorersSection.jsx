// src/components/TopScorersSection.jsx
import { useState, useMemo } from "react";
import { useWorldCup } from "../hooks/useWorldCup";
import { getTeam } from "../data/mockData";

// Sort options
const SORT_OPTIONS = [
  { value: "goals", label: "Goals" },
  { value: "assists", label: "Assists" },
  { value: "goalsAssists", label: "Goals + Assists" },
  { value: "minutesPlayed", label: "Minutes Played" },
];
// Returns medal emoji + colour for top 3 positions
const getMedal = (position) => {
  if (position === 1) return { icon: "🥇", colour: "text-gold" };
  if (position === 2) return { icon: "🥈", colour: "text-text-secondary" };
  if (position === 3) return { icon: "🥉", colour: "text-red" };
  return null;
};
function StatBar({ value, max, colour = "bg-accent" }) {
  // Avoid division by zero
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div
      className="w-full h-1.5 bg-bg-deep rounded-full overflow-hidden"
      role="presentation"
      aria-hidden="true"
    >
      <div
        className={[
          "h-full rounded-full transition-all duration-500",
          colour,
        ].join(" ")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
function ScorerCard({ scorer, position, maxGoals, maxAssists, sortBy }) {
  const team = getTeam(scorer.team);
  const medal = getMedal(position);
  const isTop3 = position <= 3;

  // Goals + assists combined
  const combined = scorer.goals + scorer.assists;

  return (
    <article
      className={[
        "card flex flex-col gap-4",
        isTop3 ? "border-accent/20" : "",
        position === 1 ? "border-gold/30 shadow-(--color-shadow-gold)" : "",
      ].join(" ")}
      aria-label={`${scorer.name}, ${scorer.goals} goals, ${scorer.assists} assists`}
    >
      {/* ── Top row: position + name + team ───────── */}
      <div className="flex items-center gap-3">
        {/* Position / medal */}
        <div className="shrink-0 w-8 text-center">
          {medal ? (
            <span
              className="text-2xl"
              aria-label={`Position ${position}`}
              role="img"
            >
              {medal.icon}
            </span>
          ) : (
            <span
              className={[
                "font-heading font-black text-lg",
                "text-text-muted",
              ].join(" ")}
              aria-label={`Position ${position}`}
            >
              {position}
            </span>
          )}
        </div>

        {/* Flag */}
        <span className="text-3xl shrink-0" aria-hidden="true">
          {team.flag}
        </span>

        {/* Name + team */}
        <div className="min-w-0 flex-1">
          <p
            className={[
              "font-heading font-bold truncate",
              "text-sm sm:text-base",
              isTop3 ? "text-text-primary" : "text-text-secondary",
            ].join(" ")}
          >
            {scorer.name}
          </p>
          <p className="text-text-muted text-xs">
            {team.name} · {team.confederation}
          </p>
        </div>

        {/* Primary stat (big number) */}
        <div className="shrink-0 text-right">
          <p
            className={[
              "font-heading font-black text-2xl tabular-nums",
              position === 1 ? "text-gold" : "text-accent",
            ].join(" ")}
            aria-label={`${scorer.goals} goals`}
          >
            {scorer.goals}
          </p>
          <p className="text-text-muted text-xs">goals</p>
        </div>
      </div>

      {/* ── Goal bar ──────────────────────────────── */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-text-muted text-xs">Goals</span>
          <span className="text-text-secondary text-xs font-semibold tabular-nums">
            {scorer.goals}
          </span>
        </div>
        <StatBar
          value={scorer.goals}
          max={maxGoals}
          colour={position === 1 ? "bg-gold" : "bg-accent"}
        />
      </div>

      {/* ── Assists bar ───────────────────────────── */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-text-muted text-xs">Assists</span>
          <span className="text-text-secondary text-xs font-semibold tabular-nums">
            {scorer.assists}
          </span>
        </div>
        <StatBar value={scorer.assists} max={maxAssists} colour="bg-blue" />
      </div>

      {/* ── Bottom stats row ──────────────────────── */}
      <div
        className={[
          "flex items-center justify-between",
          "pt-3 border-t border-border",
          "text-xs",
        ].join(" ")}
      >
        {/* Goals + Assists */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-text-primary font-bold tabular-nums">
            {combined}
          </span>
          <span className="text-text-muted">G+A</span>
        </div>

        {/* Penalties */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-text-primary font-bold tabular-nums">
            {scorer.penalties}
          </span>
          <span className="text-text-muted">Pens</span>
        </div>

        {/* Minutes per goal */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-text-primary font-bold tabular-nums">
            {scorer.goals > 0
              ? Math.round(scorer.minutesPlayed / scorer.goals)
              : "—"}
          </span>
          <span className="text-text-muted">Min/Goal</span>
        </div>

        {/* Minutes played */}
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-text-primary font-bold tabular-nums">
            {scorer.minutesPlayed}'
          </span>
          <span className="text-text-muted">Mins</span>
        </div>
      </div>
    </article>
  );
}
function Podium({ scorers }) {
  if (scorers.length < 3) return null;

  // Podium order: 2nd, 1st, 3rd (centre is tallest)
  const order = [scorers[1], scorers[0], scorers[2]];
  const heights = ["h-20", "h-28", "h-16"];
  const positions = [2, 1, 3];

  return (
    <div
      className="flex items-end justify-center gap-4 mb-12"
      aria-label="Top 3 scorers podium"
      role="region"
    >
      {order.map((scorer, i) => {
        const team = getTeam(scorer.team);
        const medal = getMedal(positions[i]);
        const isBest = positions[i] === 1;

        return (
          <div key={scorer.id} className="flex flex-col items-center gap-2">
            {/* Player info above podium block */}
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-3xl" aria-hidden="true">
                {team.flag}
              </span>
              <p
                className={[
                  "font-heading font-bold text-xs sm:text-sm",
                  isBest ? "text-text-primary" : "text-text-secondary",
                ].join(" ")}
              >
                {scorer.name.split(" ").slice(-1)[0]}
              </p>
              <div className="flex items-center gap-1">
                <span
                  className={[
                    "font-heading font-black tabular-nums",
                    isBest ? "text-gold text-xl" : "text-accent text-lg",
                  ].join(" ")}
                >
                  {scorer.goals}
                </span>
                <span className="text-text-muted text-xs">⚽</span>
              </div>
            </div>

            {/* Podium block */}
            <div
              className={[
                heights[i],
                "w-20 sm:w-24 rounded-t-lg",
                "flex items-center justify-center",
                isBest
                  ? "bg-gold/20 border border-gold/30"
                  : "bg-accent/10 border border-accent/20",
              ].join(" ")}
              aria-hidden="true"
            >
              <span className="text-2xl">{medal?.icon}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default function TopScorersSection() {
  const { scorers, loading } = useWorldCup();
  const [sortBy, setSortBy] = useState("goals");
  const [showAll, setShowAll] = useState(false);

  // Sort scorers based on selected sort option
  const sorted = useMemo(() => {
    return [...scorers].sort((a, b) => {
      if (sortBy === "goals") return b.goals - a.goals;
      if (sortBy === "assists") return b.assists - a.assists;
      if (sortBy === "goalsAssists")
        return b.goals + b.assists - (a.goals + a.assists);
      if (sortBy === "minutesPlayed") return a.minutesPlayed - b.minutesPlayed;
      return 0;
    });
  }, [scorers, sortBy]);

  // Limits shown to top 6 unless "show all" is clicked
  const visible = showAll ? sorted : sorted.slice(0, 6);

  // Max values for stat bars — always from full sorted list
  const maxGoals = useMemo(
    () => Math.max(...scorers.map((s) => s.goals), 1),
    [scorers],
  );
  const maxAssists = useMemo(
    () => Math.max(...scorers.map((s) => s.assists), 1),
    [scorers],
  );

  return (
    <section
      id="scorers"
      className="section-pad bg-bg-navy"
      aria-labelledby="scorers-heading"
    >
      <div className="container-main">
        {/* ── Section header ──────────────────────── */}
        <div className="mb-8">
          <span className="section-label">Tournament</span>
          <h2 id="scorers-heading" className="section-title mt-1">
            Top Scorers
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            {scorers.length} players · Sorted by{" "}
            {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
          </p>
        </div>

        {/* ── Podium ──────────────────────────────── */}
        {!loading && sorted.length >= 3 && sortBy === "goals" && (
          <Podium scorers={sorted} />
        )}

        {/* ── Sort controls ────────────────────────── */}
        <div
          className="flex gap-2 flex-wrap mb-8"
          role="group"
          aria-label="Sort scorers by"
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setSortBy(opt.value);
                setShowAll(false);
              }}
              className={["tab-btn", sortBy === opt.value ? "active" : ""].join(
                " ",
              )}
              aria-pressed={sortBy === opt.value}
              aria-label={`Sort by ${opt.label}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── Scorer grid ─────────────────────────── */}
        {loading ? (
          /* Skeleton */
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-busy="true"
            aria-label="Loading top scorers"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-8 h-8 rounded-full" />
                  <div className="skeleton w-8 h-8 rounded-full" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-3/4 mb-1" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                  <div className="skeleton h-8 w-8" />
                </div>
                <div className="skeleton h-2 w-full rounded-full" />
                <div className="skeleton h-2 w-full rounded-full" />
                <div className="skeleton h-8 w-full mt-2" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="text-5xl" aria-hidden="true">
              ⚽
            </span>
            <p className="text-text-secondary font-semibold">
              No scorer data available yet
            </p>
            <p className="text-text-muted text-sm">
              Check back once the tournament begins
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            role="list"
            aria-label={`Top ${visible.length} scorers`}
          >
            {visible.map((scorer, index) => (
              <div key={scorer.id} role="listitem">
                <ScorerCard
                  scorer={scorer}
                  position={index + 1}
                  maxGoals={maxGoals}
                  maxAssists={maxAssists}
                  sortBy={sortBy}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── Show all / show less ─────────────────── */}
        {!loading && sorted.length > 6 && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="btn-ghost"
              aria-expanded={showAll}
              aria-controls="scorers-grid"
            >
              {showAll ? "↑ Show less" : `↓ Show all ${sorted.length} scorers`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
