import test from "node:test";
import assert from "node:assert/strict";
import {
  cleanComment,
  textLength,
  validEvaluation,
  sortStandings,
  normalizePlayer,
  ewgfProfile,
  moveKey,
} from "../src/community/model.js";
import { communityCopy } from "../src/community/copy.js";
test("15 character comments use Unicode code points and reject empty, long and multiline messages", () => {
  assert.equal(textLength("🥊"), 1);
  assert.equal(cleanComment("  很喜欢这个角色🥊  "), "很喜欢这个角色🥊");
  assert.equal(cleanComment("🥊".repeat(15)), "🥊".repeat(15));
  for (const value of ["", " ".repeat(4), "🥊".repeat(16), "hello\nworld"])
    assert.throws(() => cleanComment(value));
});
test("votes and star values cannot exceed their intended domains", () => {
  for (const vote of [-1, 0, 1])
    for (const stars of [null, 1, 2, 3, 4, 5])
      assert.equal(validEvaluation(vote, stars), true);
  for (const [vote, stars] of [
    [2, 5],
    [-2, null],
    [1, 0],
    [0, 6],
    [1, 3.5],
    ["1", 5],
  ])
    assert.equal(validEvaluation(vote, stars), false);
});
test("standings sort actual counts and ratings; ties are deterministic", () => {
  const rows = [
    { fighter_id: "jin", likes: 4, dislikes: 1, average: 3, rating_count: 2 },
    { fighter_id: "reina", likes: 2, dislikes: 4, average: 5, rating_count: 1 },
  ];
  assert.equal(sortStandings(rows, "net")[0].fighter_id, "jin");
  assert.equal(sortStandings(rows, "dislikes")[0].fighter_id, "reina");
  assert.equal(sortStandings(rows, "rating")[0].fighter_id, "reina");
  assert.equal(rows[0].fighter_id, "jin");
});
test("player normalization preserves missing data instead of inventing ranks or wins", () => {
  const p = normalizePlayer({
    id: "TEST-ID",
    name: "Player",
    rankPoints: 0,
    recentMatches: [{ opponent: "Other", result: "draw" }],
  });
  assert.equal(p.points, 0);
  assert.equal(p.ranking, null);
  assert.equal(p.matches, null);
  assert.equal(p.recentMatches[0].result, null);
  assert.throws(() => normalizePlayer({ name: "Missing id" }));
  assert.ok(ewgfProfile("x/y?z").endsWith("x%2Fy%3Fz"));
});
test("community translations have identical complete keys in Chinese English and Japanese", () => {
  const keys = Object.keys(communityCopy.zh).sort();
  for (const lang of ["en", "ja"]) {
    assert.deepEqual(Object.keys(communityCopy[lang]).sort(), keys);
    for (const v of Object.values(communityCopy[lang]))
      assert.equal(typeof v, "string");
  }
});

test("favorites distinguish different move entries that share an input command", () => {
  const a = { id: "Jin-example-A", command: "1", section: "Standing" },
    b = { id: "Jin-example-B", command: "1", section: "Heat" };
  assert.notEqual(moveKey("jin", a), moveKey("jin", b));
});
