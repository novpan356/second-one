import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  GitBranch,
  Search,
  ChevronDown,
  Info,
} from "lucide-react";
import roster from "./roster.js";
import {
  stories,
  storyName,
  connections,
  chaptersFor,
  relationships,
  relationLabels,
  timeline,
  relationshipSources,
} from "./lore/index.js";
import { loreCopy } from "./lore/copy.js";
const fighters = new Set(roster.map((f) => f.id));
const navigate = (hash) => {
  location.hash = hash;
};
function selectMotion() {
  window.dispatchEvent(new Event("atlas-lore-transition"));
}
function Avatar({ id, large = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`lore-avatar ${large ? "large" : ""}`} aria-hidden="true">
      {fighters.has(id) && !failed ? (
        <img
          src={`${import.meta.env.BASE_URL}art/${id}.webp`}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>
          {id
            .split("_")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </span>
      )}
    </span>
  );
}
export function RelationshipTree({ root, selected, onSelect, lang }) {
  const c = loreCopy[lang],
    r = relationLabels[lang];
  const branches = ["family", "legacy", "allies", "conflict", "identity"]
    .map((group) => ({
      group,
      edges: connections(root).filter((e) => e.group === group),
    }))
    .filter((g) => g.edges.length);
  return (
    <section className="relationship-section">
      <div className="lore-section-heading">
        <div>
          <span className="eyebrow">BONDS / CONFLICT / LEGACY</span>
          <h3>
            <GitBranch size={23} />
            {c.tree}
          </h3>
        </div>
        <span className="lore-mini-count">
          {connections(root).length} / CONNECTIONS
        </span>
      </div>
      <p className="content-subtitle">{c.treeSub}</p>
      <nav
        className="relationship-tree"
        aria-label={`${storyName(root, lang)} · ${c.tree}`}
      >
        <div className="relation-root">
          <button
            onClick={() => onSelect(root)}
            aria-pressed={selected === root}
          >
            <Avatar id={root} large />
            <span>
              <small>FOCAL POINT</small>
              <b>{storyName(root, lang)}</b>
            </span>
          </button>
        </div>
        <ul
          className="relation-branches"
          style={{ "--branches": Math.min(branches.length, 4) }}
        >
          {branches.map(({ group, edges }) => (
            <li className={`relation-branch ${group}`} key={group}>
              <h4>{r[group]}</h4>
              <ul>
                {edges.map((e) => (
                  <li key={e.id}>
                    <button
                      className={`relation-node ${selected === e.id ? "selected" : ""}`}
                      onClick={() => onSelect(e.id)}
                      aria-pressed={selected === e.id}
                      aria-label={`${c.read} ${storyName(e.id, lang)} · ${r[e.label]}`}
                    >
                      <Avatar id={e.id} />
                      <span>
                        <b>{storyName(e.id, lang)}</b>
                        <small>{r[e.label]}</small>
                        {e.spoiler && <em>{c.spoilers}</em>}
                        {e.refs.includes("game-context") && (
                          <em>{c.relationHistory}</em>
                        )}
                      </span>
                      <ArrowRight size={14} />
                    </button>
                    <details className="relation-citation">
                      <summary>{c.sourceDetails}</summary>
                      {relationshipSources(e).map((s) => (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          key={s.url}
                        >
                          {s.label}
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </details>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
      <p className="lore-tree-hint">
        <Info size={14} />
        {c.hint}
      </p>
    </section>
  );
}
function Sources({ sources, lang }) {
  return (
    <details className="lore-sources">
      <summary>
        {loreCopy[lang].sources}
        <ChevronDown size={15} />
      </summary>
      <div>
        {sources.map((s) => (
          <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>
            {s.label}
            <ExternalLink size={12} />
            {s.checkedAt && <small>{s.checkedAt}</small>}
          </a>
        ))}
      </div>
    </details>
  );
}
export function StoryArc({ chapter, lang, onSelect, open = true }) {
  const c = loreCopy[lang];
  return (
    <article className={`story-arc ${chapter.era}`}>
      <details open={open}>
        <summary>
          <span className="story-era">{chapter.tag}</span>
          <h3>{chapter.title[lang]}</h3>
          <ChevronDown size={19} />
        </summary>
        <div className="story-arc-body">
          <p>{chapter.text[lang]}</p>
          <div className="story-cast">
            <span>{c.cast}</span>
            {chapter.cast.map((id) => (
              <button key={id} onClick={() => onSelect(id)}>
                <Avatar id={id} />
                {storyName(id, lang)}
                <ArrowRight size={12} />
              </button>
            ))}
          </div>
          <Sources sources={chapter.sources} lang={lang} />
        </div>
      </details>
    </article>
  );
}
export function StoryReader({ id, lang, onSelect, embedded = false }) {
  const entry = stories[id],
    c = loreCopy[lang];
  const related = chaptersFor(id);
  const readingRef = useRef(null);
  useEffect(() => {
    if (embedded) readingRef.current?.focus({ preventScroll: true });
  }, [id, embedded]);
  if (!entry) return null;
  return (
    <section
      className="story-reader"
      key={id}
      ref={readingRef}
      tabIndex={-1}
      aria-label={`${c.selected} ${storyName(id, lang)}`}
    >
      <header className="story-reader-header">
        <Avatar id={id} large />
        <div>
          <span className="eyebrow">
            {c.selected} / {c[entry.kind] || c.support}
          </span>
          <h2>{storyName(id, lang)}</h2>
        </div>
        <span className="reader-code">DOSSIER / {id.toUpperCase()}</span>
      </header>
      <div className="reader-intro">
        <span className="lore-type-badge">
          {entry.kind === "support" || entry.kind === "organization"
            ? c.support
            : c.officialBio}
        </span>
        <span>{c.researchDate}</span>
      </div>
      <h3 className="lore-subheading">
        <BookOpen size={19} />
        {c.background}
      </h3>
      <div className="biography-chapters">
        {entry.biography[lang].map((p, i) => (
          <section key={i}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h4>{c.biographyStage[Math.min(i, 3)]}</h4>
              <p>{p}</p>
            </div>
          </section>
        ))}
      </div>
      {(entry.kind === "support" || entry.kind === "organization") && (
        <p className="lore-note">{c.supportNote}</p>
      )}
      <Sources sources={entry.sources} lang={lang} />
      <div className="story-reader-actions">
        {fighters.has(id) && (
          <button
            className="button dark-button"
            onClick={() => navigate(`fighter/${id}/story`)}
          >
            {c.profile}
            <ArrowRight size={15} />
          </button>
        )}
        <a className="text-button" href={`#story/person/${id}`}>
          {c.direct}
          <ArrowRight size={14} />
        </a>
      </div>
      {related.length > 0 && (
        <>
          <h3 className="lore-subheading related-heading">{c.involvement}</h3>
          <div className="related-story-arcs">
            {related.map((ch) => (
              <StoryArc
                key={ch.id}
                chapter={ch}
                lang={lang}
                onSelect={onSelect}
              />
            ))}
          </div>
          {related.some((ch) => ch.era === "main") && (
            <p className="lore-note">{c.narrativeNote}</p>
          )}
        </>
      )}
    </section>
  );
}
export function ProfileLore({ fighter, lang }) {
  const [selected, setSelected] = useState(fighter.id);
  const [root, setRoot] = useState(fighter.id);
  const c = loreCopy[lang],
    pane = useRef(null);
  useEffect(() => {
    setSelected(fighter.id);
    setRoot(fighter.id);
  }, [fighter.id]);
  const select = (id) => {
    setSelected(id);
    selectMotion();
    requestAnimationFrame(() =>
      pane.current?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
  };
  return (
    <div className="profile-lore">
      <div className="lore-alert">
        <BookOpen size={18} />
        <div>
          <b>{c.spoilers}</b>
          <p>{c.scope}</p>
        </div>
        <a href="#story" className="text-button">
          {c.nav}
          <ArrowRight size={15} />
        </a>
      </div>
      <RelationshipTree
        root={root}
        selected={selected}
        onSelect={select}
        lang={lang}
      />
      {(root !== fighter.id || selected !== fighter.id) && (
        <div className="lore-browse-controls">
          <button
            onClick={() => {
              setRoot(fighter.id);
              select(fighter.id);
            }}
          >
            <ArrowLeft size={15} />
            {c.reset}
          </button>
          {root !== selected && (
            <button
              onClick={() => {
                setRoot(selected);
                selectMotion();
              }}
            >
              <GitBranch size={15} />
              {c.center}
            </button>
          )}
        </div>
      )}
      <div ref={pane} className="lore-reader-anchor">
        <StoryReader
          key={selected}
          id={selected}
          lang={lang}
          onSelect={select}
          embedded
        />
      </div>
    </div>
  );
}
export function StoryArchive({ lang, route }) {
  const c = loreCopy[lang];
  const [query, setQuery] = useState("");
  const section = ["history", "main", "extra", "people"].includes(route.section)
    ? route.section
    : "main";
  const person = Object.hasOwn(stories, route.person) ? route.person : null;
  const select = (id) => navigate(`story/person/${id}`);
  const matches = Object.values(stories).filter((s) =>
    [storyName(s.id, "zh"), storyName(s.id, "en"), storyName(s.id, "ja")].some(
      (name) => name.toLowerCase().includes(query.toLowerCase()),
    ),
  );
  return (
    <section className="wrap standalone story-archive">
      <div className="story-archive-hero">
        <span className="eyebrow">THE MISHIMA SAGA / STORY ARCHIVE</span>
        <h1>{c.title}</h1>
        <p>{c.intro}</p>
        <div className="story-archive-stats">
          <span>
            <b>41</b>
            {c.characters}
          </span>
          <span>
            <b>{Object.keys(stories).length}</b>
            {c.people}
          </span>
          <span>
            <b>{relationships.length}</b>
            {c.connections}
          </span>
        </div>
        <span className="archive-watermark" aria-hidden="true">
          STORY
        </span>
      </div>
      <div className="lore-alert">
        <BookOpen size={18} />
        <div>
          <b>{c.spoilers}</b>
          <p>{c.scope}</p>
        </div>
      </div>
      {person ? (
        <>
          <button
            className="back-button story-back"
            onClick={() => navigate("story/people")}
          >
            <ArrowLeft size={16} />
            {c.back}
          </button>
          <RelationshipTree
            root={person}
            selected={person}
            onSelect={select}
            lang={lang}
          />
          <StoryReader key={person} id={person} lang={lang} onSelect={select} />
        </>
      ) : (
        <>
          <nav className="story-section-nav" aria-label={c.nav}>
            {["main", "history", "extra", "people"].map((key) => (
              <button
                key={key}
                aria-current={section === key ? "page" : undefined}
                className={section === key ? "active" : ""}
                onClick={() => navigate(`story/${key}`)}
              >
                {c[key]}
              </button>
            ))}
          </nav>
          {section === "people" ? (
            <div className="story-people">
              <label className="search-input wide">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={c.search}
                  aria-label={c.search}
                />
              </label>
              <div className="story-people-grid">
                {matches.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => select(entry.id)}
                    className="story-person-card"
                  >
                    <Avatar id={entry.id} />
                    <span>
                      <b>{storyName(entry.id, lang)}</b>
                      <small>
                        {c[entry.kind] || c.support} ·{" "}
                        {connections(entry.id).length} {c.connections}
                      </small>
                    </span>
                    <ArrowRight size={15} />
                  </button>
                ))}
              </div>
              {!matches.length && <p className="empty-state">{c.empty}</p>}
            </div>
          ) : (
            <div key={section} className="story-timeline">
              <div className="story-timeline-heading">
                <h2>{c[section]}</h2>
                <span>{c.completeLabel}</span>
              </div>
              {timeline
                .filter((ch) => ch.era === section)
                .map((ch) => (
                  <StoryArc
                    key={ch.id}
                    chapter={ch}
                    lang={lang}
                    onSelect={select}
                  />
                ))}
              {section === "main" && (
                <p className="lore-note">{c.narrativeNote}</p>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
