export function startupFrames(move) {
  // A multi-hit string's individual extension startup is not its total execution time.
  if (
    /,|~|\b(?:H|ZEN|CD|BT|FC|SS|OTG)\./.test(move.command) ||
    /^i/.test(move.startup) === false
  )
    return null;
  const m = move.startup.match(/^i(\d+)(?:~(\d+))?$/);
  return m ? Number(m[2] || m[1]) : null;
}
export function firstStartup(move) {
  const m = move.startup?.match(/^i(\d+)/);
  return m ? Number(m[1]) : Infinity;
}
export function numericBlock(move) {
  return /^[+-]?\d+$/.test(move.block) ? Number(move.block) : null;
}
export function filterMoves(
  moves,
  { query = "", level = "", safe = false, sort = "source" } = {},
) {
  const q = query.trim().toLowerCase();
  let list = moves.filter(
    (m) =>
      !q ||
      [m.name, m.command, m.notes, m.section].some((s) =>
        s?.toLowerCase().includes(q),
      ),
  );
  if (level === "throw")
    list = list.filter(
      (m) => /throw/i.test(m.section) || /throw/i.test(m.target),
    );
  else if (level)
    list = list.filter((m) => {
      const v = m.target.toLowerCase();
      return v
        .split(/[, /]+/)
        .some(
          (x) => x === level || x === { h: "high", m: "mid", l: "low" }[level],
        );
    });
  if (safe)
    list = list.filter(
      (m) => numericBlock(m) !== null && numericBlock(m) >= -9,
    );
  if (sort === "startup")
    list = [...list].sort((a, b) => firstStartup(a) - firstStartup(b));
  return list;
}
export function punishCandidates(moves, frames, stance) {
  return moves
    .filter((m) => {
      const n = startupFrames(m);
      if (n === null || n > frames || !/^[hml]/i.test(m.target)) return false;
      const ws = /^ws/i.test(m.command);
      if (stance === "ws") return ws;
      return (
        !ws &&
        !/\.|\b(?:FC|SS|BT|H|R|CD|ZEN)|(?:^|[+,])(f|b|d|u),/i.test(m.command) &&
        !/[#]/.test(m.command)
      );
    })
    .sort((a, b) => startupFrames(a) - startupFrames(b));
}
