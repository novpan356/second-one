// Deploy only with an authorized upstream API. No EWGF frontend HTML is scraped.
// Contract follows the archived EWGF backend's documented paths; verify the
// actual upstream version and authorization before setting PLAYER_UPSTREAM_URL.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "apikey,authorization,content-type",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
};
const reply = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json",
      "Cache-Control": status === 200 ? "public, max-age=30" : "no-store",
    },
  });
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS")
    return new Response(null, { status: 204, headers: cors });
  if (req.method !== "GET") return reply({ error: "Method not allowed" }, 405);
  const base = Deno.env.get("PLAYER_UPSTREAM_URL");
  if (!base)
    return reply({ error: "Authorized upstream is not configured" }, 503);
  const u = new URL(req.url),
    action = u.searchParams.get("action"),
    q = (u.searchParams.get("q") || "").trim(),
    id = (u.searchParams.get("id") || "").trim();
  let path: string;
  if (action === "search" && q.length >= 3 && q.length <= 80)
    path = `/player-stats/search?query=${encodeURIComponent(q)}`;
  else if (
    action === "profile" &&
    id.length >= 1 &&
    id.length <= 100 &&
    /^[\p{L}\p{N}_ \-]+$/u.test(id)
  )
    path = `/player-stats/${encodeURIComponent(id)}`;
  else if (action === "leaderboard") path = "/statistics/leaderboards";
  else return reply({ error: "Invalid query" }, 400);
  try {
    const upstream = new URL(base);
    if (upstream.protocol !== "https:")
      return reply({ error: "Upstream must use HTTPS" }, 503);
    const headers: Record<string, string> = { Accept: "application/json" };
    const token = Deno.env.get("PLAYER_UPSTREAM_TOKEN");
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(base.replace(/\/$/, "") + path, {
      headers,
      signal: AbortSignal.timeout(12000),
      redirect: "error",
    });
    if (!response.ok) return reply({ error: "Upstream unavailable" }, 502);
    // Limit data and strip unrelated fields. No upstream secrets or errors are returned.
    const body = await response.text();
    if (body.length > 2_000_000)
      return reply({ error: "Upstream payload too large" }, 502);
    const data = JSON.parse(body),
      clean = (p: Record<string, unknown>) => {
        const keys = [
          "id",
          "name",
          "username",
          "playerName",
          "polarisId",
          "tekkenId",
          "rank",
          "rankPoints",
          "score",
          "ranking",
          "tekkenPower",
          "tekkenProwess",
          "totalMatches",
          "winRate",
          "latestBattleDate",
          "updatedAt",
          "characterName",
          "charaId",
        ];
        const result: Record<string, unknown> = Object.fromEntries(
          keys
            .filter((k) => typeof p[k] === "string" || typeof p[k] === "number")
            .map((k) => [k, p[k]]),
        );
        const rank = p.mainCharacterAndRank;
        if (rank && typeof rank === "object") {
          const r = rank as Record<string, unknown>;
          result.mainCharacterAndRank = Object.fromEntries(
            ["danRank", "characterName"]
              .filter((k) => typeof r[k] === "string")
              .map((k) => [k, r[k]]),
          );
        }
        if (Array.isArray(p.recentMatches))
          result.recentMatches = p.recentMatches
            .slice(0, 30)
            .filter((m) => m && typeof m === "object")
            .map((m) =>
              Object.fromEntries(
                ["opponent", "character", "date", "result"]
                  .filter((k) => typeof m[k] === "string")
                  .map((k) => [k, m[k]]),
              ),
            );
        return result;
      };
    const list = action === "leaderboard" ? data.rankPointsLeaderboard : data;
    if (action !== "profile") {
      if (!Array.isArray(list))
        return reply({ error: "Unrecognized upstream schema" }, 502);
      return reply(
        list
          .slice(0, 100)
          .filter((p) => p && typeof p === "object")
          .map(clean),
      );
    }
    if (!data || typeof data !== "object" || Array.isArray(data))
      return reply({ error: "Unrecognized upstream schema" }, 502);
    return reply(clean(data));
  } catch {
    return reply({ error: "Upstream unavailable" }, 502);
  }
});
