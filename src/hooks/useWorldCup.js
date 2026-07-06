// src/hooks/useWorldCup.js
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import {
  GROUPS,
  FIXTURES,
  TOP_SCORERS,
  KNOCKOUT,
  getLiveFixtures,
} from "../data/mockData";

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const OPENFOOTBALL_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const api = axios.create({ timeout: 10_000 });

const POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes
const MAX_FAILS = 3;

// ─────────────────────────────────────────────
// TEAM NAME → 3-LETTER CODE MAP
// openfootball uses full names ("Mexico")
// our app uses codes ("MEX")
// ─────────────────────────────────────────────
const NAME_TO_CODE = {
  Mexico: "MEX",
  "South Africa": "RSA",
  "South Korea": "KOR",
  "Czech Republic": "CZE",
  Canada: "CAN",
  "Bosnia & Herzegovina": "BIH",
  Qatar: "QAT",
  Switzerland: "SUI",
  Brazil: "BRA",
  Morocco: "MAR",
  Haiti: "HAI",
  Scotland: "SCO",
  USA: "USA",
  Paraguay: "PAR",
  Australia: "AUS",
  Turkey: "TUR",
  Germany: "GER",
  Curaçao: "CUW",
  "Ivory Coast": "CIV",
  Ecuador: "ECU",
  Netherlands: "NED",
  Japan: "JPN",
  Sweden: "SWE",
  Tunisia: "TUN",
  Belgium: "BEL",
  Egypt: "EGY",
  Iran: "IRN",
  "New Zealand": "NZL",
  Spain: "ESP",
  "Cape Verde": "CPV",
  "Saudi Arabia": "SAU",
  Uruguay: "URU",
  France: "FRA",
  Senegal: "SEN",
  Iraq: "IRQ",
  Norway: "NOR",
  Argentina: "ARG",
  Algeria: "ALG",
  Austria: "AUT",
  Jordan: "JOR",
  Portugal: "POR",
  "DR Congo": "COD",
  Uzbekistan: "UZB",
  Colombia: "COL",
  England: "ENG",
  Croatia: "CRO",
  Ghana: "GHA",
  Panama: "PAN",
};

const toCode = (name) =>
  NAME_TO_CODE[name] || name?.slice(0, 3).toUpperCase() || "TBD";

// ─────────────────────────────────────────────
// ROUND → bracket key map
// ─────────────────────────────────────────────
const ROUND_MAP = {
  "Round of 32": "roundOf32",
  "Round of 16": "roundOf32",
  "Quarter-final": "quarterFinals",
  "Semi-final": "semiFinals",
  Final: "final",
  "Match for third place": "thirdPlace",
};

// ─────────────────────────────────────────────
// NORMALISE a single openfootball match
// ─────────────────────────────────────────────
const normaliseMatch = (m, index) => {
  const hasScore = m.score?.ft != null;
  const isKnockout = !m.group;
  const group = m.group ? m.group.replace("Group ", "").trim() : null;
  const matchdayNum = m.round?.match(/\d+/)?.[0] || null;

  const homeCode =
    isKnockout && !NAME_TO_CODE[m.team1] ? "TBD" : toCode(m.team1);
  const awayCode =
    isKnockout && !NAME_TO_CODE[m.team2] ? "TBD" : toCode(m.team2);

  return {
    id: `of_${index}`,
    group,
    matchday: matchdayNum ? parseInt(matchdayNum) : null,
    home: homeCode,
    away: awayCode,
    homeScore: hasScore ? m.score.ft[0] : null,
    awayScore: hasScore ? m.score.ft[1] : null,
    date: m.date || "",
    time: m.time?.split(" ")[0] || "",
    venue: m.ground || "",
    city: m.ground || "",
    status: hasScore ? "finished" : "upcoming",
    minute: null,
    round: m.round || "",
  };
};

