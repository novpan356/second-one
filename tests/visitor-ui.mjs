// Supabase services here are explicit test fixtures. No live cloud is claimed.
import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { sortComments } from "../src/community/model.js";
const base = process.env.ATLAS_TEST_URL || "http://127.0.0.1:5173",
  cloud = process.env.ATLAS_CLOUD_TEST_URL || "http://127.0.0.1:5176";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const errors = [];
try {
  const local = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  local.on("pageerror", (e) => errors.push(e.message));
  await local.goto(base);
  await expect(local.locator(".card-community")).toHaveCount(41);
  await local.getByRole("button", { name: "赞 jin", exact: true }).click();
  await expect(
    local.getByRole("button", { name: "赞 jin", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const card = local
    .locator(".fighter-card")
    .filter({ has: local.locator('[data-character="jin"]') });
  await card.locator(".quick-comment input").fill("游客测试🥊");
  await card.locator('[type="submit"]').click();
  await expect(card.locator(".card-top-comment")).toContainText("游客测试🥊");
  await expect(local.getByRole("dialog")).toHaveCount(0);
  await card.locator(".card-top-comment").click();
  await expect(local.locator(".thread-preview")).toHaveText("游客测试🥊");
  await expect(local.locator(".visitor-thread details")).not.toHaveAttribute(
    "open",
    "",
  );
  await local.locator(".visitor-thread summary").click();
  await expect(local.locator(".thread-list p")).toHaveText("游客测试🥊");
  await local
    .getByRole("button", { name: "赞 游客测试🥊", exact: true })
    .click();
  await expect(local.locator(".visitor-thread summary small")).toContainText(
    "1",
  );
  await local.reload();
  await expect(local.locator(".thread-preview")).toHaveText("游客测试🥊");
  await local.setViewportSize({ width: 390, height: 844 });
  await local.locator(".visitor-thread summary").click();
  assert.ok(
    await local.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await local.screenshot({
    path: "/tmp/tekken-atlas-checks/visitor-mobile.png",
  });
  await local.goto(base);
  await local.screenshot({
    path: "/tmp/tekken-atlas-checks/visitor-home-mobile.png",
  });
  const comments = [],
    reactions = [],
    evaluations = [];
  let creates = 0;
  const summaries = () =>
    sortComments(
      comments.map((c) => ({
        ...c,
        likes: reactions.filter(
          (r) => r.comment_user_id === c.user_id && r.vote === 1,
        ).length,
        dislikes: reactions.filter(
          (r) => r.comment_user_id === c.user_id && r.vote === -1,
        ).length,
      })),
    );
  async function visitor(n) {
    const p = await browser.newPage({
      viewport: { width: 1440, height: 1000 },
      reducedMotion: "reduce",
    });
    p.on("pageerror", (e) => errors.push(e.message));
    const user = {
      id: `00000000-0000-4000-8000-00000000000${n}`,
      aud: "authenticated",
      role: "authenticated",
      is_anonymous: true,
      user_metadata: { display_name: "游客" },
      app_metadata: { provider: "anonymous" },
      created_at: new Date().toISOString(),
    };
    const token = [
      { alg: "HS256" },
      {
        sub: user.id,
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      { fixture: true },
    ]
      .map((x) => Buffer.from(JSON.stringify(x)).toString("base64url"))
      .join(".");
    await p.route("https://atlas-test.supabase.co/**", async (route) => {
      const req = route.request(),
        u = new URL(req.url()),
        body = req.postDataJSON(),
        method = req.method();
      const send = (data, status = 200) =>
        route.fulfill({
          status,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
          },
          body: JSON.stringify(data),
        });
      if (method === "OPTIONS")
        return route.fulfill({
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE",
          },
        });
      if (u.pathname.endsWith("/auth/v1/signup")) {
        assert.equal(body.email, undefined);
        assert.equal(body.password, undefined);
        creates++;
        return send({
          user,
          access_token: token,
          refresh_token: "fixture-refresh",
          token_type: "bearer",
          expires_in: 3600,
        });
      }
      if (u.pathname.endsWith("/auth/v1/user")) return send(user);
      if (u.pathname.endsWith("/rpc/top_character_comments"))
        return send(summaries().slice(0, 1));
      if (u.pathname.endsWith("/rpc/character_standings"))
        return send(
          evaluations.length
            ? [
                {
                  fighter_id: "jin",
                  likes: evaluations.filter((r) => r.vote === 1).length,
                  dislikes: evaluations.filter((r) => r.vote === -1).length,
                  average: null,
                  rating_count: 0,
                  star_sum: 0,
                },
              ]
            : [],
        );
      if (u.pathname.endsWith("/favorites")) return send([]);
      if (u.pathname.endsWith("/comment_summaries")) return send(summaries());
      if (method !== "GET")
        assert.ok(req.headers().authorization.includes(token));
      if (u.pathname.endsWith("/evaluations")) {
        if (method === "POST") {
          assert.equal(body.user_id, user.id);
          evaluations.push(body);
          return send(null);
        }
        return send(evaluations.filter((r) => r.user_id === user.id));
      }
      if (u.pathname.endsWith("/comments")) {
        if (method === "POST") {
          assert.equal(body.user_id, user.id);
          const old = comments.findIndex((r) => r.user_id === user.id);
          if (old >= 0) comments.splice(old, 1);
          comments.push({
            ...body,
            display_name: "游客",
            updated_at: new Date(Date.now() + n * 100).toISOString(),
          });
          return send(null);
        }
        return send(comments);
      }
      if (u.pathname.endsWith("/comment_reactions")) {
        if (method === "POST") {
          assert.equal(body.user_id, user.id);
          const index = reactions.findIndex(
            (r) =>
              r.user_id === body.user_id &&
              r.comment_user_id === body.comment_user_id,
          );
          if (index >= 0) reactions.splice(index, 1);
          reactions.push(body);
          return send(null);
        }
        return send(reactions.filter((r) => r.user_id === user.id));
      }
      return send({ error: "Unexpected fixture request" }, 500);
    });
    return p;
  }
  const a = await visitor(1),
    b = await visitor(2);
  for (const [page, text] of [
    [a, "留言一"],
    [b, "留言二"],
  ]) {
    await page.goto(cloud);
    const card = page
      .locator(".fighter-card")
      .filter({ has: page.locator('[data-character="jin"]') });
    await card.locator(".quick-comment input").fill(text);
    await card.locator('[type="submit"]').click();
    await expect(card.locator(".card-top-comment")).toContainText(text);
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  assert.equal(creates, 2);
  await a.goto(cloud + "/#fighter/jin/moves");
  await a.locator(".visitor-thread summary").click();
  await a.getByRole("button", { name: "赞 留言一", exact: true }).click();
  await expect(a.locator(".thread-preview")).toHaveText("留言一");
  await b.goto(cloud + "/#fighter/jin/moves");
  await b.locator(".visitor-thread summary").click();
  await b.getByRole("button", { name: "赞 留言二", exact: true }).click();
  await expect(b.locator(".thread-preview")).toHaveText("留言二");
  await a.reload();
  await expect(a.locator(".thread-preview")).toHaveText("留言二");
  await a.locator(".visitor-thread summary").click();
  await a.getByRole("button", { name: "踩 留言二", exact: true }).click();
  await expect(a.locator(".thread-preview")).toHaveText("留言一");
  await a.goto(cloud);
  await expect(
    a
      .locator(".fighter-card")
      .filter({ has: a.locator('[data-character="jin"]') })
      .locator(".card-top-comment"),
  ).toContainText("留言一");
  assert.equal(creates, 2);
  await a.screenshot({
    path: "/tmp/tekken-atlas-checks/visitor-cloud-fixture.png",
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: 41 homepage composers, no-login local publish/votes, persistent comments, collapsed top thread, mobile fit; MOCK two visitor sessions, comment upvotes/downvotes and highest-liked homepage updates, no duplicate visitor signup.",
  );
} finally {
  await browser.close();
}
