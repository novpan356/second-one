import React, { useEffect, useRef, useState } from "react";
import {
  Search,
  ArrowUpRight,
  Swords,
  Trophy,
  Activity,
  RefreshCw,
} from "lucide-react";
import { communityCopy } from "./copy.js";
import { playerApi, publicKey } from "./client.js";
import { normalizePlayer, ewgfProfile } from "./model.js";
export default function OnlinePlayers({ lang }) {
  const c = communityCopy[lang],
    [query, setQuery] = useState(""),
    [results, setResults] = useState([]),
    [selected, setSelected] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [searched, setSearched] = useState(false);
  const active = useRef(null),
    generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      active.current?.abort();
    },
    [],
  );
  const load = async (action, value) => {
    if (!playerApi) return;
    active.current?.abort();
    const ctl = new AbortController();
    active.current = ctl;
    const version = ++generation.current;
    const timer = setTimeout(() => ctl.abort(), 15000);
    setBusy(true);
    setError("");
    try {
      const url = new URL(playerApi, location.href);
      url.searchParams.set("action", action);
      if (value) url.searchParams.set(action === "profile" ? "id" : "q", value);
      const headers = { Accept: "application/json" };
      if (publicKey && url.hostname.endsWith(".supabase.co"))
        headers.apikey = publicKey;
      const response = await fetch(url, { headers, signal: ctl.signal });
      if (!response.ok) throw Error("HTTP " + response.status);
      const payload = await response.json();
      if (version !== generation.current) return;
      if (action === "profile") {
        setSelected(normalizePlayer(payload));
      } else {
        if (!Array.isArray(payload)) throw Error("Invalid response");
        setResults(payload.slice(0, 100).map(normalizePlayer));
        setSelected(null);
        setSearched(true);
      }
    } catch (e) {
      if (version === generation.current) {
        setError(c.error);
        setResults([]);
        setSelected(null);
        setSearched(false);
      }
    } finally {
      clearTimeout(timer);
      if (version === generation.current) setBusy(false);
    }
  };
  const search = (e) => {
    e.preventDefault();
    if (query.trim().length >= 3) load("search", query.trim());
  };
  const metric = (label, value) => (
    <div className="online-metric" key={label}>
      <small>{label}</small>
      <b>{value === null || value === "" ? "—" : value}</b>
    </div>
  );
  return (
    <section className="wrap standalone online-page">
      <header className="online-hero">
        <span className="eyebrow">LIVE DATA / THE NEXT OPPONENT</span>
        <h1>{c.network}</h1>
        <p>{c.queryHint}</p>
        <span className="online-hero-mark" aria-hidden="true">
          <Swords size={140} />
        </span>
      </header>
      <div className="online-query-panel">
        <form onSubmit={search}>
          <label htmlFor="online-query">{c.query}</label>
          <div className="online-search">
            <Search size={21} />
            <input
              id="online-query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              minLength={3}
              maxLength={80}
              placeholder={c.query}
            />
            <button
              type="submit"
              className="button community-primary"
              disabled={!playerApi || busy || query.trim().length < 3}
            >
              {busy ? c.loading : c.search}
            </button>
          </div>
        </form>
        <div className="online-external-actions">
          <a
            href={
              query.trim() ? ewgfProfile(query.trim()) : "https://www.ewgf.gg/"
            }
            rel="noreferrer"
            target="_blank"
          >
            {c.openPlayer}
            <ArrowUpRight size={16} />
          </a>
          <a
            href="https://www.ewgf.gg/leaderboards"
            rel="noreferrer"
            target="_blank"
          >
            <Trophy size={17} />
            {c.ladder}
            <ArrowUpRight size={16} />
          </a>
          {playerApi && (
            <button onClick={() => load("leaderboard")} disabled={busy}>
              <RefreshCw size={16} />
              {c.ranking}
            </button>
          )}
        </div>
      </div>
      {!playerApi && <p className="community-notice">{c.noApi}</p>}
      {error && (
        <p role="alert" className="community-error">
          {error}
        </p>
      )}
      {busy && (
        <p role="status" className="community-notice">
          <Activity size={18} />
          {c.loading}
        </p>
      )}
      {selected ? (
        <div className="online-profile">
          <header>
            <span className="eyebrow">PLAYER / {selected.id}</span>
            <h2>{selected.name}</h2>
            <a
              className="community-text-button"
              href={ewgfProfile(selected.id)}
              target="_blank"
              rel="noreferrer"
            >
              EWGF.GG
              <ArrowUpRight size={17} />
            </a>
          </header>
          <div className="online-metrics">
            {[
              [c.points, selected.points],
              [c.position, selected.ranking],
              [c.prowess, selected.prowess],
              [c.matches, selected.matches],
              [
                c.winRate,
                selected.winRate === null ? null : `${selected.winRate}%`,
              ],
              [c.rank, selected.rank],
            ].map(([label, value]) => metric(label, value))}
          </div>
          <h3>{c.record}</h3>
          <div className="online-table-wrap">
            <table className="online-table">
              <thead>
                <tr>
                  <th>{c.updated}</th>
                  <th>{c.query}</th>
                  <th>{c.fighter}</th>
                  <th>W / L</th>
                </tr>
              </thead>
              <tbody>
                {selected.recentMatches.map((m, i) => (
                  <tr key={i}>
                    <td>{m.date || c.unknown}</td>
                    <td>{m.opponent || c.unknown}</td>
                    <td>{m.character || c.unknown}</td>
                    <td
                      className={
                        m.result === "win"
                          ? "match-win"
                          : m.result === "loss"
                            ? "match-loss"
                            : ""
                      }
                    >
                      {m.result === "win"
                        ? "W"
                        : m.result === "loss"
                          ? "L"
                          : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!selected.recentMatches.length && (
            <p className="community-fineprint">{c.unknown}</p>
          )}
          <p className="community-fineprint">
            {c.updated}: {selected.updatedAt || c.unknown}
          </p>
        </div>
      ) : results.length ? (
        <div className="online-table-wrap">
          <table className="online-table">
            <thead>
              <tr>
                <th>{c.position}</th>
                <th>{c.profile}</th>
                <th>{c.points}</th>
                <th>{c.prowess}</th>
                <th>TEKKEN ID</th>
              </tr>
            </thead>
            <tbody>
              {results.map((p) => (
                <tr key={p.id}>
                  <td>{p.ranking ?? "—"}</td>
                  <td>
                    <button onClick={() => load("profile", p.id)}>
                      {p.name}
                      <ArrowUpRight size={14} />
                    </button>
                  </td>
                  <td>{p.points ?? "—"}</td>
                  <td>{p.prowess ?? "—"}</td>
                  <td>{p.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : searched && !busy ? (
        <p>{c.noResults}</p>
      ) : (
        <div className="online-empty">
          <Activity size={38} />
          <span>TEKKEN ID / RANK POINTS / MATCH HISTORY</span>
        </div>
      )}
      <p className="community-fineprint online-provenance">{c.source}</p>
    </section>
  );
}
