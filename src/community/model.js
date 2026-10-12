export const textLength = (value) => Array.from(value).length;
export function cleanComment(value) {
  const text = String(value).trim();
  if (!text || textLength(text) > 15 || /[\r\n]/.test(text))
    throw new Error("comment-length");
  return text;
}
export function validEvaluation(vote, stars) {
  return (
    [-1, 0, 1].includes(vote) &&
    (stars === null || (Number.isInteger(stars) && stars >= 1 && stars <= 5))
  );
}
export function sortStandings(rows, mode) {
  return [...rows].sort((a, b) => {
    const score = (r) =>
      mode === "rating"
        ? Number(r.average || 0)
        : mode === "likes"
          ? r.likes
          : mode === "dislikes"
            ? r.dislikes
            : r.likes - r.dislikes;
    return (
      score(b) - score(a) ||
      b.rating_count - a.rating_count ||
      a.fighter_id.localeCompare(b.fighter_id)
    );
  });
}
export const moveKey = (fighter, move) =>
  `${fighter}:${typeof move === "object" ? move.id || `${move.section || ""}:${move.command}` : move}`;
const number = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const string = (v) => (typeof v === "string" ? v : "");
export function normalizePlayer(raw) {
  if (!raw || typeof raw !== "object")
    throw new Error("Invalid player payload");
  const id = string(raw.polarisId || raw.tekkenId || raw.id);
  if (!id) throw new Error("Missing player ID");
  return {
    id,
    name: string(raw.playerName || raw.username || raw.name) || id,
    rank: string(raw.mainCharacterAndRank?.danRank || raw.rank),
    points: number(raw.rankPoints ?? raw.score),
    ranking: number(raw.ranking),
    prowess: number(raw.tekkenPower ?? raw.tekkenProwess),
    winRate: number(raw.winRate),
    matches: number(raw.totalMatches),
    updatedAt: string(raw.latestBattleDate || raw.updatedAt),
    character: string(
      raw.mainCharacterAndRank?.characterName ||
        raw.characterName ||
        raw.charaId,
    ),
    recentMatches: (Array.isArray(raw.recentMatches) ? raw.recentMatches : [])
      .slice(0, 30)
      .map((m) => ({
        opponent: string(m.opponent),
        character: string(m.character),
        date: string(m.date),
        result: ["win", "loss"].includes(m.result) ? m.result : null,
      })),
  };
}
export const ewgfProfile = (id) =>
  `https://www.ewgf.gg/player/${encodeURIComponent(id)}`;

// Highest like count wins; fewer dislikes break a tie, then newest message.
export function sortComments(rows) {
  return [...rows].sort(
    (a, b) =>
      Number(b.likes || 0) - Number(a.likes || 0) ||
      Number(a.dislikes || 0) - Number(b.dislikes || 0) ||
      String(b.updated_at).localeCompare(String(a.updated_at)) ||
      a.user_id.localeCompare(b.user_id),
  );
}
