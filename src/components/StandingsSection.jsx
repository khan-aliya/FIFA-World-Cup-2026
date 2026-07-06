// src/components/StandingsSection.jsx
import { useState, useMemo } from "react";
import { useWorldCup } from "../hooks/useWorldCup";
import { getTeam } from "../data/mockData";

const COLUMNS = [
  { key: "played", label: "P", ariaLabel: "Played", title: "Games played" },
  { key: "won", label: "W", ariaLabel: "Won", title: "Games won" },
  { key: "drawn", label: "D", ariaLabel: "Drawn", title: "Games drawn" },
  { key: "lost", label: "L", ariaLabel: "Lost", title: "Games lost" },
  { key: "gf", label: "GF", ariaLabel: "Goals for", title: "Goals scored" },
  {
    key: "ga",
    label: "GA",
    ariaLabel: "Goals against",
    title: "Goals conceded",
  },
  {
    key: "gd",
    label: "GD",
    ariaLabel: "Goal difference",
    title: "Goal difference",
  },
  { key: "pts", label: "Pts", ariaLabel: "Points", title: "Points" },
];

const getPositionStyle = (position) => {
  if (position === 1 || position === 2) {
    return {
      bg: "bg-accent/15 text-accent border border-accent/30",
      ariaLabel: "Qualifies for Round of 32",
    };
  }
  if (position === 3) {
    return {
      bg: "bg-gold/10 text-gold border border-gold/20",
      ariaLabel: "May qualify as best third-placed team",
    };
  }
  return {
    bg: "bg-bg-deep text-text-muted border border-border",
    ariaLabel: "Eliminated",
  };
};

