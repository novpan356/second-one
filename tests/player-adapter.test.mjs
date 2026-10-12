import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { transformWithEsbuild } from "vite";
import vm from "node:vm";
const source = await readFile(
  new URL("../supabase/functions/player-data/index.ts", import.meta.url),
  "utf8",
);
const { code } = await transformWithEsbuild(source, "player-data.ts", {
  loader: "ts",
  format: "esm",
});
function adapter(env, upstream) {
  let handler;
  vm.runInNewContext(code, {
    Deno: { env: { get: (key) => env[key] }, serve: (fn) => (handler = fn) },
    Response,
    Request,
    URL,
    AbortSignal,
    fetch: upstream,
  });
  return handler;
}
test("player adapter rejects unconfigured, invalid and non-HTTPS upstream requests", async () => {
  const handler = adapter({}, () => {
    throw Error("Should not fetch");
  });
  assert.equal(
    (await handler(new Request("https://test/?action=profile&id=X"))).status,
    503,
  );
  const configured = adapter(
    { PLAYER_UPSTREAM_URL: "https://authorized.example" },
    () => {
      throw Error("Should not fetch");
    },
  );
  assert.equal(
    (await configured(new Request("https://test/?action=profile&id=../secret")))
      .status,
    400,
  );
  assert.equal(
    (await configured(new Request("https://test/?action=search&q=ab"))).status,
    400,
  );
  assert.equal(
    (await configured(new Request("https://test/", { method: "POST" }))).status,
    405,
  );
  const insecure = adapter(
    { PLAYER_UPSTREAM_URL: "http://authorized.example" },
    () => {
      throw Error("Should not fetch");
    },
  );
  assert.equal(
    (await insecure(new Request("https://test/?action=profile&id=ABC"))).status,
    503,
  );
});
test("authorized player adapter keeps the token server-side and strips unrelated nested fields", async () => {
  let fetched;
  const handler = adapter(
    {
      PLAYER_UPSTREAM_URL: "https://authorized.example",
      PLAYER_UPSTREAM_TOKEN: "fixture-token",
    },
    async (url, options) => {
      fetched = { url, options };
      return new Response(
        JSON.stringify({
          polarisId: "ABC",
          name: "Fixture",
          internal: "hidden",
          mainCharacterAndRank: {
            danRank: "Test rank",
            characterName: "Jin",
            secret: "hidden",
          },
          recentMatches: [
            { opponent: "Other", result: "win", privateData: "hidden" },
          ],
        }),
        { status: 200 },
      );
    },
  );
  const response = await handler(
    new Request("https://test/?action=profile&id=ABC"),
  );
  assert.equal(response.status, 200);
  assert.equal(fetched.url, "https://authorized.example/player-stats/ABC");
  assert.equal(fetched.options.headers.Authorization, "Bearer fixture-token");
  assert.equal(fetched.options.redirect, "error");
  const body = await response.json();
  assert.equal(body.internal, undefined);
  assert.equal(body.mainCharacterAndRank.secret, undefined);
  assert.equal(body.recentMatches[0].privateData, undefined);
  assert.ok(!JSON.stringify(body).includes("fixture-token"));
  const fail = adapter(
    { PLAYER_UPSTREAM_URL: "https://authorized.example" },
    async () => {
      throw Error("secret internal error");
    },
  );
  const error = await fail(new Request("https://test/?action=leaderboard"));
  assert.equal(error.status, 502);
  assert.ok(!(await error.text()).includes("secret internal"));
});
