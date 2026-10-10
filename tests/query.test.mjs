import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { filterMoves, punishCandidates, startupFrames } from "../src/query.js";
import { copy } from "../src/i18n.js";
import { editorial } from "../src/editorial.js";
const roster = JSON.parse(
  await readFile(new URL("../public/data/roster.json", import.meta.url)),
);
test("every listed fighter has valid source data and three-language editorial context", async () => {
  assert.equal(new Set(roster.map((r) => r.id)).size, 41);
  for (const r of roster) {
    const data = JSON.parse(
      await readFile(new URL(`../public/data/${r.id}.json`, import.meta.url)),
    );
    assert.ok(data.moves.length);
    assert.equal(data.moves.length, r.count);
    assert.equal(data.combos.length, r.comboCount);
    assert.match(data.source, /^https:\/\/wavu\.wiki\//);
    assert.equal(data.gameVersion, null);
    for (const lang of ["zh", "en", "ja"])
      assert.ok(editorial[r.id].story[lang]);
  }
});
test("all interface translation keys exist in all three languages", () => {
  for (const lang of ["en", "ja"])
    assert.deepEqual(
      Object.keys(copy[lang]).sort(),
      Object.keys(copy.zh).sort(),
    );
});
test("filters find actual input records and exclude unknown or contextual block frames", () => {
  const moves = [
    {
      name: "Jab",
      command: "1",
      startup: "i10",
      target: "h",
      block: "+1",
      notes: "",
      section: "n",
    },
    {
      name: "Mid",
      command: "df+2",
      startup: "i15",
      target: "m",
      block: "-12",
      notes: "",
      section: "df",
    },
    {
      name: "Unknown",
      command: "db+4",
      startup: "i20",
      target: "l",
      block: "",
      notes: "",
      section: "db",
    },
    {
      name: "Context",
      command: "3",
      startup: "i16",
      target: "m",
      block: "-4~+1",
      notes: "",
      section: "n",
    },
  ];
  assert.equal(filterMoves(moves, { query: "DF+2" })[0].name, "Mid");
  assert.equal(filterMoves(moves, { level: "l" })[0].name, "Unknown");
  assert.deepEqual(
    filterMoves(moves, { safe: true }).map((x) => x.name),
    ["Jab"],
  );
});
test("punishment candidates exclude strings, stance-only moves and frame ranges too slow at their final active frame", () => {
  const moves = [
    { command: "1", startup: "i10", target: "h" },
    { command: "1,2", startup: ",i12", target: "h" },
    { command: "ZEN.1", startup: "i10", target: "m" },
    { command: "df+2", startup: "i14~16", target: "m" },
    { command: "ws4", startup: "i11", target: "m" },
    { command: "f,n,d,df#2", startup: "i11", target: "h" },
  ];
  assert.deepEqual(
    punishCandidates(moves, 15, "standing").map((x) => x.command),
    ["1"],
  );
  assert.deepEqual(
    punishCandidates(moves, 11, "ws").map((x) => x.command),
    ["ws4"],
  );
  assert.equal(startupFrames(moves[1]), null);
});
