import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { client, backendConfigured } from "./client.js";
import { cleanComment, moveKey, validEvaluation } from "./model.js";
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
    let cancelled = false;
    setPrivateReady(!user);
    setPrivateError(false);
    setEvaluations({});
    if (!user) {
      setFighters(read("atlas-favorites", []));
      setMoves(read("atlas-move-favorites", []));
      return;
    }
    setFighters([]);
    setMoves([]);
    Promise.all([
      client.from("favorites").select("*").eq("user_id", user.id),
      client.from("evaluations").select("*").eq("user_id", user.id),
    ])
      .then((rs) => {
        const [f, e] = rs.map(result);
        if (cancelled) return;
        setFighters(f.filter((x) => x.kind === "fighter").map((x) => x.target));
        setMoves(
          f
            .filter((x) => x.kind === "move")
            .map((x) => ({ ...x.details, key: x.target })),
        );
        setEvaluations(Object.fromEntries(e.map((x) => [x.fighter_id, x])));
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
        current = uid.current;
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
        current = uid.current;
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
      if (!user) {
        setAuthOpen(true);
        return;
      }
      if (!privateReady) return;
      if (!validEvaluation(vote, stars)) throw Error("Invalid evaluation");
      const current = uid.current;
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
      setEvaluations((prev) => ({ ...prev, [fighter]: { vote, stars } }));
      await refreshStats();
    });
  const postComment = async (fighter, text) => {
    if (!user) {
      setAuthOpen(true);
      return false;
    }
    const content = cleanComment(text);
    result(
      await client
        .from("comments")
        .upsert(
          { user_id: user.id, fighter_id: fighter, content },
          { onConflict: "user_id,fighter_id" },
        ),
    );
    return true;
  };
  const deleteComment = async (fighter) => {
    if (!user) return;
    result(
      await client
        .from("comments")
        .delete()
        .eq("user_id", user.id)
        .eq("fighter_id", fighter),
    );
  };
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
        stats,
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