// ─────────────────────────────────────────────
// BUILD GROUP STANDINGS from match results
// ─────────────────────────────────────────────
const buildGroupsFromMatches = (matches) => {
  const groups = {};

  matches.forEach((m) => {
    if (!m.group) return;
    const key = m.group;

    if (!groups[key]) groups[key] = { name: `Group ${key}`, teams: {} };
    [m.home, m.away].forEach((code) => {
      if (!groups[key].teams[code]) {
        groups[key].teams[code] = {
          code,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          gf: 0,
          ga: 0,
          gd: 0,
          pts: 0,
        };
      }
    });

    if (m.status === "finished" && m.homeScore !== null) {
      const h = groups[key].teams[m.home];
      const a = groups[key].teams[m.away];
      const hs = m.homeScore;
      const as = m.awayScore;

      h.played++;
      a.played++;
      h.gf += hs;
      h.ga += as;
      a.gf += as;
      a.ga += hs;

      if (hs > as) {
        h.won++;
        h.pts += 3;
        a.lost++;
      } else if (hs < as) {
        a.won++;
        a.pts += 3;
        h.lost++;
      } else {
        h.drawn++;
        h.pts++;
        a.drawn++;
        a.pts++;
      }
    }
  });

  const result = {};
  Object.keys(groups)
    .sort()
    .forEach((key) => {
      result[key] = {
        name: groups[key].name,
        teams: Object.values(groups[key].teams)
          .map((t) => ({ ...t, gd: t.gf - t.ga }))
          .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf),
      };
    });

  return result;
};

// ─────────────────────────────────────────────
// BUILD KNOCKOUT BRACKET from match data
// ─────────────────────────────────────────────
const buildKnockoutFromMatches = (matches) => {
  const knockout = {
    roundOf32: [],
    quarterFinals: [],
    semiFinals: [],
    final: [],
    thirdPlace: [],
  };

  matches
    .filter((m) => !m.group)
    .forEach((m) => {
      const key = ROUND_MAP[m.round];
      if (key && knockout[key]) knockout[key].push(m);
    });

  return knockout;
};

// ─────────────────────────────────────────────
// useWorldCup — main data hook
// ─────────────────────────────────────────────
export function useWorldCup() {
  const [groups, setGroups] = useState(GROUPS);
  const [fixtures, setFixtures] = useState(FIXTURES);
  const [scorers, setScorers] = useState(TOP_SCORERS);
  const [knockout, setKnockout] = useState(KNOCKOUT);
  const [live, setLive] = useState(getLiveFixtures());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dataSource, setDataSource] = useState("mock");

  const isMounted = useRef(true);
  const failCount = useRef(0);

  const fetchAll = useCallback(async () => {
    if (!lastUpdated) setLoading(true);
    setError(null);

    try {
      const res = await api.get(OPENFOOTBALL_URL);
      if (!isMounted.current) return;

      const rawMatches = res.data?.matches;
      if (!Array.isArray(rawMatches) || rawMatches.length === 0) {
        throw new Error("Empty response");
      }

      const allMatches = rawMatches.map(normaliseMatch);
      const groupMatches = allMatches.filter((m) => m.group);
      const builtGroups = buildGroupsFromMatches(groupMatches);
      const builtKnockout = buildKnockoutFromMatches(allMatches);

      if (isMounted.current) {
        setFixtures(groupMatches);
        setGroups(builtGroups);
        setKnockout(builtKnockout);
        setLive([]);
        setLastUpdated(new Date());
        setDataSource("live");
        failCount.current = 0;
        console.log("✅ openfootball loaded:", groupMatches.length, "fixtures");
      }
    } catch (err) {
      if (!isMounted.current) return;
      failCount.current++;
      if (failCount.current === 1) {
        console.warn("openfootball unavailable, using mock data:", err.message);
        setError("Live data unavailable — showing cached data");
        setDataSource("mock");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [lastUpdated]);

  useEffect(() => {
    isMounted.current = true;
    failCount.current = 0;
    fetchAll();

    const interval = setInterval(() => {
      if (!isMounted.current) return;
      if (failCount.current >= MAX_FAILS) {
        clearInterval(interval);
        return;
      }
      fetchAll();
    }, POLL_INTERVAL);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && isMounted.current)
        fetchAll();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [fetchAll]);

  return {
    groups,
    fixtures,
    scorers,
    knockout,
    live,
    loading,
    error,
    lastUpdated,
    dataSource,
    hasLive: live.length > 0,
    liveCount: live.length,
    refresh: () => {
      failCount.current = 0;
      setError(null);
      fetchAll();
    },
  };
}

// ─────────────────────────────────────────────
// useLiveMatches — sidebar widget
// openfootball is not live — sidebar shows empty
// ─────────────────────────────────────────────
export function useLiveMatches() {
  return {
    matches: [],
    loading: false,
    lastUpdated: new Date(),
    refresh: () => {},
  };
}