function GroupTable({ groupKey, groupData }) {
  const teams = groupData.teams || [];

  return (
    <div className="card p-0 overflow-hidden">
      {/* ── Group header ──────────────────────────── */}
      <div
        className={[
          "px-4 py-3 border-b border-border",
          "flex items-center justify-between",
          "bg-bg-navy",
        ].join(" ")}
      >
        <h3 className="font-heading font-bold text-sm text-text-primary">
          {groupData.name}
        </h3>
        <span className="text-text-muted text-xs">{teams.length} teams</span>
      </div>

      {/* ── Table ─────────────────────────────────── */}
      <div className="overflow-x-auto">
        <table
          className="w-full text-sm"
          aria-label={`${groupData.name} standings`}
        >
          <thead>
            <tr className="border-b border-border">
              <th
                scope="col"
                className={[
                  "text-left px-4 py-2",
                  "text-text-muted text-xs font-semibold",
                  "uppercase tracking-wider w-full",
                ].join(" ")}
              >
                Team
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={[
                    "text-center px-2 py-2",
                    "text-text-muted text-xs font-semibold",
                    "uppercase tracking-wider whitespace-nowrap",
                    col.key === "pts" ? "text-accent" : "",
                  ].join(" ")}
                  title={col.title}
                  aria-label={col.ariaLabel}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {teams.map((team, index) => {
              const position = index + 1;
              const teamData = getTeam(team.code);
              const posStyle = getPositionStyle(position);
              const isTop2 = position <= 2;

              return (
                <tr
                  key={team.code}
                  className={[
                    "border-b border-border last:border-b-0",
                    "transition-colors duration-150",
                    "hover:bg-bg-card-hover",
                    isTop2 ? "bg-accent/3" : "",
                  ].join(" ")}
                  aria-label={`${teamData.name}, position ${position}, ${posStyle.ariaLabel}`}
                >
                  {/* Position + flag + name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "w-6 h-6 rounded-full flex items-center justify-center",
                          "text-xs font-black shrink-0",
                          posStyle.bg,
                        ].join(" ")}
                        aria-label={posStyle.ariaLabel}
                      >
                        {position}
                      </span>
                      <span className="text-2xl shrink-0" aria-hidden="true">
                        {teamData.flag}
                      </span>
                      <div className="min-w-0">
                        <p
                          className={[
                            "font-semibold truncate text-xs sm:text-sm",
                            isTop2
                              ? "text-text-primary"
                              : "text-text-secondary",
                          ].join(" ")}
                        >
                          {teamData.name}
                        </p>
                        <p className="text-text-muted text-xs hidden sm:block">
                          {teamData.confederation}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Stat cells */}
                  {COLUMNS.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        "text-center px-2 py-3",
                        "tabular-nums text-xs sm:text-sm",
                        col.key === "pts"
                          ? "font-black text-accent"
                          : "text-text-secondary",
                        col.key === "gd" && team[col.key] > 0
                          ? "text-accent"
                          : "",
                        col.key === "gd" && team[col.key] < 0 ? "text-red" : "",
                      ].join(" ")}
                      aria-label={`${col.ariaLabel}: ${col.key === "gd" && team[col.key] > 0 ? "+" : ""}${team[col.key]}`}
                    >
                      {col.key === "gd" && team[col.key] > 0 ? "+" : ""}
                      {team[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Qualification legend ──────────────────── */}
      <div
        className={[
          "px-4 py-2 border-t border-border",
          "flex items-center gap-4 flex-wrap",
          "bg-bg-navy",
        ].join(" ")}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full bg-accent/50"
            aria-hidden="true"
          />
          <span className="text-text-muted text-xs">Advances</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full bg-gold/40"
            aria-hidden="true"
          />
          <span className="text-text-muted text-xs">
            May advance (best 3rd)
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StandingsSection() {
  const { groups, loading } = useWorldCup();
  const [activeGroup, setActiveGroup] = useState("all");

  const groupKeys = useMemo(() => {
    return Object.keys(groups).sort();
  }, [groups]);

  const displayGroups = useMemo(() => {
    if (activeGroup === "all") return groupKeys;
    return groupKeys.filter((k) => k === activeGroup);
  }, [groupKeys, activeGroup]);

  return (
    <section
      id="standings"
      className="section-pad bg-bg-navy"
      aria-labelledby="standings-heading"
    >
      <div className="container-main">
        {/* ── Section header ──────────────────────── */}
        <div className="mb-8">
          <span className="section-label">Group Stage</span>
          <h2 id="standings-heading" className="section-title mt-1">
            Group Standings
          </h2>
          <p className="text-text-secondary text-sm mt-2">
            Top 2 from each group advance · Best 8 third-placed teams also
            advance
          </p>
        </div>

        {/* ── Group tabs ──────────────────────────── */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide"
          role="tablist"
          aria-label="Select group to view standings"
        >
          <button
            role="tab"
            onClick={() => setActiveGroup("all")}
            aria-selected={activeGroup === "all"}
            aria-controls="standings-display"
            className={[
              "tab-btn shrink-0",
              activeGroup === "all" ? "active" : "",
            ].join(" ")}
          >
            All Groups
          </button>
          {groupKeys.map((key) => (
            <button
              key={key}
              role="tab"
              onClick={() => setActiveGroup(key)}
              aria-selected={activeGroup === key}
              aria-controls="standings-display"
              className={[
                "tab-btn shrink-0",
                activeGroup === key ? "active" : "",
              ].join(" ")}
            >
              {key}
            </button>
          ))}
        </div>

        {/* ── Standings display ────────────────────── */}
        <div
          id="standings-display"
          role="tabpanel"
          aria-label={
            activeGroup === "all"
              ? "All group standings"
              : `Group ${activeGroup} standings`
          }
        >
          {loading && Object.keys(groups).length === 0 ? (
            /* Skeleton */
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              aria-busy="true"
            >
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-0 overflow-hidden">
                  <div className="px-4 py-3 bg-bg-navy border-b border-border">
                    <div className="skeleton h-4 w-24" />
                  </div>
                  {[1, 2, 3, 4].map((j) => (
                    <div
                      key={j}
                      className="px-4 py-3 border-b border-border flex gap-3"
                    >
                      <div className="skeleton h-6 w-6 rounded-full" />
                      <div className="skeleton h-6 w-6 rounded-full" />
                      <div className="skeleton h-4 w-28 mt-1" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : activeGroup === "all" ? (
            /* All groups — 2 column grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayGroups.map((key) => (
                <GroupTable key={key} groupKey={key} groupData={groups[key]} />
              ))}
            </div>
          ) : (
            /* Single group — centred */
            <div className="max-w-2xl mx-auto">
              {displayGroups.map((key) => (
                <GroupTable key={key} groupKey={key} groupData={groups[key]} />
              ))}
            </div>
          )}
        </div>

        {/* ── Format note ─────────────────────────── */}
        <div
          className={[
            "mt-8 card border-border/50",
            "flex flex-col sm:flex-row gap-4",
            "text-text-muted text-xs",
          ].join(" ")}
        >
          <div className="flex items-start gap-2">
            <span aria-hidden="true">📋</span>
            <div>
              <p className="font-semibold text-text-secondary mb-1">
                Tournament Format
              </p>
              <p>
                48 teams across 12 groups (A–L). Top 2 from each group plus the
                8 best third-placed teams advance to the Round of 32.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 sm:border-l sm:border-border sm:pl-4">
            <span aria-hidden="true">⚖️</span>
            <div>
              <p className="font-semibold text-text-secondary mb-1">
                Tiebreakers
              </p>
              <p>
                Points → Goal difference → Goals scored → Head-to-head → Fair
                play points → Drawing of lots.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
