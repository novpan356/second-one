import test from "node:test";
import assert from "node:assert/strict";
import {
  movementAssessment as assess,
  movementMatches,
  movementCopy,
} from "../src/movement.js";
import { readFile } from "node:fs/promises";

test("tracking never implies the opposite direction is escapable", () => {
  const move = { notes: "Has good left sidestep tracking", command: "b,f+2" };
  const a = assess(move);
  assert.equal(a.kind, "tracking");
  assert.deepEqual(a.directions, ["SSL", "SWL"]);
  assert.equal(movementMatches({ move, assessment: a }, "", "right"), false);
});
test("self movement, stance cancels and sidestep startup do not become defensive advice", () => {
  for (const notes of [
    "Sidesteps to the left",
    "Cancel to sidestep with u",
    "Sidestep takes 9f; effective startup i29",
    "Stance sidestep with u_d",
    "Can sidestep with U and D",
  ])
    assert.equal(assess({ notes }).kind, "unknown");
});
test("specific range, blocked-hit windows, tracking questions and homing stay distinct", () => {
  const raven = assess({
    notes: "Pseudo-homing. Can only be sidewalked left at range",
  });
  assert.equal(raven.kind, "evade");
  assert.deepEqual(raven.directions, ["SWL"]);
  assert.equal(raven.context, "range");
  const kuma = assess({
    notes:
      "Interrupt with i8 from 5th block Can SSL/SSR and SWL/SWR from 5th block",
  });
  assert.deepEqual(kuma.directions, ["SSL", "SSR", "SWL", "SWR"]);
  assert.equal(kuma.afterBlock, "5");
  const claudio = assess({
    notes: "Pseudo homing to sidestep left and sidewalk left?",
  });
  assert.equal(claudio.kind, "tracking");
  assert.equal(claudio.tentative, true);
  assert.equal(assess({ notes: "Balcony Break Homing" }).kind, "homing");
});
test("researched Leo string response retains defender restrictions and pinned citations", () => {
  const a = assess({ command: "b+1,4", notes: "" }, "leo");
  assert.equal(a.kind, "evade");
  assert.equal(a.afterBlock, "1");
  assert.equal(a.beforeHit, "2");
  assert.equal(a.defenders.length, 13);
  assert.ok(a.defenders.includes("king"));
  assert.equal(a.defenders.includes("jin"), false);
  for (const ref of a.references)
    assert.match(ref.url, /979b0c5a20b9ba80e14d960b9fddb23a205e5c17/);
});
test("movement interface translations have matching keys and every escape has explicit evidence", async () => {
  for (const lang of ["en", "ja"]) {
    assert.deepEqual(
      Object.keys(movementCopy.zh).sort(),
      Object.keys(movementCopy[lang]).sort(),
    );
    assert.deepEqual(
      Object.keys(movementCopy.zh.filters).sort(),
      Object.keys(movementCopy[lang].filters).sort(),
    );
  }
  const roster = JSON.parse(
    await readFile(new URL("../public/data/roster.json", import.meta.url)),
  );
  let escapeCount = 0;
  for (const fighter of roster) {
    const data = JSON.parse(
      await readFile(
        new URL(`../public/data/${fighter.id}.json`, import.meta.url),
      ),
    );
    for (const m of data.moves) {
      const a = assess(m, fighter.id);
      if (a.kind === "evade") {
        assert.ok(a.evidence);
        escapeCount++;
      }
    }
  }
  assert.ok(escapeCount >= 10);
});
