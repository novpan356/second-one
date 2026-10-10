import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  stories,
  relationships,
  relationLabels,
  connections,
  chaptersFor,
  timeline,
  relationshipSources,
  storyName,
} from "../src/lore/index.js";
import { loreCopy } from "../src/lore/copy.js";
const roster = JSON.parse(
  await readFile(new URL("../public/data/roster.json", import.meta.url)),
);
test("every fighter has substantive three-language background and a directly checked official source", () => {
  assert.equal(roster.length, 41);
  for (const f of roster) {
    assert.ok(Object.hasOwn(stories, f.id), f.id);
    const story = stories[f.id];
    for (const lang of ["zh", "en", "ja"]) {
      assert.ok(story.biography[lang].length >= 3, f.id);
      assert.ok(
        story.biography[lang].every((p) => p.length > 25),
        f.id,
      );
      assert.ok(storyName(f.id, lang));
    }
    assert.equal(
      story.sources[0].url,
      `https://tk8.tekken-official.jp/character/index.php?chara=${f.id}`,
    );
    assert.equal(story.sources[0].checkedAt, "2026-10-10");
    assert.ok(connections(f.id).length > 0, f.id);
  }
});
test("relationship links and timeline cast resolve to real dossiers, with citations and no duplicate links", () => {
  const pairs = new Set();
  for (const e of relationships) {
    assert.ok(Object.hasOwn(stories, e.a));
    assert.ok(Object.hasOwn(stories, e.b));
    assert.notEqual(e.a, e.b);
    const pair = [e.a, e.b].sort().join(":");
    assert.equal(pairs.has(pair), false, pair);
    pairs.add(pair);
    assert.ok(relationshipSources(e).length > 0);
    for (const lang of ["zh", "en", "ja"]) {
      assert.ok(relationLabels[lang][e.ab]);
      assert.ok(relationLabels[lang][e.ba]);
      assert.ok(relationLabels[lang][e.group]);
    }
  }
  for (const ch of timeline) {
    for (const id of ch.cast) assert.ok(Object.hasOwn(stories, id), id);
    for (const lang of ["zh", "en", "ja"])
      assert.ok(ch.title[lang] && ch.text[lang]);
    assert.ok(ch.sources.length);
  }
  assert.equal(timeline.filter((c) => c.era === "history").length, 7);
  assert.equal(timeline.filter((c) => c.era === "main").length, 6);
});
test("family relations preserve direction, forms and unconfirmed kinship", () => {
  const jin = connections("jin");
  assert.equal(jin.find((c) => c.id === "kazuya").label, "fatherEnemy");
  assert.equal(jin.find((c) => c.id === "jun").label, "mother");
  assert.equal(jin.find((c) => c.id === "lars").label, "uncle");
  assert.equal(jin.find((c) => c.id === "devil_jin").group, "identity");
  assert.equal(
    connections("asuka").find((c) => c.id === "jun").label,
    "kazamaConnection",
  );
  assert.equal(
    connections("nina").find((c) => c.id === "steve").label,
    "geneticSon",
  );
  assert.equal(
    connections("reina").some((c) => c.id === "kazumi"),
    false,
  );
  assert.equal(
    connections("reina").find((c) => c.id === "heihachi").spoiler,
    true,
  );
  assert.equal(
    connections("kunimitsu").find((c) => c.id === "kunimitsu_i").label,
    "motherPredecessor",
  );
  assert.equal(
    connections("armor_king").find((c) => c.id === "armor_king_i").label,
    "olderBrother",
  );
  assert.equal(
    connections("miary_zo").some((c) => c.id === "ogre"),
    false,
  );
  assert.ok(chaptersFor("jin").some((c) => c.id === "m6"));
});
test("story and relation interface translations match, and guest material stays separate", () => {
  for (const lang of ["en", "ja"]) {
    assert.deepEqual(
      Object.keys(loreCopy[lang]).sort(),
      Object.keys(loreCopy.zh).sort(),
    );
    assert.deepEqual(
      Object.keys(relationLabels[lang]).sort(),
      Object.keys(relationLabels.zh).sort(),
    );
  }
  assert.equal(stories.clive.kind, "guest");
  assert.ok(chaptersFor("clive").every((c) => c.era === "extra"));
});
