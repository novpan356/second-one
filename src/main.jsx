import React, { useState, useEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Heart,
  Check,
  Copy,
  Info,
  SlidersHorizontal,
  Globe,
  Menu,
  ExternalLink,
  MoveHorizontal,
  Shield,
  Swords,
  Clock,
  BookOpen,
  Package,
  Users,
  RotateCcw,
} from "lucide-react";
import roster from "./roster.js";
import { copy, pick } from "./i18n";
import {
  editorial,
  localizedName,
  country,
  style,
  players,
  officialLinks,
} from "./editorial";
import { filterMoves, firstStartup, punishCandidates } from "./query";
import "./style.css";
import "./arena.css";
import "./lore.css";
import { loreCopy } from "./lore/copy.js";
import {
  movementAssessment,
  movementMatches,
  movementCopy,
} from "./movement.js";
const ProfileLore = React.lazy(() =>
  import("./Lore.jsx").then((m) => ({ default: m.ProfileLore })),
);
const StoryArchive = React.lazy(() =>
  import("./Lore.jsx").then((m) => ({ default: m.StoryArchive })),
);
const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`;
const portraitIds = new Set(roster.map((f) => f.id));
const tabs = [
  "moves",
  "combos",
  "punish",
  "movement",
  "story",
  "shop",
  "players",
];
const icons = {
  moves: Swords,
  combos: MoveHorizontal,
  punish: Shield,
  movement: MoveHorizontal,
  story: BookOpen,
  shop: Package,
  players: Users,
};
function storageGet(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}
function routeFromHash() {
  const parts = decodeURIComponent(location.hash.slice(1)).split("/");
  if (parts[0] === "fighter" && roster.some((f) => f.id === parts[1]))
    return {
      page: "fighter",
      id: parts[1],
      tab: tabs.includes(parts[2]) ? parts[2] : "moves",
    };
  if (parts[0] === "story")
    return {
      page: "story",
      section: ["main", "history", "extra", "people"].includes(parts[1])
        ? parts[1]
        : "main",
      person: parts[1] === "person" ? parts[2] : null,
    };
  return {
    page: ["updates", "players", "lab"].includes(parts[0]) ? parts[0] : "home",
    anchor: parts[0] === "roster" ? "roster" : null,
  };
}
function navigate(hash) {
  if (location.hash === `#${hash}`) {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
  } else location.hash = hash;
}
function App() {
  const [lang, setLang] = useState(() =>
    ["zh", "en", "ja"].includes(storageGet("atlas-language", "zh"))
      ? storageGet("atlas-language", "zh")
      : "zh",
  );
  const [route, setRoute] = useState(routeFromHash);
  const routeRef = useRef(route);
  const [saved, setSaved] = useState(() => {
    const v = storageGet("atlas-favorites", []);
    return Array.isArray(v) ? v : [];
  });
  const [mobile, setMobile] = useState(false);
  const [sourceOpen, setSourceOpen] = useState(false);
  const t = copy[lang];
  useEffect(() => {
    function change() {
      const next = routeFromHash();
      const previous = routeRef.current;
      routeRef.current = next;
      setRoute(next);
      setMobile(false);
      if (
        previous.page === "fighter" &&
        next.page === "fighter" &&
        previous.id === next.id
      ) {
        const content = document.querySelector(".fighter-content");
        const tabs = document.querySelector(".fighter-tabs");
        if (content && tabs && window.scrollY > content.offsetTop) {
          const headerHeight =
            document.querySelector(".site-header").offsetHeight;
          window.scrollTo({
            top: content.offsetTop - tabs.offsetHeight - headerHeight,
            behavior: "smooth",
          });
        }
        return;
      }
      if (next.anchor)
        setTimeout(
          () =>
            document
              .getElementById(next.anchor)
              ?.scrollIntoView({ behavior: "smooth" }),
          60,
        );
      else
        window.scrollTo({
          top: 0,
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
    }
    window.addEventListener("hashchange", change);
    if (route.anchor)
      setTimeout(
        () => document.getElementById(route.anchor)?.scrollIntoView(),
        120,
      );
    return () => window.removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    document.documentElement.lang = { zh: "zh-CN", en: "en", ja: "ja" }[lang];
    try {
      localStorage.setItem("atlas-language", JSON.stringify(lang));
    } catch {}
  }, [lang]);
  useEffect(() => {
    try {
      localStorage.setItem("atlas-favorites", JSON.stringify(saved));
    } catch {}
  }, [saved]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [route, lang]);
  const toggleSave = (id) =>
    setSaved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const [storyMotion, setStoryMotion] = useState(0);
  useEffect(() => {
    const change = () => setStoryMotion((v) => v + 1);
    window.addEventListener("atlas-lore-transition", change);
    return () => window.removeEventListener("atlas-lore-transition", change);
  }, []);
  const motionStarted = useRef(false);
  useEffect(() => {
    if (!motionStarted.current) {
      motionStarted.current = true;
      return;
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = [
      ...Array.from(
        document.querySelectorAll("main, .site-header, .footer"),
      ).map((el, i) =>
        el.animate(
          [
            { opacity: 0.45, transform: `translateX(${i === 1 ? -14 : 28}px)` },
            { opacity: 1, transform: "translateX(0)" },
          ],
          { duration: 520, delay: i * 25, easing: "cubic-bezier(.16,1,.3,1)" },
        ),
      ),
    ];
    return () => animations.forEach((a) => a.cancel());
  }, [route, lang, storyMotion]);
  const context = { lang, t, saved, toggleSave, setSourceOpen };
  return (
    <>
      <header className="site-header">
        <div className="nav-shell">
          <button
            className="brand"
            onClick={() => navigate("")}
            aria-label="TEKKEN ATLAS home"
          >
            <span className="brand-symbol">
              T<span>8</span>
            </span>
            <span>
              TEKKEN <b>ATLAS</b>
            </span>
          </button>
          <nav
            aria-label={
              lang === "zh"
                ? "主导航"
                : lang === "ja"
                  ? "メインナビゲーション"
                  : "Main navigation"
            }
            className={mobile ? "mobile-open" : ""}
          >
            {t.nav.map((name, i) => (
              <button
                key={i}
                className={
                  route.page ===
                  ["home", "lab", "updates", "players", "story"][i]
                    ? "current"
                    : ""
                }
                onClick={() =>
                  navigate(["roster", "lab", "updates", "players", "story"][i])
                }
              >
                {name}
              </button>
            ))}
          </nav>
          <div className="nav-right">
            <div className="language-switch" aria-label="Language">
              {[
                ["zh", "中"],
                ["en", "EN"],
                ["ja", "JP"],
              ].map(([id, label]) => (
                <button
                  lang={id === "zh" ? "zh-CN" : id}
                  key={id}
                  onClick={() => setLang(id)}
                  aria-pressed={lang === id}
                  className={lang === id ? "active" : ""}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              className="menu-button icon-button"
              onClick={() => setMobile(!mobile)}
              aria-label="Menu"
              aria-expanded={mobile}
            >
              {mobile ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>
      <div className="status-strip">
        <span className="status-dot" />
        {t.community}
        <span className="status-sep">·</span>2026.07.27
        <span className="status-sep">·</span>
        <button onClick={() => setSourceOpen(true)}>
          {t.allSources}
          <ChevronRight size={12} />
        </button>
      </div>
      <div
        key={`${route.page}-${route.id}-${route.tab}-${route.anchor}-${route.section}-${route.person}-${lang}-${storyMotion}`}
        className="transition-strike"
        aria-hidden="true"
      >
        <i />
        <i />
      </div>
      <main>
        {route.page === "home" ? (
          <Home {...context} />
        ) : route.page === "fighter" ? (
          <Fighter key={route.id} {...context} id={route.id} tab={route.tab} />
        ) : route.page === "lab" ? (
          <Lab {...context} />
        ) : route.page === "story" ? (
          <React.Suspense
            fallback={
              <div className="loading-panel">
                <span className="loader" />
                {t.load}
              </div>
            }
          >
            <StoryArchive {...context} route={route} />
          </React.Suspense>
        ) : route.page === "updates" ? (
          <Updates {...context} />
        ) : (
          <Players {...context} />
        )}
      </main>
      <Footer {...context} />
      {sourceOpen && (
        <Modal onClose={() => setSourceOpen(false)} title={t.sources} t={t}>
          <SourcePanel {...context} />
        </Modal>
      )}
    </>
  );
}
function Portrait({ fighter, className = "", hero = false }) {
  const [failed, setFailed] = useState(false);
  const hasArt = portraitIds.has(fighter.id) && !failed;
  return (
    <div
      className={`portrait ${className} ${hasArt ? "has-art" : "abstract-art"}`}
      data-character={fighter.id}
    >
      {hasArt ? (
        <img
          src={assetPath(`art/${fighter.id}.webp`)}
          alt={fighter.name}
          loading={hero ? "eager" : "lazy"}
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <span className="abstract-halo" />
          <span className="portrait-monogram">
            {fighter.name
              .split(" ")
              .map((x) => x[0])
              .slice(0, 2)
              .join("")}
          </span>
          <span className="abstract-line" />
        </>
      )}
      <span className="portrait-grain" aria-hidden="true" />
    </div>
  );
}
function Home(ctx) {
  const { t, lang } = ctx;
  const total = roster.reduce((a, r) => a + r.count, 0);
  return (
    <>
      <section className="hero">
        <img
          className="hero-backdrop"
          src={assetPath("art/hero.webp")}
          alt=""
        />
        <div className="hero-shade" />
        <div className="hero-copy">
          <div className="eyebrow light">
            <span className="tiny-line" />
            THE ART OF THE FIGHT
          </div>
          <h1>
            {t.hero1}
            <br />
            <span>{t.hero2}</span>
          </h1>
          <p>{t.heroSub}</p>
          <div className="hero-actions">
            <button
              className="button light-button"
              onClick={() => navigate("roster")}
            >
              {t.explore}
              <ArrowRight size={17} />
            </button>
            <button
              className="text-button on-dark"
              onClick={() => navigate("lab")}
            >
              {t.heroLink}
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className="versus-lockup" aria-hidden="true">
          <span>PLAYER 01</span>
          <b>VS</b>
          <span>PLAYER 02</span>
        </div>
        <span className="hero-index">01 / THE FIGHTERS</span>
        <div className="hero-caption">
          JIN KAZAMA <span>VS</span> KAZUYA MISHIMA
        </div>
        <div className="hero-bottom">
          <span>
            TEKKEN <b>8</b>
          </span>
          <span>
            KNOW YOUR FIGHT.
            <br />
            FIND YOUR EDGE.
          </span>
          <button onClick={() => navigate("roster")} aria-label={t.explore}>
            <ChevronDown size={20} />
          </button>
        </div>
      </section>
      <div className="arena-ticker" aria-hidden="true">
        <span>FRAME / ADVANTAGE</span>
        <b>KNOW YOUR OPPONENT</b>
        <span>MOVE / COUNTERMOVE</span>
        <b>FIND YOUR EDGE</b>
        <span>THE NEXT BATTLE</span>
      </div>
      <div className="stats-bar">
        <div>
          <b>
            {roster.length}
            <span> /</span>
          </b>
          <p>{t.fights}</p>
        </div>
        <div>
          <b>
            {total.toLocaleString()}
            <span> /</span>
          </b>
          <p>{t.entries}</p>
        </div>
        <div>
          <b>
            03<span> /</span>
          </b>
          <p>{t.languages}</p>
        </div>
        <span className="stats-note">{t.dataNote}</span>
      </div>
      <Roster {...ctx} />
      <section className="home-story-feature wrap" data-reveal>
        <div>
          <span className="eyebrow">THE MISHIMA SAGA</span>
          <h2>{loreCopy[lang].title}</h2>
          <p>{loreCopy[lang].intro}</p>
          <button
            className="button dark-button"
            onClick={() => navigate("story")}
          >
            {loreCopy[lang].storyButton}
            <BookOpen size={17} />
          </button>
        </div>
        <div className="home-story-vs" aria-hidden="true">
          <Portrait fighter={roster.find((f) => f.id === "jin")} />
          <b>
            血<br />
            FATE
          </b>
          <Portrait fighter={roster.find((f) => f.id === "kazuya")} />
        </div>
      </section>
      <section className="lab-feature" data-reveal>
        <img src={assetPath("art/lab.webp")} alt="" />
        <div className="lab-gradient" />
        <div className="lab-feature-copy">
          <div className="eyebrow light">THE FIGHT LAB</div>
          <h2>{t.labTitle}</h2>
          <p>{t.labSub}</p>
          <button
            className="button light-button"
            onClick={() => navigate("lab")}
          >
            {t.labCta}
            <ArrowUpRight size={18} />
          </button>
        </div>
        <div className="lab-feature-detail">
          FRAME DATA. COMBOS.
          <br />
          THE DETAILS MAKE THE DIFFERENCE.
        </div>
      </section>
      <section className="home-editorial wrap" data-reveal>
        <div>
          <div className="eyebrow">BEYOND THE FIGHT</div>
          <h2>{t.playerTitle}</h2>
          <p>{t.playerSub}</p>
          <button className="text-button" onClick={() => navigate("players")}>
            {t.nav[3]}
            <ArrowUpRight size={17} />
          </button>
        </div>
        <div className="mini-player-stack">
          {players.slice(0, 3).map((p, i) => (
            <button
              key={p.name}
              onClick={() => navigate("players")}
              className="mini-player"
            >
              <span className="mini-player-number">0{i + 1}</span>
              <span>
                <b>{p.name}</b>
                <small>{country(p.nation, lang)}</small>
              </span>
              <ArrowUpRight size={20} />
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
function Roster(ctx) {
  const { t, lang, saved, toggleSave } = ctx;
  const [q, setQ] = useState("");
  const [season, setSeason] = useState("all");
  const [limit, setLimit] = useState(48);
  const [fav, setFav] = useState(false);
  const filtered = useMemo(
    () =>
      roster.filter(
        (r) =>
          (season === "all" || r.season === Number(season)) &&
          (!fav || saved.includes(r.id)) &&
          (!q ||
            [
              r.name,
              r.zh,
              editorial[r.id]?.ja,
              r.country,
              country(r.country, lang),
              r.style,
              style(r.style, lang),
            ].some((s) => s?.toLowerCase().includes(q.toLowerCase()))),
      ),
    [q, season, fav, saved, lang],
  );
  useEffect(() => setLimit(48), [q, season, fav]);
  return (
    <section className="roster-section wrap" id="roster">
      <div className="section-heading" data-reveal>
        <div>
          <div className="eyebrow">THE FIGHTERS</div>
          <h2>{t.rosterTitle}</h2>
          <p>{t.rosterSub}</p>
        </div>
        <span className="section-count">
          {String(roster.length).padStart(2, "0")}
          <small>{t.count}</small>
        </span>
      </div>
      <div className="roster-toolbar">
        <div className="segmented roster-filters">
          {[
            ["all", t.all],
            ["0", t.base],
            ["1", t.s1],
            ["2", t.s2],
            ["3", t.s3],
          ].map(([id, label]) => (
            <button
              key={id}
              className={season === id ? "active" : ""}
              aria-pressed={season === id}
              onClick={() => setSeason(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="search-input">
          <Search size={17} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
          {q && (
            <button onClick={() => setQ("")} aria-label={t.clear}>
              <X size={14} />
            </button>
          )}
        </label>
      </div>
      <div className="roster-results">
        <span>
          {filtered.length} {t.count}
        </span>
        <button
          className={fav ? "favorite-filter selected" : "favorite-filter"}
          onClick={() => setFav(!fav)}
          aria-pressed={fav}
        >
          <Heart size={14} fill={fav ? "currentColor" : "none"} />
          {t.onlySaved}
        </button>
      </div>
      <div className="fighter-grid">
        {filtered.slice(0, limit).map((fighter, i) => (
          <article
            className="fighter-card"
            key={fighter.id}
            style={{ "--card-delay": `${Math.min(i, 7) * 35}ms` }}
          >
            <button
              className="fighter-card-link"
              onClick={() => navigate(`fighter/${fighter.id}/moves`)}
              aria-label={`${t.view} ${localizedName(fighter, lang)}`}
            >
              <div className="fighter-card-image">
                <Portrait fighter={fighter} />
                <span className="fighter-card-number">
                  {String(roster.indexOf(fighter) + 1).padStart(2, "0")}
                </span>
                {fighter.season > 0 && (
                  <span className="dlc-badge">
                    {fighter.season === 3
                      ? "S3 · COMMUNITY"
                      : `DLC · S${fighter.season}`}
                  </span>
                )}
                <span className="card-open">
                  <ArrowUpRight size={22} />
                </span>
              </div>
              <div className="fighter-card-info">
                <span className="fighter-origin">
                  {country(fighter.country, lang)}
                </span>
                <h3>{localizedName(fighter, lang)}</h3>
                <span className="fighter-card-sub">
                  {fighter.name.toUpperCase()}
                </span>
                <div className="fighter-card-style">
                  {style(fighter.style, lang)}
                </div>
              </div>
            </button>
            <button
              className="save-button"
              aria-label={`${saved.includes(fighter.id) ? t.unfavorite : t.favorite} ${localizedName(fighter, lang)}`}
              aria-pressed={saved.includes(fighter.id)}
              onClick={() => toggleSave(fighter.id)}
            >
              <Heart
                size={16}
                fill={saved.includes(fighter.id) ? "currentColor" : "none"}
              />
            </button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <Empty
          t={t}
          onReset={() => {
            setQ("");
            setSeason("all");
            setFav(false);
          }}
        />
      )}
      {filtered.length > limit && (
        <div className="load-more">
          <button
            className="button outline-button"
            onClick={() => setLimit(limit + 12)}
          >
            {t.more}
            <span>
              {Math.min(limit, filtered.length)} / {filtered.length}
            </span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}
      <p className="roster-data-note">
        <Info size={14} />
        {t.officialPending} · {t.versionUnknown}
      </p>
    </section>
  );
}
function Lab(ctx) {
  const { t, lang } = ctx;
  const [id, setId] = useState("jin");
  const fighter = roster.find((x) => x.id === id);
  return (
    <section className="wrap standalone">
      <div className="eyebrow">THE FIGHT LAB</div>
      <h1 className="page-title">{t.labTitle}</h1>
      <p className="page-subtitle">{t.labSub}</p>
      <div className="lab-select-card">
        <Portrait fighter={fighter} />
        <div>
          <label className="field-label" htmlFor="lab-fighter">
            {t.nav[0]}
          </label>
          <select
            id="lab-fighter"
            value={id}
            onChange={(e) => setId(e.target.value)}
          >
            {roster.map((r) => (
              <option key={r.id} value={r.id}>
                {localizedName(r, lang)}
                {r.season ? ` · S${r.season} DLC` : ""}
              </option>
            ))}
          </select>
          <h2>{localizedName(fighter, lang)}</h2>
          <p>{style(fighter.style, lang)}</p>
          <div className="lab-shortcuts">
            {["moves", "combos", "punish", "movement"].map((tab) => {
              const Icon = icons[tab];
              return (
                <button
                  className="lab-shortcut"
                  key={tab}
                  onClick={() => navigate(`fighter/${id}/${tab}`)}
                >
                  <Icon size={20} />
                  {t[tab]}
                  <ArrowUpRight size={16} />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Notation t={t} />
    </section>
  );
}
function Fighter(ctx) {
  const { id, tab, lang, t, saved, toggleSave } = ctx;
  const fighter = roster.find((r) => r.id === id);
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [move, setMove] = useState(null);
  useEffect(() => {
    const ctl = new AbortController();
    setData(null);
    setError(false);
    fetch(assetPath(`data/${id}.json`), { signal: ctl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then((d) => {
        if (!Array.isArray(d.moves)) throw new Error("Invalid data");
        setData(d);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(true);
      });
    return () => ctl.abort();
  }, [id, attempt]);
  useEffect(() => setMove(null), [id, tab]);
  return (
    <>
      <section className="fighter-hero">
        <div className="wrap fighter-hero-inner">
          <div className="fighter-hero-copy">
            <button className="back-button" onClick={() => navigate("roster")}>
              <ArrowLeft size={15} />
              {t.back}
            </button>
            <div className="eyebrow light">{fighter.epithet.toUpperCase()}</div>
            <h1>{localizedName(fighter, lang)}</h1>
            <p className="fighter-hero-english">{fighter.name.toUpperCase()}</p>
            <p className="fighter-hero-summary">
              {pick(editorial[id]?.story, lang)}
            </p>
            <div className="fighter-hero-tags">
              <span>{country(fighter.country, lang)}</span>
              <span>{style(fighter.style, lang)}</span>
              <span>{fighter.season ? `S${fighter.season} DLC` : t.base}</span>
            </div>
            <button
              className={
                "button " +
                (saved.includes(id) ? "saved-button" : "outline-light")
              }
              onClick={() => toggleSave(id)}
              aria-pressed={saved.includes(id)}
            >
              <Heart
                size={16}
                fill={saved.includes(id) ? "currentColor" : "none"}
              />
              {saved.includes(id) ? t.unfavorite : t.favorite}
            </button>
          </div>
          <Portrait fighter={fighter} hero className="fighter-hero-art" />
          <span className="fighter-hero-marker">
            {String(roster.indexOf(fighter) + 1).padStart(2, "0")}
            <span>/ ATLAS</span>
          </span>
        </div>
      </section>
      <div className="fighter-tabs">
        <div className="wrap" role="tablist">
          {tabs.map((key) => {
            const Icon = icons[key];
            return (
              <button
                role="tab"
                aria-selected={tab === key}
                className={tab === key ? "active" : ""}
                key={key}
                onClick={() => navigate(`fighter/${id}/${key}`)}
              >
                <Icon size={16} />
                {t[key]}
              </button>
            );
          })}
        </div>
      </div>
      <section
        className="wrap fighter-content"
        role="tabpanel"
        aria-label={t[tab]}
        key={tab}
      >
        <div className="data-banner">
          <div>
            <span className="status-dot" />
            <span>{t.dataNote}</span>
          </div>
          <button onClick={() => ctx.setSourceOpen(true)}>
            <Info size={15} />
            {t.allSources}
          </button>
        </div>
        {fighter.coverage === "partial-snapshot" && (
          <p className="inline-notice">{t.partial}</p>
        )}
        {fighter.season === 3 && (
          <p className="inline-notice">{t.officialPending}</p>
        )}
        {["story", "shop", "players"].includes(tab) ? (
          tab === "story" ? (
            <Profile fighter={fighter} {...ctx} />
          ) : tab === "shop" ? (
            <Shop fighter={fighter} {...ctx} />
          ) : (
            <Players {...ctx} fighter={fighter} embedded />
          )
        ) : error ? (
          <div className="error-panel">
            <Info size={28} />
            <p>{t.error}</p>
            <button
              className="button dark-button"
              onClick={() => setAttempt((x) => x + 1)}
            >
              <RotateCcw size={15} />
              {t.retry}
            </button>
          </div>
        ) : !data ? (
          <div className="loading-panel">
            <span className="loader" />
            {t.load}
          </div>
        ) : tab === "moves" ? (
          <Moves data={data} {...ctx} onMove={setMove} />
        ) : tab === "combos" ? (
          <Combos data={data} {...ctx} />
        ) : tab === "punish" ? (
          <Punish data={data} {...ctx} onMove={setMove} />
        ) : (
          <Movement id={id} data={data} {...ctx} onMove={setMove} />
        )}
      </section>
      {move && (
        <Modal onClose={() => setMove(null)} title={t.details} t={t}>
          <MoveDetail move={move} data={data} {...ctx} />
        </Modal>
      )}
    </>
  );
}
function Moves({ data, t, onMove }) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("source");
  const [safe, setSafe] = useState(false);
  const [limit, setLimit] = useState(50);
  const moves = useMemo(
    () => filterMoves(data.moves, { query, level, sort, safe }),
    [data, query, level, sort, safe],
  );
  useEffect(() => setLimit(50), [query, level, sort, safe]);
  return (
    <>
      <div className="content-heading">
        <div>
          <div className="eyebrow">MOVE BY MOVE</div>
          <h2>{t.moves}</h2>
        </div>
        <span>
          {data.moves.length} {t.entries}
        </span>
      </div>
      <div className="move-toolbar">
        <label className="search-input wide">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.moveSearch}
            aria-label={t.moveSearch}
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label={t.clear}>
              <X size={14} />
            </button>
          )}
        </label>
        <select
          aria-label={t.level}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {[
            ["", t.any],
            ["h", t.high],
            ["m", t.mid],
            ["l", t.low],
            ["throw", t.throw],
          ].map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
        <select
          aria-label={t.sort}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="source">{t.sortDefault}</option>
          <option value="startup">{t.sortFast}</option>
        </select>
      </div>
      <div className="table-caption">
        <span>
          {moves.length} {t.results} · {t.resultsHint}
        </span>
        <label className="check-label">
          <input
            type="checkbox"
            checked={safe}
            onChange={(e) => setSafe(e.target.checked)}
          />
          {t.safe}
        </label>
      </div>
      {safe && <p className="small-note">{t.safeNote}</p>}
      <MoveTable moves={moves.slice(0, limit)} t={t} onMove={onMove} />
      {!moves.length && (
        <Empty
          t={t}
          onReset={() => {
            setQuery("");
            setLevel("");
            setSafe(false);
          }}
        />
      )}
      {moves.length > limit && (
        <div className="load-more">
          <button
            className="button outline-button"
            onClick={() => setLimit(limit + 50)}
          >
            {t.more}
            <span>
              {limit} / {moves.length}
            </span>
          </button>
        </div>
      )}
      <Notation t={t} />
      <DataLink data={data} t={t} />
    </>
  );
}
function Frame({ value }) {
  const numeric = /^[+-]?\d/.test(value);
  return (
    <span
      className={
        "frame " +
        (!numeric ? "neutral" : value[0] === "-" ? "negative" : "positive")
      }
    >
      {value || "—"}
    </span>
  );
}
function Level({ value, t }) {
  const l = value?.toLowerCase();
  const values = {
    h: t.high,
    high: t.high,
    m: t.mid,
    mid: t.mid,
    l: t.low,
    low: t.low,
  };
  return (
    <span
      className={
        "level " +
        (l === "h" || l === "high"
          ? "level-high"
          : l === "m" || l === "mid"
            ? "level-mid"
            : l === "l" || l === "low"
              ? "level-low"
              : "")
      }
    >
      {values[l] || value || "—"}
    </span>
  );
}
function MoveTable({ moves, t, onMove }) {
  return (
    <div className="table-scroll">
      <table className="move-table">
        <thead>
          <tr>
            <th>{t.move}</th>
            <th>{t.command}</th>
            <th>{t.level}</th>
            <th>{t.damage}</th>
            <th>{t.startup}</th>
            <th>{t.block}</th>
            <th>{t.hit}</th>
            <th>{t.counter}</th>
            <th aria-label={t.details} />
          </tr>
        </thead>
        <tbody>
          {moves.map((m, i) => (
            <tr key={m.id + "-" + i} onClick={() => onMove(m)}>
              <td>
                <button
                  className="move-name"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(m);
                  }}
                >
                  {m.name || m.command}
                  <small>{m.section}</small>
                </button>
              </td>
              <td>
                <code>{m.command}</code>
              </td>
              <td>
                <Level value={m.target} t={t} />
              </td>
              <td className="damage-value">{m.damage || "—"}</td>
              <td className="startup-value">{m.startup || "—"}</td>
              <td>
                <Frame value={m.block} />
              </td>
              <td>
                <Frame value={m.hit} />
              </td>
              <td>
                <Frame value={m.counter_hit} />
              </td>
              <td>
                <ChevronRight size={15} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InputDiagram({ command, t }) {
  const arrows = {
    f: "→",
    b: "←",
    u: "↑",
    d: "↓",
    df: "↘",
    db: "↙",
    uf: "↗",
    ub: "↖",
    n: "·",
  };
  const tokens =
    command.match(/(?:[A-Za-z][A-Za-z_]*|[1-4](?:\+[1-4])*|[+,~.#]|[^\s])/g) ||
    [];
  return (
    <div className="input-diagram">
      <h4>{t.inputDiagram}</h4>
      <div className="diagram-sequence">
        {tokens.map((token, i) =>
          arrows[token.toLowerCase()] ? (
            <span className="diagram-direction" key={i} title={token}>
              {arrows[token.toLowerCase()]}
            </span>
          ) : /^[1-4](?:\+[1-4])*$/.test(token) ? (
            <span className="diagram-controller" key={i}>
              {[1, 2, 3, 4].map((n) => (
                <i
                  key={n}
                  className={token.split("+").includes(String(n)) ? "on" : ""}
                >
                  {n}
                </i>
              ))}
            </span>
          ) : /^[+,~.#]$/.test(token) ? (
            <span className="diagram-separator" key={i}>
              {token === "," ? "›" : token}
            </span>
          ) : (
            <span className="diagram-state" key={i}>
              {token}
            </span>
          ),
        )}
      </div>
      <small>{t.diagramNote}</small>
    </div>
  );
}

function InputCode({ text, t }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setFailed(false);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setFailed(true);
    }
  }
  return (
    <>
      <div className="input-code">
        <code>{text}</code>
        <button
          onClick={copyText}
          aria-label={copied ? t.copied : t.copy}
          title={copied ? t.copied : t.copy}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      {failed && (
        <p className="small-note">
          {t.command}: <code className="selectable">{text}</code>
        </p>
      )}
    </>
  );
}
function MoveDetail({ move: m, data, t }) {
  return (
    <>
      <span className="eyebrow">{m.section}</span>
      <h3 className="modal-move-title">{m.name || m.command}</h3>
      <InputCode text={m.command} t={t} />
      <InputDiagram command={m.command} t={t} />
      <div className="frame-grid">
        {[
          ["startup", m.startup],
          ["block", m.block],
          ["hit", m.hit],
          ["counter", m.counter_hit],
          ["damage", m.damage],
          ["level", m.target],
        ].map(([k, v]) => (
          <div key={k}>
            <span>{t[k]}</span>
            {k === "level" ? (
              <Level value={v} t={t} />
            ) : (
              <b>{v || t.unknown}</b>
            )}
          </div>
        ))}
      </div>
      <div className="detail-block">
        <h4>{t.conditions}</h4>
        <p>
          <code>{m.states || "—"}</code>
        </p>
        <dl>
          <div>
            <dt>{t.range}</dt>
            <dd>{m.range || t.unknown}</dd>
          </div>
          <div>
            <dt>{t.recovery}</dt>
            <dd>{m.recovery || t.unknown}</dd>
          </div>
        </dl>
      </div>
      <div className="detail-block">
        <h4>{t.notes}</h4>
        <p>{m.notes || t.unknown}</p>
        <small>{t.notesNote}</small>
      </div>
      <DataLink data={data} t={t} />
    </>
  );
}
function Combos({ data, t }) {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(20);
  const categories = [...new Set(data.combos.map((c) => c.category))];
  const list = data.combos.filter(
    (c) =>
      (!category || c.category === category) &&
      (!q ||
        [c.starter, c.route].some((x) =>
          x.toLowerCase().includes(q.toLowerCase()),
        )),
  );
  useEffect(() => setLimit(20), [q, category]);
  return (
    <>
      <div className="eyebrow">THE COMBO LIBRARY</div>
      <h2>{t.comboIntro}</h2>
      <p className="content-subtitle">{t.comboSub}</p>
      <div className="move-toolbar">
        <label className="search-input wide">
          <Search size={17} />
          <input
            aria-label={t.moveSearch}
            placeholder={t.moveSearch}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <select
          aria-label={t.section}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{t.all}</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="combo-list">
        {list.slice(0, limit).map((c, i) => (
          <article className="combo-card" key={i}>
            <div className="combo-index">{String(i + 1).padStart(2, "0")}</div>
            <div>
              <span className="eyebrow">{c.category}</span>
              <h3>
                <small>{t.starter}</small>
                {c.starter}
              </h3>
              <InputCode text={c.route} t={t} />
            </div>
          </article>
        ))}
      </div>
      {!list.length && (
        <Empty t={t} message={data.combos.length ? t.empty : t.noCombos} />
      )}{" "}
      {list.length > limit && (
        <div className="load-more">
          <button
            className="button outline-button"
            onClick={() => setLimit(limit + 20)}
          >
            {t.more}
            <span>
              {limit} / {list.length}
            </span>
          </button>
        </div>
      )}
      <Notation t={t} />
      <DataLink
        data={{ ...data, source: data.source.replace("_movelist", "_combos") }}
        t={t}
      />
    </>
  );
}
function Punish({ data, t, onMove }) {
  const [frames, setFrames] = useState(12);
  const [stance, setStance] = useState("standing");
  const list = punishCandidates(data.moves, frames, stance);
  return (
    <>
      <div className="eyebrow">MAKE IT COUNT</div>
      <h2>{t.punishTitle}</h2>
      <p className="content-subtitle">{t.punishDesc}</p>
      <div className="punish-controls">
        <div>
          <label className="field-label" htmlFor="punish-range">
            {t.disadvantage}
          </label>
          <div className="punish-value">
            −{frames}
            <small>F</small>
          </div>
          <input
            id="punish-range"
            aria-label={t.disadvantage}
            type="range"
            min="10"
            max="30"
            value={frames}
            onChange={(e) => setFrames(Number(e.target.value))}
          />
          <div className="range-labels">
            <span>−10</span>
            <span>−30</span>
          </div>
        </div>
        <div className="punish-stance">
          <Shield size={32} />
          <div className="segmented">
            <button
              className={stance === "standing" ? "active" : ""}
              onClick={() => setStance("standing")}
              aria-pressed={stance === "standing"}
            >
              {t.standing}
            </button>
            <button
              className={stance === "ws" ? "active" : ""}
              onClick={() => setStance("ws")}
              aria-pressed={stance === "ws"}
            >
              {t.crouching}
            </button>
          </div>
          <span>
            {list.length} {t.results}
          </span>
        </div>
      </div>
      <MoveTable moves={list} t={t} onMove={onMove} />
      {!list.length && <Empty t={t} message={t.punishEmpty} />}
      <DataLink data={data} t={t} />
    </>
  );
}
function Movement({ id, data, t, lang, onMove }) {
  const [side, setSide] = useState("p1");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("documented");
  const [limit, setLimit] = useState(40);
  const mt = movementCopy[lang];
  const assessed = useMemo(
    () =>
      data.moves.map((move) => ({
        move,
        assessment: movementAssessment(move, id),
      })),
    [data, id],
  );
  const results = assessed.filter((row) => movementMatches(row, query, filter));
  const documented = assessed.filter(
    (row) => row.assessment.kind !== "unknown",
  ).length;
  const escapes = assessed.filter(
    (row) => row.assessment.kind === "evade",
  ).length;
  useEffect(() => setLimit(40), [query, filter]);
  return (
    <>
      <div className="eyebrow">AXIS / COUNTERPLAY</div>
      <h2>{mt.title}</h2>
      <p className="content-subtitle">{mt.intro}</p>
      <div className="axis-summary">
        <div>
          <span>{mt.documented}</span>
          <b>
            {documented}
            <small> / {data.moves.length}</small>
          </b>
        </div>
        <div>
          <span>{mt.escapeRecords}</span>
          <b>{escapes}</b>
        </div>
        <div className="axis-conditions">
          <Info size={20} />
          <p>{mt.caution}</p>
        </div>
      </div>
      <div className="move-toolbar axis-toolbar">
        <label className="search-input wide">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mt.search}
            aria-label={mt.search}
          />
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label={mt.filter}
        >
          {[
            "documented",
            "all",
            "evade",
            "left",
            "right",
            "tracking",
            "homing",
            "unknown",
          ].map((key) => (
            <option key={key} value={key}>
              {mt.filters[key]}
            </option>
          ))}
        </select>
      </div>
      <div className="table-caption">
        <span>
          {results.length} {mt.records}
        </span>
        <span>{mt.perspective}</span>
      </div>
      <div className="table-scroll">
        <table className="move-table axis-table">
          <thead>
            <tr>
              <th>
                {t.move} / {t.command}
              </th>
              <th>{mt.response}</th>
              <th>{mt.conditions}</th>
              <th>{mt.evidence}</th>
            </tr>
          </thead>
          <tbody>
            {results.slice(0, limit).map(({ move, assessment: a }, i) => (
              <tr key={`${move.id}-${i}`}>
                <td>
                  <button className="move-name" onClick={() => onMove(move)}>
                    {move.name || move.command}
                    <small>{move.section}</small>
                  </button>
                  <code>{move.command}</code>
                </td>
                <td>
                  <span className={`axis-badge ${a.kind}`}>
                    {mt.kinds[a.kind]}
                  </span>
                  <div className="axis-directions">
                    {a.directions.map((d) => (
                      <b key={d}>{d}</b>
                    ))}
                  </div>
                  {a.kind === "unknown" && <small>{mt.noGuess}</small>}
                </td>
                <td>
                  <p>
                    {a.context
                      ? a.context === "defenders"
                        ? mt.contextsExtra
                        : mt.contexts[a.context]
                      : mt.contexts[a.kind]}
                  </p>
                  {a.afterBlock && (
                    <b className="axis-window">
                      {mt.afterBlock.replace("{n}", a.afterBlock)}
                    </b>
                  )}
                  {a.defenders && (
                    <div className="axis-defenders">
                      <small>{mt.defenderScope}</small>
                      {a.defenders.map((defender) => {
                        const f = roster.find((r) => r.id === defender);
                        return (
                          <a
                            key={defender}
                            href={
                              a.references?.find(
                                (ref) => ref.defender === defender,
                              )?.url
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            {f ? localizedName(f, lang) : defender}
                          </a>
                        );
                      })}
                    </div>
                  )}
                  {a.tentative && (
                    <span className="axis-tentative">{mt.tentative}</span>
                  )}
                </td>
                <td>
                  {a.evidence ? (
                    <>
                      <details>
                        <summary>{mt.quote}</summary>
                        <p className="axis-quote" lang="en">
                          {a.evidence}
                        </p>
                      </details>
                      <a
                        className="axis-source"
                        href={a.source || data.source}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {a.sourceLabel || `Wavu · ${data.snapshotDate}`}{" "}
                        <ExternalLink size={12} />
                      </a>
                    </>
                  ) : (
                    <span>{mt.noEvidence}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!results.length && <Empty t={t} />}
      {results.length > limit && (
        <div className="load-more">
          <button
            className="button outline-button"
            onClick={() => setLimit(limit + 40)}
          >
            {t.more} {Math.min(limit, results.length)} / {results.length}
          </button>
        </div>
      )}
      <div className="axis-method">
        <h3>{mt.practiceTitle}</h3>
        <p>{mt.practice}</p>
        <a
          className="text-button"
          href={`https://wavu.wiki/t/${id
            .split("_")
            .map((s) => s[0].toUpperCase() + s.slice(1))
            .join("_")}_counterplay`}
          target="_blank"
          rel="noreferrer"
        >
          {mt.moreResearch}
          <ExternalLink size={14} />
        </a>
      </div>
      <details className="axis-controls">
        <summary>{mt.controls}</summary>
        <div className="segmented side-selector">
          {["p1", "p2"].map((v) => (
            <button
              key={v}
              className={side === v ? "active" : ""}
              aria-pressed={side === v}
              onClick={() => setSide(v)}
            >
              {t[v]}
            </button>
          ))}
        </div>
        <div className="sidestep-cards">
          <div>
            <span>SSL / SWL</span>
            <ArrowLeft size={30} />
            <h3>{t.ssl}</h3>
            <code>{side === "p1" ? "u → n / u,n,U" : "d → n / d,n,D"}</code>
          </div>
          <div className="sidestep-orbit">
            <MoveHorizontal size={30} />
          </div>
          <div>
            <span>SSR / SWR</span>
            <ArrowRight size={30} />
            <h3>{t.ssr}</h3>
            <code>{side === "p1" ? "d → n / d,n,D" : "u → n / u,n,U"}</code>
          </div>
        </div>
      </details>
      <DataLink data={data} t={t} />
    </>
  );
}
function Profile({ fighter, lang, t }) {
  return (
    <>
      <div className="eyebrow">BEHIND THE FIGHTER</div>
      <h2>{t.bio}</h2>
      <div className="profile-grid">
        <div className="profile-stats">
          <div>
            <span>{t.country}</span>
            <b>{country(fighter.country, lang)}</b>
          </div>
          <div>
            <span>{t.style}</span>
            <b>{style(fighter.style, lang)}</b>
          </div>
          <div>
            <span>TEKKEN ATLAS</span>
            <b>{fighter.epithet}</b>
          </div>
        </div>
        <div className="profile-story">
          <h3>{t.background}</h3>
          <p>{pick(editorial[fighter.id]?.story, lang)}</p>
          <small>{t.bioNote}</small>
          <a
            className="text-button"
            href={`https://tk8.tekken-official.jp/character/index.php?chara=${fighter.id}`}
            target="_blank"
            rel="noreferrer"
          >
            {t.profileLink}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <React.Suspense
        fallback={
          <div className="loading-panel">
            <span className="loader" />
            {t.load}
          </div>
        }
      >
        <ProfileLore fighter={fighter} lang={lang} />
      </React.Suspense>
    </>
  );
}
function Shop({ fighter, t, lang }) {
  return (
    <>
      <div className="eyebrow">THE WARDROBE</div>
      <h2>{t.shopTitle}</h2>
      <p className="content-subtitle">{t.shopDesc}</p>
      <div className="shop-card">
        <Portrait fighter={fighter} />
        <div>
          <span className="eyebrow">TEKKEN SHOP</span>
          <h3>{localizedName(fighter, lang)}</h3>
          <p>{t.shopDefault}</p>
          <span className="pending-tag">
            <Clock size={14} />
            {t.shopStatus}
          </span>
          <a
            className="button dark-button"
            href={officialLinks.cn}
            target="_blank"
            rel="noreferrer"
          >
            {t.shopSource}
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </>
  );
}
function Players(ctx) {
  const { t, lang, fighter, embedded } = ctx;
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState("all");
  const [detail, setDetail] = useState(null);
  const list = players.filter(
    (p) =>
      (!fighter || p.fighters.includes(fighter.id)) &&
      (selected === "all" || p.fighters.includes(selected)) &&
      (!q ||
        [
          p.name,
          p.nation,
          ...p.fighters
            .map((id) => roster.find((r) => r.id === id))
            .filter(Boolean)
            .flatMap((r) => [r.name, r.zh, editorial[r.id]?.ja]),
        ].some((v) => v?.toLowerCase().includes(q.toLowerCase()))),
  );
  return (
    <section className={embedded ? "" : "wrap standalone"}>
      <div className="eyebrow">THE PEOPLE BEHIND THE PLAY</div>
      <h1 className={embedded ? "content-title" : "page-title"}>
        {t.playerTitle}
      </h1>
      <p className="page-subtitle">{t.playerSub}</p>
      <p className="editorial-notice">
        <Info size={16} />
        {t.playerNote}
      </p>
      <div className="move-toolbar">
        <label className="search-input wide">
          <Search size={17} />
          <input
            placeholder={t.playerSearch}
            aria-label={t.playerSearch}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        {!fighter && (
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            aria-label={t.nav[0]}
          >
            <option value="all">{t.all}</option>
            {roster.map((r) => (
              <option key={r.id} value={r.id}>
                {localizedName(r, lang)}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="player-grid">
        {list.map((p, i) => (
          <button
            key={p.name}
            className="player-card"
            onClick={() => setDetail(p)}
          >
            <div className="player-top">
              <span className="player-initials">
                {p.name
                  .split(" ")
                  .map((x) => x[0])
                  .join("")
                  .slice(0, 2)}
              </span>
              <span>{country(p.nation, lang)}</span>
              <ArrowUpRight size={20} />
            </div>
            <h2>{p.name}</h2>
            <p>{pick(p.bio, lang)}</p>
            <div className="player-fighters">
              {p.fighters
                .map((id) => roster.find((r) => r.id === id))
                .filter(Boolean)
                .map((r) => (
                  <span key={r.id}>{localizedName(r, lang)}</span>
                ))}
            </div>
            <span className="player-card-bottom">
              {t.playerLink}
              <ArrowRight size={16} />
            </span>
          </button>
        ))}
      </div>
      {!list.length && (
        <Empty t={t} message={fighter ? t.noPlayers : t.empty} />
      )}{" "}
      {detail && (
        <Modal title={t.players} t={t} onClose={() => setDetail(null)}>
          <div className="player-detail">
            <span className="eyebrow">{country(detail.nation, lang)}</span>
            <h2>{detail.name}</h2>
            <p>{pick(detail.bio, lang)}</p>
            <p className="small-note">{t.playerNote}</p>
            <div className="player-detail-fighters">
              {detail.fighters
                .map((id) => roster.find((r) => r.id === id))
                .filter(Boolean)
                .map((r) => (
                  <button
                    className="button outline-button"
                    onClick={() => {
                      setDetail(null);
                      navigate(`fighter/${r.id}/players`);
                    }}
                    key={r.id}
                  >
                    {localizedName(r, lang)}
                    <ArrowUpRight size={14} />
                  </button>
                ))}
            </div>
            <a
              href={detail.url}
              className="button dark-button"
              target="_blank"
              rel="noreferrer"
            >
              {t.playerLink}
              <ExternalLink size={15} />
            </a>
          </div>
        </Modal>
      )}
    </section>
  );
}
function Updates({ t, lang }) {
  const [filter, setFilter] = useState("all");
  const records = [
    {
      id: "release",
      date: "2024.01.26",
      type: "official",
      title: t.release,
      desc: t.releaseDesc,
      url: officialLinks.en,
    },
    {
      id: "snapshot",
      date: "2026.07.27",
      type: "community",
      title: t.snapshot,
      desc: t.snapshotDesc,
      url: "https://github.com/tekken8movelist/tekken8movelist.github.io/tree/47c6072898104ab7b6c54b6c11bbca8d1c0cb257",
    },
    {
      id: "s3",
      date: "S3",
      type: "pending",
      title: t.updateS3,
      desc: t.s3Desc,
      url: officialLinks.cn,
    },
  ];
  return (
    <section className="wrap standalone updates-page">
      <div className="eyebrow">THE EVOLUTION</div>
      <h1 className="page-title">{t.updatesTitle}</h1>
      <p className="page-subtitle">{t.updatesSub}</p>
      <div className="update-status">
        <span className="status-dot amber" />
        <div>
          <b>{t.sourcesBlocked}</b>
          <p>{t.updateNote}</p>
        </div>
        <a
          className="button outline-button"
          href={officialLinks.patch}
          target="_blank"
          rel="noreferrer"
        >
          {t.updateOfficial}
          <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="segmented update-filters">
        {[
          ["all", t.all],
          ["official", t.updateHistory],
          ["community", t.community],
          ["pending", t.awaiting],
        ].map(([v, label]) => (
          <button
            className={v === filter ? "active" : ""}
            key={v}
            aria-pressed={v === filter}
            onClick={() => setFilter(v)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="timeline">
        {records
          .filter((r) => filter === "all" || r.type === filter)
          .map((r) => (
            <article className="timeline-row" key={r.id}>
              <div className="timeline-date">
                <span>{r.date}</span>
                <i />
              </div>
              <div className="timeline-card">
                <span className="eyebrow">
                  {r.type === "community"
                    ? t.community
                    : r.type === "pending"
                      ? t.awaiting
                      : "TEKKEN 8"}
                </span>
                <h2>{r.title}</h2>
                <p>{r.desc}</p>
                <a
                  className="text-button"
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.source}
                  <ArrowUpRight size={15} />
                </a>
              </div>
            </article>
          ))}
      </div>
      <div className="coverage-card">
        <Info size={24} />
        <div>
          <h3>{t.coverage}</h3>
          <p>{t.coverageDesc}</p>
        </div>
      </div>
    </section>
  );
}
function DataLink({ data, t }) {
  return (
    <div className="data-source">
      <span>{t.dataNote}</span>
      <a href={data.source} target="_blank" rel="noreferrer">
        Wavu Wiki
        <ArrowUpRight size={14} />
      </a>
    </div>
  );
}
function Notation({ t }) {
  return (
    <details className="notation">
      <summary>
        <Info size={15} />
        {t.notation}
        <ChevronDown size={15} />
      </summary>
      <p>{t.notationDesc}</p>
      <div className="notation-buttons">
        {["1", "2", "3", "4"].map((n) => (
          <span key={n}>{n}</span>
        ))}
        <code>f, n, d, df + 2</code>
      </div>
    </details>
  );
}
function Empty({ t, onReset, message }) {
  return (
    <div className="empty-state">
      <Search size={28} />
      <p>{message || t.empty}</p>
      {onReset && (
        <button className="text-button" onClick={onReset}>
          {t.clear}
          <RotateCcw size={14} />
        </button>
      )}
    </div>
  );
}
function SourcePanel({ t, lang }) {
  return (
    <>
      <p className="content-subtitle">{t.coverageDesc}</p>
      <div className="source-links">
        {[
          [t.officialSite, officialLinks.cn],
          [t.updateOfficial, officialLinks.patch],
          ["Bandai Namco · TEKKEN 8", officialLinks.en],
          ["Wavu Wiki", "https://wavu.wiki/"],
          [
            "Community snapshot · 47c6072",
            "https://github.com/tekken8movelist/tekken8movelist.github.io/tree/47c6072898104ab7b6c54b6c11bbca8d1c0cb257",
          ],
          [
            "Promotional image mirror · 25 portraits",
            "https://github.com/aliiakbarkhan/Tekken-VIII-Website",
          ],
          [
            "Character image mirror · 16 portraits",
            "https://github.com/MoonGoon72/Tekken8-Frame-Data/tree/808e575f12ea8e63916cc4eb3c1249b93c5ed090",
          ],
        ].map(([name, url]) => (
          <a key={name} href={url} target="_blank" rel="noreferrer">
            <span>{name}</span>
            <ArrowUpRight size={17} />
          </a>
        ))}
      </div>
      <p className="small-note">{t.updateNote}</p>
      <p className="small-note">{t.notesNote}</p>
      <p className="small-note">{t.artNote}</p>
    </>
  );
}
function Modal({ title, onClose, children, t }) {
  const ref = useRef();
  useEffect(() => {
    const before = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function keys(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const nodes = [
          ...ref.current.querySelectorAll(
            'button,a,input,select,[tabindex="0"]',
          ),
        ];
        const first = nodes[0],
          last = nodes.at(-1);
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", keys);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", keys);
      before?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="modal-panel"
        tabIndex={-1}
        ref={ref}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            className="icon-button"
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
function Footer({ t, setSourceOpen }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <button className="brand" onClick={() => navigate("")}>
            <span className="brand-symbol">
              T<span>8</span>
            </span>
            <span>
              TEKKEN <b>ATLAS</b>
            </span>
          </button>
          <span>THE ART OF THE FIGHT.</span>
          <button className="text-button" onClick={() => setSourceOpen(true)}>
            {t.sources}
            <ArrowUpRight size={15} />
          </button>
        </div>
        <p>{t.foot}</p>
        <div className="footer-bottom">
          <span>© 2026 TEKKEN ATLAS · FAN PROJECT</span>
          <span>中文 / ENGLISH / 日本語</span>
        </div>
      </div>
    </footer>
  );
}

createRoot(document.getElementById("root")).render(<App />);
