// src/components/KnockoutSection.jsx
import { useState } from "react";
import { useWorldCup } from "../hooks/useWorldCup";
import { getTeam, formatScore } from "../data/mockData";

// Round definitions — order matters, left to right in the bracket
const ROUNDS = [
  { key: "roundOf32", label: "Round of 32", short: "R32" },
  { key: "quarterFinals", label: "Quarter Finals", short: "QF" },
  { key: "semiFinals", label: "Semi Finals", short: "SF" },
  { key: "final", label: "Final", short: "F" },
];
function KnockoutCard({ match, isHighlighted }) {
  if (!match) return null;

  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const isLive = match.status === "live";
  const isDone = match.status === "finished";
  const isTBD = match.home === "TBD" || match.away === "TBD";

  const homeWins = isDone && match.homeScore > match.awayScore;
  const awayWins = isDone && match.awayScore > match.homeScore;

  return (
    <article
      className={[
        "card p-0 overflow-hidden w-full",
        isLive ? "border-red/40 shadow-(--color-shadow-glow)" : "",
        isHighlighted ? "border-accent/40" : "",
        isTBD ? "opacity-50" : "",
      ].join(" ")}
      aria-label={
        isTBD ? "Match to be decided" : `${home.name} versus ${away.name}`
      }
    >
      {/* Live indicator bar across top */}
      {isLive && <div className="h-0.5 w-full bg-red" aria-hidden="true" />}

      {/* Home team row */}
      <div
        className={[
          "flex items-center justify-between",
          "px-3 py-2.5 gap-2",
          "border-b border-border",
          homeWins ? "bg-accent/5" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0" aria-hidden="true">
            {home.flag}
          </span>
          <span
            className={[
              "text-xs font-semibold truncate",
              homeWins
                ? "text-text-primary"
                : isDone
                  ? "text-text-muted"
                  : "text-text-secondary",
            ].join(" ")}
          >
            {isTBD ? "TBD" : home.name}
          </span>
        </div>
        <span
          className={[
            "text-sm font-black tabular-nums shrink-0",
            "font-heading",
            homeWins ? "text-accent" : "text-text-primary",
          ].join(" ")}
        >
          {match.homeScore ?? (isTBD ? "-" : "")}
        </span>
      </div>

      {/* Away team row */}
      <div
        className={[
          "flex items-center justify-between",
          "px-3 py-2.5 gap-2",
          awayWins ? "bg-accent/5" : "",
        ].join(" ")}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-lg shrink-0" aria-hidden="true">
            {away.flag}
          </span>
          <span
            className={[
              "text-xs font-semibold truncate",
              awayWins
                ? "text-text-primary"
                : isDone
                  ? "text-text-muted"
                  : "text-text-secondary",
            ].join(" ")}
          >
            {isTBD ? "TBD" : away.name}
          </span>
        </div>
        <span
          className={[
            "text-sm font-black tabular-nums shrink-0",
            "font-heading",
            awayWins ? "text-accent" : "text-text-primary",
          ].join(" ")}
        >
          {match.awayScore ?? (isTBD ? "-" : "")}
        </span>
      </div>

      {/* Status footer */}
      <div
        className={[
          "px-3 py-1.5",
          "flex items-center justify-between",
          "bg-bg-navy border-t border-border",
        ].join(" ")}
      >
        {isLive ? (
          <span className="live-badge py-0.5 px-2 text-xs">
            <span className="live-dot" aria-hidden="true" />
            {match.minute ? `${match.minute}'` : "LIVE"}
          </span>
        ) : isDone ? (
          <span className="badge badge-finished">FT</span>
        ) : (
          <span className="badge badge-upcoming">
            {isTBD ? "TBD" : "Upcoming"}
          </span>
        )}

        {match.date && !isTBD && (
          <span className="text-text-muted text-xs">{match.date}</span>
        )}
      </div>
    </article>
  );
}
function RoundColumn({ round, matches, activeMatch, onMatchClick }) {
  return (
    <div className="flex flex-col min-w-52">
      {/* Round header */}
      <div className="text-center mb-4">
        <span className="section-label">{round.label}</span>
        <p className="text-text-muted text-xs mt-0.5">
          {matches.length} match{matches.length !== 1 ? "es" : ""}
        </p>
      </div>

      {/* Match cards stacked vertically */}
      <div
        className={[
          "flex flex-col gap-3",
          // Space cards evenly when fewer matches in later rounds
          matches.length <= 2 ? "justify-center flex-1" : "",
        ].join(" ")}
      >
        {matches.map((match, i) => (
          <button
            key={match.id}
            onClick={() => onMatchClick(match.id)}
            className={[
              "text-left w-full",
              "focus-visible:outline-2 focus-visible:outline-accent",
              "rounded-lg",
            ].join(" ")}
            aria-label={`View match: ${getTeam(match.home).name} vs ${getTeam(match.away).name}`}
            aria-pressed={activeMatch === match.id}
          >
            <KnockoutCard
              match={match}
              isHighlighted={activeMatch === match.id}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
function MatchDetail({ matchId, knockout }) {
  // Find the match across all rounds
  const match = Object.values(knockout)
    .flat()
    .find((m) => m.id === matchId);

  if (!match) return null;

  const home = getTeam(match.home);
  const away = getTeam(match.away);
  const isLive = match.status === "live";
  const isDone = match.status === "finished";

  return (
    <div
      className={[
        "card border-border-accent",
        "flex flex-col sm:flex-row items-center gap-6",
        "py-6 px-6",
        isLive ? "border-red/30" : "",
      ].join(" ")}
      role="region"
      aria-label="Selected match details"
    >
      {/* Home team */}
      <div className="flex flex-col items-center gap-2 flex-1 text-center">
        <span className="text-5xl" aria-hidden="true">
          {home.flag}
        </span>
        <p className="font-heading font-bold text-text-primary">{home.name}</p>
        <p className="text-text-muted text-xs">{home.confederation}</p>
      </div>

      {/* Score / vs */}
      <div className="flex flex-col items-center gap-2 shrink-0">
        {isLive && (
          <span className="live-badge mb-1">
            <span className="live-dot" aria-hidden="true" />
            {match.minute ? `${match.minute}'` : "LIVE"}
          </span>
        )}
        <div
          className={[
            "font-heading font-black text-4xl sm:text-5xl",
            "tabular-nums text-text-primary",
          ].join(" ")}
          aria-label={`Score: ${formatScore(match.homeScore, match.awayScore)}`}
        >
          {match.homeScore !== null
            ? `${match.homeScore} – ${match.awayScore}`
            : "vs"}
        </div>
        {isDone && <span className="badge badge-finished mt-1">Full Time</span>}
        {!isDone && !isLive && match.date && (
          <p className="text-text-muted text-xs mt-1">
            {match.date} · {match.time}
          </p>
        )}
      </div>

      {/* Away team */}
      <div className="flex flex-col items-center gap-2 flex-1 text-center">
        <span className="text-5xl" aria-hidden="true">
          {away.flag}
        </span>
        <p className="font-heading font-bold text-text-primary">{away.name}</p>
        <p className="text-text-muted text-xs">{away.confederation}</p>
      </div>
    </div>
  );
}
function RoundTabs({ activeRound, onChange }) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden"
      role="tablist"
      aria-label="Select knockout round"
    >
      {ROUNDS.map((round) => (
        <button
          key={round.key}
          role="tab"
          onClick={() => onChange(round.key)}
          aria-selected={activeRound === round.key}
          className={[
            "tab-btn shrink-0",
            activeRound === round.key ? "active" : "",
          ].join(" ")}
        >
          {round.short}
        </button>
      ))}
    </div>
  );
}
export default function KnockoutSection() {
  const { knockout, loading } = useWorldCup();
  const [activeMatch, setActiveMatch] = useState(null);
  const [mobileRound, setMobileRound] = useState("roundOf32");

  const handleMatchClick = (matchId) => {
    // Toggle — clicking the same match again deselects it
    setActiveMatch((prev) => (prev === matchId ? null : matchId));
  };

  return (
    <section
      id="knockout"
      className="section-pad"
      aria-labelledby="knockout-heading"
    >
      <div className="container-main">
        {/* ── Section header ──────────────────────── */}
        <div className="mb-8">
          <span className="section-label">Tournament</span>
          <h2 id="knockout-heading" className="section-title mt-1">
            Knockout Bracket
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            Round of 32 → Quarter Finals → Semi Finals → Final
          </p>
        </div>

        {/* ── Selected match detail ────────────────── */}
        {activeMatch && (
          <div className="mb-8 animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <p className="text-text-muted text-xs uppercase tracking-wider">
                Match Details
              </p>
              <button
                onClick={() => setActiveMatch(null)}
                className="btn-ghost text-xs py-1.5 px-3"
                aria-label="Close match details"
              >
                ✕ Close
              </button>
            </div>
            <MatchDetail matchId={activeMatch} knockout={knockout} />
          </div>
        )}

        {/* ── Mobile round tabs ────────────────────── */}
        <RoundTabs
          activeRound={mobileRound}
          onChange={(round) => {
            setMobileRound(round);
            setActiveMatch(null);
          }}
        />

        {loading ? (
          /* Skeleton */
          <div
            className="flex gap-4 overflow-x-auto pb-4"
            aria-busy="true"
            aria-label="Loading bracket"
          >
            {ROUNDS.map((round) => (
              <div key={round.key} className="flex flex-col min-w-52 gap-3">
                <div className="skeleton h-4 w-24 mx-auto mb-2" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-0">
                    <div className="px-3 py-2.5 border-b border-border">
                      <div className="skeleton h-4 w-full" />
                    </div>
                    <div className="px-3 py-2.5">
                      <div className="skeleton h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* ── Desktop bracket — all rounds side by side ── */}
            <div
              className="hidden md:flex gap-6 overflow-x-auto pb-6"
              role="region"
              aria-label="Knockout bracket"
            >
              {ROUNDS.map((round) => {
                const matches = knockout[round.key] || [];
                return (
                  <RoundColumn
                    key={round.key}
                    round={round}
                    matches={matches}
                    activeMatch={activeMatch}
                    onMatchClick={handleMatchClick}
                  />
                );
              })}
            </div>

            {/* ── Mobile — single round at a time ──────────── */}
            <div
              className="md:hidden mt-4"
              role="region"
              aria-label={`${ROUNDS.find((r) => r.key === mobileRound)?.label} matches`}
            >
              <div className="flex flex-col gap-3">
                {(knockout[mobileRound] || []).map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleMatchClick(match.id)}
                    className={[
                      "text-left w-full rounded-lg",
                      "focus-visible:outline-2 focus-visible:outline-accent",
                    ].join(" ")}
                    aria-pressed={activeMatch === match.id}
                    aria-label={`${getTeam(match.home).name} vs ${getTeam(match.away).name}`}
                  >
                    <KnockoutCard
                      match={match}
                      isHighlighted={activeMatch === match.id}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Legend ──────────────────────────────── */}
        <div className="flex items-center gap-6 mt-8 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm bg-accent/20 border border-accent/40"
              aria-hidden="true"
            />
            <span className="text-text-muted text-xs">Winner advances</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm bg-red/20 border border-red/40"
              aria-hidden="true"
            />
            <span className="text-text-muted text-xs">Live match</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm bg-bg-card border border-border opacity-50"
              aria-hidden="true"
            />
            <span className="text-text-muted text-xs">Yet to be decided</span>
          </div>
        </div>
      </div>
    </section>
  );
}
