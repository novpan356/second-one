import React, { useEffect, useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  Heart,
  UserRound,
  ArrowUpRight,
  Bookmark,
  Trash2,
  ShieldCheck,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import roster from "../roster.js";
import { localizedName } from "../editorial.js";
import { fighterArtPath } from "../art.js";
import { client } from "./client.js";
import { communityCopy } from "./copy.js";
import { useCommunity } from "./store.jsx";
import { sortStandings, moveKey, textLength, cleanComment } from "./model.js";
const name = (id, lang) =>
  localizedName(
    roster.find((r) => r.id === id) || { id, name: id, zh: id },
    lang,
  );
export function AccountButton({ lang }) {
  const a = useCommunity(),
    c = communityCopy[lang];
  return (
    <button
      className="account-button"
      onClick={() =>
        a.user ? (location.hash = "account") : a.setAuthOpen(true)
      }
      aria-label={a.user ? c.account : c.login}
    >
      <UserRound size={17} />
      <span>{a.user ? c.account : c.login}</span>
    </button>
  );
}
export function AuthForm({ lang, onClose }) {
  const a = useCommunity(),
    c = communityCopy[lang],
    [mode, setMode] = useState(a.recovery ? "recover" : "login"),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (a.recovery) setMode("recover");
  }, [a.recovery]);
  const submit = async (e) => {
    e.preventDefault();
    if (!client || busy) return;
    setBusy(true);
    setMessage("");
    const form = new FormData(e.currentTarget),
      email = String(form.get("email") || "").trim(),
      password = String(form.get("password") || ""),
      nickname = String(form.get("nickname") || "").trim();
    const redirectTo = location.origin + location.pathname;
    try {
      if (mode === "register") {
        if (!nickname || textLength(nickname) > 24) throw Error("nickname");
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: nickname },
            emailRedirectTo: redirectTo,
          },
        });
        if (error) throw error;
        if (data.session) onClose();
        else setMessage(c.confirmation);
      } else if (mode === "reset") {
        const { error } = await client.auth.resetPasswordForEmail(email, {
          redirectTo,
        });
        if (error) throw error;
        setMessage(c.resetSent);
      } else if (mode === "recover") {
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        a.setRecovery(false);
        onClose();
      } else {
        const { error } = await client.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch {
      setMessage(c.error);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-form">
      <div className="auth-heading">
        <ShieldCheck size={28} />
        <span>YOUR FIGHT. YOUR ACCOUNT.</span>
      </div>
      {!a.backendConfigured && (
        <p className="community-notice">
          <CloudOff size={18} />
          {c.setup}
        </p>
      )}
      {!a.recovery && (
        <div className="community-tabs">
          {["login", "register"].map((m) => (
            <button
              key={m}
              className={mode === m ? "active" : ""}
              onClick={() => {
                setMode(m);
                setMessage("");
              }}
            >
              {c[m]}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={submit}>
        {mode === "register" && (
          <label>
            {c.nickname}
            <input
              name="nickname"
              autoComplete="nickname"
              required
              maxLength={48}
              placeholder={c.nickname}
            />
          </label>
        )}
        {mode !== "recover" && (
          <label>
            {c.email}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </label>
        )}
        {mode !== "reset" && (
          <label>
            {mode === "recover" ? c.newPassword : c.password}
            <input
              name="password"
              type="password"
              required
              minLength={mode === "login" ? 1 : 8}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>
        )}
        <p className="community-fineprint">{c.publicName}</p>
        <button
          type="submit"
          disabled={busy || !a.backendConfigured}
          className="button community-primary"
        >
          {busy ? c.loading : c[mode]}
        </button>
        {!a.recovery && (
          <button
            type="button"
            className="community-text-button"
            onClick={() => {
              setMode("reset");
              setMessage("");
            }}
          >
            {c.reset}
          </button>
        )}
        {message && (
          <p role="status" className="community-message">
            {message}
          </p>
        )}
      </form>
      <button
        className="community-text-button"
        onClick={() => {
          location.hash = "account";
          onClose();
        }}
      >
        {c.favorites} / {c.guest}
      </button>
    </div>
  );
}
export function MoveFavorite({ fighter, move, lang }) {
  const a = useCommunity(),
    c = communityCopy[lang],
    selected = a.moveFavorites.some((m) => m.key === moveKey(fighter, move));
  return (
    <button
      className={"button move-save-button " + (selected ? "selected" : "")}
      aria-pressed={selected}
      disabled={
        (a.user && !a.privateReady) ||
        a.pending.includes(`m:${moveKey(fighter, move)}`)
      }
      onClick={() => a.toggleMove(fighter, move)}
    >
      <Bookmark size={16} fill={selected ? "currentColor" : "none"} />
      {selected ? c.saved : c.favorites} / {c.move}
    </button>
  );
}
export function AccountPage({ lang }) {
  const a = useCommunity(),
    c = communityCopy[lang];
  return (
    <section className="wrap standalone account-page">
      <div className="community-page-heading">
        <span className="eyebrow">PLAYER / IDENTITY</span>
        <h1>{c.account}</h1>
        <p>{a.user?.user_metadata?.display_name || c.guest}</p>
      </div>
      <p className="community-notice">
        {a.backendConfigured ? (a.user ? c.cloud : c.loginHint) : c.setup}
      </p>
      <div className="account-actions">
        {a.user ? (
          <>
            <button
              className="button community-primary"
              onClick={a.importFavorites}
              disabled={!a.privateReady || a.pending.includes("import")}
            >
              {c.import}
            </button>
            <button
              className="button dark-button"
              onClick={async () => {
                const { error } = await client.auth.signOut();
                if (error) a.setNotice("error");
              }}
            >
              {c.logout}
            </button>
          </>
        ) : (
          <button
            className="button community-primary"
            onClick={() => a.setAuthOpen(true)}
          >
            <UserRound size={17} />
            {c.login}
          </button>
        )}
      </div>
      <h2 className="community-title">
        <Heart size={22} />
        {c.favorites}
      </h2>
      {a.user && !a.privateReady ? (
        a.privateError ? (
          <p role="alert" className="community-error">
            {c.error}{" "}
            <button
              className="community-text-button"
              onClick={() => location.reload()}
            >
              {c.retry}
            </button>
          </p>
        ) : (
          <p role="status">{c.loading}</p>
        )
      ) : (
        <>
          <h3>
            {c.fighter} · {a.fighterFavorites.length}
          </h3>
          <div className="favorite-grid">
            {a.fighterFavorites
              .filter((id) => roster.some((r) => r.id === id))
              .map((id) => (
                <article key={id} className="favorite-card">
                  <button
                    className="favorite-open"
                    onClick={() => (location.hash = `fighter/${id}/moves`)}
                  >
                    <img src={fighterArtPath(id)} alt="" />
                    <b>{name(id, lang)}</b>
                  </button>
                  <button
                    className="icon-button"
                    aria-label={`${c.delete} ${name(id, lang)}`}
                    onClick={() => a.toggleFighter(id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </article>
              ))}
          </div>
          <h3>
            {c.move} · {a.moveFavorites.length}
          </h3>
          <div className="favorite-grid">
            {a.moveFavorites.map((m) => (
              <article key={m.key} className="favorite-card saved-move">
                <button
                  className="favorite-open"
                  onClick={() =>
                    (location.hash = `fighter/${m.fighter}/moves/${encodeURIComponent(m.id || m.command)}`)
                  }
                >
                  <span>
                    <small>{name(m.fighter, lang)}</small>
                    <b>{m.name}</b>
                    <code>{m.command}</code>
                  </span>
                </button>
                <button
                  className="icon-button"
                  aria-label={`${c.delete} ${m.command}`}
                  onClick={() => a.toggleMove(m.fighter, m)}
                >
                  <Trash2 size={15} />
                </button>
              </article>
            ))}
          </div>
          {!a.moveFavorites.length && !a.fighterFavorites.length && (
            <p>{c.noFavorites}</p>
          )}
        </>
      )}
    </section>
  );
}
export function Standings({ lang }) {
  const a = useCommunity(),
    c = communityCopy[lang],
    [mode, setMode] = useState("net");
  const all = roster.map((f) => ({
    fighter_id: f.id,
    likes: 0,
    dislikes: 0,
    average: null,
    rating_count: 0,
    ...a.stats.find((s) => s.fighter_id === f.id),
  }));
  const rows = sortStandings(
      all.filter((r) =>
        mode === "rating"
          ? Number(r.rating_count) > 0
          : Number(r.likes) + Number(r.dislikes) > 0,
      ),
      mode,
    ),
    total = all.reduce((n, r) => n + Number(r.rating_count), 0),
    average = total
      ? all.reduce((n, r) => n + Number(r.star_sum || 0), 0) / total
      : null;
  return (
    <aside className="community-standings" aria-label={c.ranking}>
      <div className="standing-heading">
        <span className="eyebrow">THE COMMUNITY / VERDICT</span>
        <h2>
          {c.ranking}
          <button
            className="icon-button"
            disabled={!a.backendConfigured}
            aria-label={c.refresh}
            onClick={a.refreshStats}
          >
            <RefreshCw size={15} />
          </button>
        </h2>
        <span className="standing-overall">
          <Star size={22} />
          <b>
            {average === null ? "—" : average.toFixed(2)}
            <small> / 5</small>
          </b>
        </span>
        <p>
          {c.overall} · {total} {c.ratingCount}
        </p>
      </div>
      <div className="standing-modes">
        {["net", "likes", "dislikes", "rating"].map((m) => (
          <button
            className={mode === m ? "active" : ""}
            key={m}
            onClick={() => setMode(m)}
          >
            {c[m]}
          </button>
        ))}
      </div>
      {(!a.backendConfigured || a.statsError) && (
        <p className="community-fineprint">
          {a.statsError ? c.error : c.setup}
        </p>
      )}
      <ol>
        {rows.slice(0, 10).map((r, i) => (
          <li key={r.fighter_id}>
            <button
              onClick={() => (location.hash = `fighter/${r.fighter_id}/story`)}
            >
              <span className="standing-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <img src={fighterArtPath(r.fighter_id)} alt="" />
              <span>
                <b>{name(r.fighter_id, lang)}</b>
                <small>
                  <ThumbsUp size={10} />
                  {r.likes}
                  <ThumbsDown size={10} />
                  {r.dislikes}
                </small>
              </span>
              <strong>
                {mode === "rating"
                  ? r.average === null
                    ? "—"
                    : Number(r.average).toFixed(1)
                  : mode === "net"
                    ? r.likes - r.dislikes
                    : r[mode]}
              </strong>
            </button>
          </li>
        ))}
      </ol>
      {total === 0 && <p className="community-fineprint">{c.noVotes}</p>}
    </aside>
  );
}
export function FighterCommunity({ id, lang }) {
  const a = useCommunity(),
    c = communityCopy[lang],
    [comments, setComments] = useState([]),
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const own = a.evaluations[id] || { vote: 0, stars: null },
    stat = a.stats.find((s) => s.fighter_id === id) || {
      likes: 0,
      dislikes: 0,
      average: null,
      rating_count: 0,
    };
  const load = async () => {
    if (!client) return;
    const { data, error } = await client
      .from("comments")
      .select("user_id,content,updated_at,profiles(display_name)")
      .eq("fighter_id", id)
      .order("updated_at", { ascending: false })
      .limit(50);
    if (error) {
      setError(true);
      return;
    }
    setError(false);
    setComments(data || []);
  };
  useEffect(() => {
    let stop = false;
    setComments([]);
    setText("");
    setError(false);
    if (client)
      client
        .from("comments")
        .select("user_id,content,updated_at,profiles(display_name)")
        .eq("fighter_id", id)
        .order("updated_at", { ascending: false })
        .limit(50)
        .then(({ data, error }) => {
          if (!stop) {
            setError(Boolean(error));
            setComments(data || []);
          }
        });
    return () => {
      stop = true;
    };
  }, [id, a.user?.id]);
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      cleanComment(text);
      if (await a.postComment(id, text)) {
        setText("");
        await load();
      }
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="wrap fighter-community">
      <div className="community-section-header">
        <div>
          <span className="eyebrow">FIGHTER / COMMUNITY</span>
          <h2>{c.community}</h2>
        </div>
        <b className="community-average">
          {stat.average === null ? "—" : Number(stat.average).toFixed(2)}
          <small> / 5</small>
        </b>
      </div>
      <div className="fighter-verdict">
        <div className="vote-buttons">
          <button
            aria-pressed={own.vote === 1}
            className={own.vote === 1 ? "selected" : ""}
            onClick={() => a.evaluate(id, own.vote === 1 ? 0 : 1, own.stars)}
            disabled={
              (a.user && !a.privateReady) || a.pending.includes(`e:${id}`)
            }
          >
            <ThumbsUp size={20} />
            {c.likes}
            <b>{stat.likes}</b>
          </button>
          <button
            aria-pressed={own.vote === -1}
            className={own.vote === -1 ? "selected negative" : ""}
            onClick={() => a.evaluate(id, own.vote === -1 ? 0 : -1, own.stars)}
            disabled={
              (a.user && !a.privateReady) || a.pending.includes(`e:${id}`)
            }
          >
            <ThumbsDown size={20} />
            {c.dislikes}
            <b>{stat.dislikes}</b>
          </button>
        </div>
        <div className="rating-control">
          <span>{c.rating}</span>
          <div role="group" aria-label={c.rating}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                aria-label={`${n} / 5`}
                aria-pressed={own.stars === n}
                key={n}
                disabled={
                  (a.user && !a.privateReady) || a.pending.includes(`e:${id}`)
                }
                onClick={() => a.evaluate(id, own.vote, n)}
              >
                <Star
                  size={24}
                  fill={own.stars >= n ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
          {own.stars !== null && (
            <button
              className="community-text-button"
              onClick={() => a.evaluate(id, own.vote, null)}
            >
              {c.clear}
            </button>
          )}
          <small>
            {stat.rating_count} {c.ratingCount}
          </small>
        </div>
      </div>
      {!a.backendConfigured && <p className="community-notice">{c.setup}</p>}
      <div className="comment-section">
        <h3>{c.comment}</h3>
        <form onSubmit={submit}>
          <label htmlFor={`comment-${id}`} className="community-fineprint">
            {c.commentHint}
          </label>
          <div className="comment-compose">
            <input
              id={`comment-${id}`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={a.user ? c.comment : c.loginHint}
              disabled={!a.user}
              aria-describedby={`count-${id}`}
            />
            <span
              id={`count-${id}`}
              className={textLength(text) > 15 ? "too-long" : ""}
            >
              {textLength(text)} / 15
            </span>
            <button
              type="submit"
              className="button community-primary"
              disabled={
                busy || !a.user || !text.trim() || textLength(text) > 15
              }
            >
              {busy ? c.loading : c.send}
            </button>
          </div>
        </form>
        {!a.user && (
          <button
            className="community-text-button"
            onClick={() => a.setAuthOpen(true)}
          >
            {c.loginHint}
            <ArrowUpRight size={15} />
          </button>
        )}
        {error && (
          <p role="alert" className="community-error">
            {c.error}
          </p>
        )}
        <ul className="comment-list">
          {comments.map((row) => (
            <li key={row.user_id}>
              <UserRound size={22} />
              <div>
                <b>{row.profiles?.display_name || "FIGHTER"}</b>
                <p>{row.content}</p>
                <time>
                  {new Date(row.updated_at).toLocaleDateString(
                    { zh: "zh-CN", en: "en", ja: "ja" }[lang],
                  )}
                </time>
              </div>
              {a.user?.id === row.user_id && (
                <div className="comment-actions">
                  <button
                    className="community-text-button"
                    onClick={() => {
                      setText(row.content);
                      document.getElementById(`comment-${id}`).focus();
                    }}
                  >
                    {c.edit}
                  </button>
                  <button
                    aria-label={c.delete}
                    className="icon-button"
                    onClick={async () => {
                      try {
                        await a.deleteComment(id);
                        await load();
                      } catch {
                        setError(true);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        {!comments.length && !error && (
          <p className="community-fineprint">{c.noComments}</p>
        )}
      </div>
    </section>
  );
}
export function CommunityNotice({ lang }) {
  const a = useCommunity(),
    c = communityCopy[lang];
  useEffect(() => {
    if (a.notice) {
      const timer = setTimeout(() => a.setNotice(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [a.notice]);
  return a.notice ? (
    <div className="community-toast" role="status">
      <span>{c[a.notice] || c.error}</span>
      <button aria-label="Close" onClick={() => a.setNotice("")}>
        ×
      </button>
    </div>
  ) : null;
}
