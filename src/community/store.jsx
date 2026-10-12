import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { client, backendConfigured } from "./client.js";
import {
  cleanComment,
  moveKey,
  validEvaluation,
  sortComments,
} from "./model.js";
const Context = createContext(null);
const read = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : fallback;
  } catch {
    return fallback;
  }
};
const write = (key, v) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
};
const result = ({ data, error }) => {
  if (error) throw error;
  return data;
};
export function CommunityProvider({ children }) {
  const [user, setUser] = useState(null),
    [ready, setReady] = useState(!client),
    [privateReady, setPrivateReady] = useState(!client);
  const [fighterFavorites, setFighters] = useState(() =>
    read("atlas-favorites", []),
  );
  const [moveFavorites, setMoves] = useState(() =>
    read("atlas-move-favorites", []),
  );
  const [stats, setStats] = useState([]),
    [evaluations, setEvaluations] = useState({}),
    [authOpen, setAuthOpen] = useState(false),
    [recovery, setRecovery] = useState(false);
  const [notice, setNotice] = useState(""),
    [statsError, setStatsError] = useState(false);
  const [privateError, setPrivateError] = useState(false);
  const [pending, setPending] = useState([]);
  const uid = useRef(null),
    locks = useRef(new Set());
  const [localId] = useState(() => {
    try {
      let id = localStorage.getItem("atlas-visitor-id");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("atlas-visitor-id", id);
      }
      return id;
    } catch {
      return crypto.randomUUID();
    }
  });
  const [localComments, setLocalComments] = useState(() =>
    read("atlas-guest-comments", []),
  );
  const [localReactions, setLocalReactions] = useState(() =>
    read("atlas-guest-reactions", []),
  );
  const [topComments, setTopComments] = useState([]),
    [commentVotes, setCommentVotes] = useState({}),
    [commentRevision, setCommentRevision] = useState(0);
  const visitorPromise = useRef(null),
    evaluationVersion = useRef(0);
  const localSummaries = useMemo(
    () =>
      localComments.map((r) => ({
        ...r,
        likes: localReactions.filter(
          (v) =>
            v.fighter_id === r.fighter_id &&
            v.comment_user_id === r.user_id &&
            v.vote === 1,
        ).length,
        dislikes: localReactions.filter(
          (v) =>
            v.fighter_id === r.fighter_id &&
            v.comment_user_id === r.user_id &&
            v.vote === -1,
        ).length,
      })),
    [localComments, localReactions],
  );
  const localTop = useMemo(
    () => [
      ...new Map(
        sortComments(localSummaries)
          .map((r) => [r.fighter_id, r])
          .reverse(),
      ).values(),
    ],
    [localSummaries],
  );
  const refreshComments = useCallback(async () => {
    if (client) {
      try {
        setTopComments(
          result(await client.rpc("top_character_comments")) || [],
        );
      } catch {
        setNotice("error");
      }
    }
    setCommentRevision((n) => n + 1);
  }, []);
  useEffect(() => {
    refreshComments();
  }, [refreshComments]);
  const ensureVisitor = async () => {
    if (!client) return localId;
    if (uid.current) return uid.current;
    if (!visitorPromise.current)
      visitorPromise.current = (async () => {
        const existing = await client.auth.getSession();
        if (existing.error) throw existing.error;
        if (existing.data.session?.user) {
          uid.current = existing.data.session.user.id;
          setUser(existing.data.session.user);
          return uid.current;
        }
        const { data, error } = await client.auth.signInAnonymously({
          options: { data: { display_name: "游客" } },
        });
        if (error || !data.user)
          throw error || Error("Guest session unavailable");
        uid.current = data.user.id;
        setUser(data.user);
        return data.user.id;
      })().finally(() => {
        visitorPromise.current = null;
      });
    return visitorPromise.current;
  };
  useEffect(() => {
    if (!client) return;
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      uid.current = session?.user?.id || null;
      setUser(session?.user || null);
      setReady(true);
      if (event === "PASSWORD_RECOVERY") {
        setRecovery(true);
        setAuthOpen(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const refreshStats = useCallback(async () => {
    if (!client) return;
    try {
      setStats(result(await client.rpc("character_standings")) || []);
      setStatsError(false);
    } catch {
      setStatsError(true);
    }
  }, []);
  useEffect(() => {
    refreshStats();
  }, [refreshStats]);
  useEffect(() => {
    if (!client) return;
    const refresh = () => {
      if (document.visibilityState === "visible") {
        refreshComments();
        refreshStats();
      }
    };
    const timer = setInterval(refresh, 30000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [refreshComments, refreshStats]);
  useEffect(() => {
    let cancelled = false;
    setPrivateReady(!user);
    setPrivateError(false);
    if (!client)
      setEvaluations(
        Object.fromEntries(
          read("atlas-guest-evaluations", []).map((r) => [r.fighter_id, r]),
        ),
      );
    else setEvaluations({});
    if (!client)
      setCommentVotes(
        Object.fromEntries(
          localReactions.map((r) => [
            `${r.fighter_id}:${r.comment_user_id}`,
            r.vote,
          ]),
        ),
      );
    else setCommentVotes({});
    if (!user) {
      setFighters(read("atlas-favorites", []));
      setMoves(read("atlas-move-favorites", []));
      return;
    }
    if (!user.is_anonymous) {
      setFighters([]);
      setMoves([]);
    }
    const version = evaluationVersion.current;
    Promise.all([
      client.from("favorites").select("*").eq("user_id", user.id),
      client.from("evaluations").select("*").eq("user_id", user.id),
      client.from("comment_reactions").select("*").eq("user_id", user.id),
    ])
      .then((rs) => {
        const [f, e, reactions] = rs.map(result);
        if (cancelled) return;
        if (!user.is_anonymous)
          setFighters(
            f.filter((x) => x.kind === "fighter").map((x) => x.target),
          );
        if (!user.is_anonymous)
          setMoves(
            f
              .filter((x) => x.kind === "move")
              .map((x) => ({ ...x.details, key: x.target })),
          );
        if (version === evaluationVersion.current) {
          setEvaluations(Object.fromEntries(e.map((x) => [x.fighter_id, x])));
          setCommentVotes(
            Object.fromEntries(
              reactions.map((r) => [
                `${r.fighter_id}:${r.comment_user_id}`,
                r.vote,
              ]),
            ),
          );
        }

        setPrivateReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setNotice("error");
          setPrivateError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);
  const run = async (key, fn) => {
    if (locks.current.has(key)) return;
    locks.current.add(key);
    setPending([...locks.current]);
    try {
      await fn();
    } catch {
      setNotice("error");
    } finally {
      locks.current.delete(key);
      setPending([...locks.current]);
    }
  };
  const toggleFighter = (id) =>
    run("f:" + id, async () => {
      const selected = fighterFavorites.includes(id),
        current = user && !user.is_anonymous ? uid.current : null;
      if (current) {
        if (!privateReady) return;
        result(
          selected
            ? await client
                .from("favorites")
                .delete()
                .eq("user_id", current)
                .eq("kind", "fighter")
                .eq("target", id)
            : await client.from("favorites").upsert(
                {
                  user_id: current,
                  kind: "fighter",
                  target: id,
                  details: {},
                },
                { onConflict: "user_id,kind,target" },
              ),
        );
        if (uid.current !== current) return;
      }
      setFighters((prev) => {
        const next = selected
          ? prev.filter((x) => x !== id)
          : [...new Set([...prev, id])];
        if (!current) write("atlas-favorites", next);
        return next;
      });
    });
  const toggleMove = (fighter, m) =>
    run("m:" + moveKey(fighter, m), async () => {
      const key = moveKey(fighter, m),
        selected = moveFavorites.some((x) => x.key === key),
        current = user && !user.is_anonymous ? uid.current : null;
      const record = {
        key,
        id: m.id,
        section: m.section,
        fighter,
        command: m.command,
        name: m.name || m.command,
      };
      if (current) {
        if (!privateReady) return;
        result(
          selected
            ? await client
                .from("favorites")
                .delete()
                .eq("user_id", current)
                .eq("kind", "move")
                .eq("target", key)
            : await client.from("favorites").upsert(
                {
                  user_id: current,
                  kind: "move",
                  target: key,
                  details: record,
                },
                { onConflict: "user_id,kind,target" },
              ),
        );
        if (uid.current !== current) return;
      }
      setMoves((prev) => {
        const next = selected
          ? prev.filter((x) => x.key !== key)
          : [...new Map([...prev, record].map((x) => [x.key, x])).values()];
        if (!current) write("atlas-move-favorites", next);
        return next;
      });
    });
  const evaluate = (fighter, vote, stars) =>
    run("e:" + fighter, async () => {
      if (!validEvaluation(vote, stars)) throw Error("Invalid evaluation");
      const current = await ensureVisitor();
      evaluationVersion.current++;
      if (client) {
        if (vote === 0 && stars === null)
          result(
            await client
              .from("evaluations")
              .delete()
              .eq("user_id", current)
              .eq("fighter_id", fighter),
          );
        else
          result(
            await client
              .from("evaluations")
              .upsert(
                { user_id: current, fighter_id: fighter, vote, stars },
                { onConflict: "user_id,fighter_id" },
              ),
          );
        if (uid.current !== current) return;
      }
      evaluationVersion.current++;
      setEvaluations((prev) => {
        const next = {
          ...prev,
          [fighter]: { fighter_id: fighter, vote, stars },
        };
        if (vote === 0 && stars === null) delete next[fighter];
        if (!client) write("atlas-guest-evaluations", Object.values(next));
        return next;
      });
      await refreshStats();
    });
  const postComment = async (fighter, text) => {
    const content = cleanComment(text),
      current = await ensureVisitor();
    if (client)
      result(
        await client
          .from("comments")
          .upsert(
            { user_id: current, fighter_id: fighter, content },
            { onConflict: "user_id,fighter_id" },
          ),
      );
    else
      setLocalComments((prev) => {
        const next = [
          ...prev.filter(
            (r) => r.fighter_id !== fighter || r.user_id !== current,
          ),
          {
            user_id: current,
            fighter_id: fighter,
            content,
            display_name: "游客",
            updated_at: new Date().toISOString(),
          },
        ];
        write("atlas-guest-comments", next);
        return next;
      });
    await refreshComments();
    return true;
  };
  const deleteComment = async (fighter) => {
    const current = client ? uid.current : localId;
    if (!current) return;
    if (client)
      result(
        await client
          .from("comments")
          .delete()
          .eq("user_id", current)
          .eq("fighter_id", fighter),
      );
    else {
      setLocalComments((prev) => {
        const next = prev.filter(
          (r) => r.fighter_id !== fighter || r.user_id !== current,
        );
        write("atlas-guest-comments", next);
        return next;
      });
      setLocalReactions((prev) => {
        const next = prev.filter(
          (r) => r.fighter_id !== fighter || r.comment_user_id !== current,
        );
        write("atlas-guest-reactions", next);
        return next;
      });
    }
    await refreshComments();
  };
  const reactComment = (fighter, author, vote) =>
    run(`r:${fighter}:${author}`, async () => {
      if (![-1, 0, 1].includes(vote)) throw Error("Invalid reaction");
      const current = await ensureVisitor();
      evaluationVersion.current++;
      if (client) {
        if (vote === 0)
          result(
            await client
              .from("comment_reactions")
              .delete()
              .eq("user_id", current)
              .eq("comment_user_id", author)
              .eq("fighter_id", fighter),
          );
        else
          result(
            await client.from("comment_reactions").upsert(
              {
                user_id: current,
                comment_user_id: author,
                fighter_id: fighter,
                vote,
              },
              { onConflict: "user_id,comment_user_id,fighter_id" },
            ),
          );
        if (uid.current !== current) return;
      } else
        setLocalReactions((prev) => {
          const next = prev.filter(
            (r) =>
              !(
                r.user_id === current &&
                r.comment_user_id === author &&
                r.fighter_id === fighter
              ),
          );
          if (vote)
            next.push({
              user_id: current,
              comment_user_id: author,
              fighter_id: fighter,
              vote,
            });
          write("atlas-guest-reactions", next);
          return next;
        });
      evaluationVersion.current++;
      setCommentVotes((prev) => ({ ...prev, [`${fighter}:${author}`]: vote }));
      await refreshComments();
    });
  const importFavorites = () =>
    run("import", async () => {
      if (!user || !privateReady) return;
      const current = user.id;
      const records = [
        ...read("atlas-favorites", []).map((target) => ({
          user_id: current,
          kind: "fighter",
          target,
          details: {},
        })),
        ...read("atlas-move-favorites", []).map((m) => ({
          user_id: current,
          kind: "move",
          target: m.key,
          details: m,
        })),
      ];
      if (!records.length) return;
      result(
        await client
          .from("favorites")
          .upsert(records, { onConflict: "user_id,kind,target" }),
      );
      if (uid.current !== current) return;
      setFighters((prev) => [
        ...new Set([
          ...prev,
          ...records.filter((r) => r.kind === "fighter").map((r) => r.target),
        ]),
      ]);
      setMoves((prev) => [
        ...new Map(
          [
            ...prev,
            ...records.filter((r) => r.kind === "move").map((r) => r.details),
          ].map((r) => [r.key, r]),
        ).values(),
      ]);
      setNotice("saved");
    });
  return (
    <Context.Provider
      value={{
        user,
        ready,
        privateReady,
        privateError,
        pending,
        backendConfigured,
        fighterFavorites,
        moveFavorites,
        stats: client
          ? stats
          : Object.values(evaluations).map((r) => ({
              fighter_id: r.fighter_id,
              likes: r.vote === 1 ? 1 : 0,
              dislikes: r.vote === -1 ? 1 : 0,
              average: r.stars,
              rating_count: r.stars === null ? 0 : 1,
              star_sum: r.stars || 0,
            })),
        topComments: client ? topComments : localTop,
        localComments: localSummaries,
        commentVotes,
        commentRevision,
        reactComment,
        visitorId: client ? user?.id : localId,
        statsError,
        evaluations,
        authOpen,
        setAuthOpen,
        recovery,
        setRecovery,
        notice,
        setNotice,
        toggleFighter,
        toggleMove,
        evaluate,
        postComment,
        deleteComment,
        refreshStats,
        importFavorites,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useCommunity = () => useContext(Context);
