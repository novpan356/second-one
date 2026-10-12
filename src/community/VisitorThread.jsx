import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  Send,
  Trash2,
} from "lucide-react";
import { useCommunity } from "./store.jsx";
import { communityCopy } from "./copy.js";
import { textLength, sortComments } from "./model.js";
import { client } from "./client.js";
export function QuickComment({ id, lang }) {
  const a = useCommunity(),
    c = communityCopy[lang],
    [text, setText] = useState(""),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      if (await a.postComment(id, text)) {
        setText("");
        setMessage(a.backendConfigured ? c.published : c.localPublished);
      }
    } catch {
      setMessage(c.error);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form className="quick-comment" onSubmit={submit}>
      <div>
        <input
          aria-label={`${c.comment} ${id}`}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setMessage("");
          }}
          placeholder={c.visitorPlaceholder}
          aria-describedby={`comment-count-${id}`}
        />
        <button
          aria-label={`${c.send} ${id}`}
          type="submit"
          disabled={busy || !text.trim() || textLength(text) > 15}
        >
          <Send size={13} />
        </button>
      </div>
      <small
        id={`comment-count-${id}`}
        className={textLength(text) > 15 ? "too-long" : ""}
      >
        {message || `${textLength(text)} / 15`}
      </small>
    </form>
  );
}
export function CardCommunity({ id, lang }) {
  const a = useCommunity(),
    c = communityCopy[lang],
    own = a.evaluations[id] || { vote: 0, stars: null },
    stat = a.stats.find((s) => s.fighter_id === id) || {
      likes: 0,
      dislikes: 0,
    },
    top = a.topComments.find((r) => r.fighter_id === id);
  return (
    <div className="card-community">
      <div className="card-votes">
        {[1, -1].map((v) => (
          <button
            key={v}
            aria-label={`${v === 1 ? c.likes : c.dislikes} ${id}`}
            aria-pressed={own.vote === v}
            disabled={a.pending.includes("e:" + id)}
            onClick={() => a.evaluate(id, own.vote === v ? 0 : v, own.stars)}
          >
            {v === 1 ? <ThumbsUp size={12} /> : <ThumbsDown size={12} />}
            <b>{v === 1 ? stat.likes : stat.dislikes}</b>
          </button>
        ))}
      </div>
      <button
        className="card-top-comment"
        onClick={() => (location.hash = `fighter/${id}/moves`)}
        title={top?.content || c.noComments}
      >
        <MessageSquare size={11} />
        <span>{top?.content || c.firstComment}</span>
        {top && <small>+{top.likes}</small>}
      </button>
      <QuickComment id={id} lang={lang} />
    </div>
  );
}
export function VisitorThread({ id, lang, compact = true }) {
  const a = useCommunity(),
    c = communityCopy[lang],
    [rows, setRows] = useState([]),
    [error, setError] = useState(false),
    [limit, setLimit] = useState(50),
    [busy, setBusy] = useState(false);
  useEffect(() => setLimit(50), [id]);
  useEffect(() => {
    let stopped = false;
    if (!client) {
      setRows(sortComments(a.localComments.filter((r) => r.fighter_id === id)));
      setError(false);
      return;
    }
    setBusy(true);
    client
      .from("comment_summaries")
      .select("*")
      .eq("fighter_id", id)
      .order("likes", { ascending: false })
      .order("dislikes", { ascending: true })
      .order("updated_at", { ascending: false })
      .order("user_id", { ascending: true })
      .limit(limit)
      .then(({ data, error }) => {
        if (stopped) return;
        setError(Boolean(error));
        if (!error) setRows(data || []);
        setBusy(false);
      });
    return () => {
      stopped = true;
    };
  }, [id, a.commentRevision, a.localComments, limit]);
  const top = rows[0] || a.topComments.find((r) => r.fighter_id === id);
  const reaction = (row, v) =>
    a.reactComment(
      id,
      row.user_id,
      (a.commentVotes[`${id}:${row.user_id}`] || 0) === v ? 0 : v,
    );
  return (
    <section
      className={"visitor-thread " + (compact ? "compact-thread" : "")}
      aria-label={c.comment}
    >
      <details>
        <summary>
          <span className="thread-heading">
            <MessageSquare size={16} />
            {c.hotComments}
          </span>
          <span className="thread-preview">
            {top?.content || c.firstComment}
          </span>
          {top && (
            <small>
              <ThumbsUp size={11} />
              {top.likes}
            </small>
          )}
          <ChevronDown size={17} />
        </summary>
        <div className="thread-body">
          <p className="community-fineprint">{c.commentOrder}</p>
          {!a.backendConfigured && (
            <p className="community-notice">{c.localNotice}</p>
          )}
          <QuickComment id={id} lang={lang} />
          {error && (
            <p className="community-error" role="alert">
              {c.error}
            </p>
          )}
          {busy && <p role="status">{c.loading}</p>}
          <ol className="thread-list">
            {rows.map((row) => (
              <li key={row.user_id}>
                <div>
                  <b>
                    {row.display_name === "游客"
                      ? c.visitor
                      : row.display_name || c.visitor}
                  </b>
                  <p>{row.content}</p>
                  <small>
                    {new Date(row.updated_at).toLocaleDateString(
                      { zh: "zh-CN", en: "en", ja: "ja" }[lang],
                    )}
                  </small>
                </div>
                <div className="thread-reactions">
                  {[1, -1].map((v) => (
                    <button
                      key={v}
                      aria-label={`${v === 1 ? c.likes : c.dislikes} ${row.content}`}
                      aria-pressed={
                        a.commentVotes[`${id}:${row.user_id}`] === v
                      }
                      disabled={a.pending.includes(`r:${id}:${row.user_id}`)}
                      onClick={() => reaction(row, v)}
                    >
                      {v === 1 ? (
                        <ThumbsUp size={13} />
                      ) : (
                        <ThumbsDown size={13} />
                      )}
                      <span>{v === 1 ? row.likes : row.dislikes}</span>
                    </button>
                  ))}
                  {a.visitorId === row.user_id && (
                    <button
                      aria-label={c.delete}
                      onClick={() =>
                        a.deleteComment(id).catch(() => a.setNotice("error"))
                      }
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>
          {!rows.length && !busy && !error && (
            <p className="community-fineprint">{c.noComments}</p>
          )}
          {client && rows.length === limit && (
            <button
              className="community-text-button"
              disabled={busy}
              onClick={() => setLimit((n) => n + 50)}
            >
              {c.moreComments}
            </button>
          )}
        </div>
      </details>
    </section>
  );
}
