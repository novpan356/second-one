// Cloud requests below are deterministic TEST FIXTURES, not live Supabase/EWGF data.
import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const guestBase = (
  process.env.ATLAS_TEST_URL || "http://127.0.0.1:5173"
).replace(/\/$/, "");
const cloudBase = process.env.ATLAS_CLOUD_TEST_URL || "http://127.0.0.1:5176";
await mkdir("/tmp/tekken-atlas-checks", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const errors = [];
try {
  const guest = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  guest.on("pageerror", (e) => errors.push(e.message));
  await guest.goto(guestBase);
  await guest.locator(".community-standings").scrollIntoViewIfNeeded();
  await expect(guest.locator(".community-standings ol li")).toHaveCount(0);
  await guest.screenshot({
    path: "/tmp/tekken-atlas-checks/community-home.png",
  });
  await guest.locator(".account-button").click();
  await expect(guest.getByRole("dialog")).toBeVisible();
  await expect(guest.locator('.auth-form [type="submit"]')).toBeDisabled();
  await guest.screenshot({
    path: "/tmp/tekken-atlas-checks/community-login.png",
  });
  await guest.keyboard.press("Escape");
  await guest.goto(guestBase + "/#fighter/jin/moves");
  await guest.locator(".move-name").first().click();
  await guest.locator(".move-save-button").click();
  await expect(guest.locator(".move-save-button")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await guest.keyboard.press("Escape");
  await guest.goto(guestBase + "/#account");
  await expect(guest.locator(".saved-move")).toHaveCount(1);
  await guest.reload();
  await expect(guest.locator(".saved-move")).toHaveCount(1);
  await guest.locator(".saved-move .favorite-open").click();
  await expect(guest.getByRole("dialog")).toBeVisible();
  await expect(guest.locator(".modal-move-title")).not.toHaveText("");
  await guest.keyboard.press("Escape");
  await guest.goto(guestBase + "/#online");
  await expect(guest.locator("#online-query")).toBeVisible();
  await guest.locator("#online-query").fill("ABC-DE12");
  await expect(guest.locator('.online-search [type="submit"]')).toBeDisabled();
  await expect(
    guest.getByRole("link", { name: "打开 EWGF 玩家档案" }),
  ).toHaveAttribute("href", "https://www.ewgf.gg/player/ABC-DE12");
  await guest.screenshot({
    path: "/tmp/tekken-atlas-checks/community-online.png",
  });
  await guest.setViewportSize({ width: 390, height: 844 });
  assert.ok(
    await guest.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await guest.goto(guestBase + "/#fighter/jin/story");
  await guest.locator(".fighter-community").scrollIntoViewIfNeeded();
  await guest.screenshot({
    path: "/tmp/tekken-atlas-checks/community-mobile.png",
  });
  assert.ok(
    await guest.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await guest.close();
  const user = {
    id: "00000000-0000-4000-8000-000000000001",
    aud: "authenticated",
    role: "authenticated",
    email: "test@example.invalid",
    email_confirmed_at: new Date().toISOString(),
    user_metadata: { display_name: "Test Fighter" },
    app_metadata: { provider: "email" },
    created_at: new Date().toISOString(),
  };
  const jwt = [
    { alg: "HS256", typ: "JWT" },
    {
      sub: user.id,
      role: "authenticated",
      exp: Math.floor(Date.now() / 1000) + 3600,
    },
    { test: true },
  ]
    .map((x) => Buffer.from(JSON.stringify(x)).toString("base64url"))
    .join(".");
  const favorites = [],
    comments = [];
  const reactions = [];
  let evaluation = null;
  let playerFailure = false;
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("https://atlas-test.supabase.co/**", async (route) => {
    const req = route.request(),
      u = new URL(req.url()),
      body = req.postDataJSON(),
      method = req.method();
    const send = (data, status = 200) =>
      route.fulfill({
        status,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
        },
        body: JSON.stringify(data),
      });
    if (method === "OPTIONS")
      return route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "GET,POST,PATCH,DELETE",
        },
      });
    if (u.pathname.endsWith("/auth/v1/token"))
      return send({
        access_token: jwt,
        refresh_token: "test-refresh",
        token_type: "bearer",
        expires_in: 3600,
        user,
      });
    if (u.pathname.endsWith("/auth/v1/user")) return send(user);
    if (u.pathname.endsWith("/auth/v1/signup"))
      return send({ user, session: null });
    if (u.pathname.includes("/auth/v1/")) return send({});
    if (u.pathname.endsWith("/functions/v1/player-data")) {
      if (playerFailure)
        return send({ error: "Test upstream unavailable" }, 502);
      if (u.searchParams.get("action") === "profile")
        return send({
          polarisId: "FIXTURE-ID",
          playerName: "Fixture Player",
          rankPoints: 1234,
          ranking: 8,
          tekkenPower: 456,
          totalMatches: 10,
          winRate: 70,
          recentMatches: [
            {
              opponent: "Fixture Opponent",
              character: "Jin",
              result: "win",
              date: "2026-01-01",
            },
          ],
        });
      return send([
        {
          polarisId: "FIXTURE-ID",
          playerName: "Fixture Player",
          score: 1234,
          ranking: 8,
        },
      ]);
    }
    if (
      u.pathname.endsWith("/rpc/top_character_comments") ||
      u.pathname.endsWith("/comment_summaries")
    )
      return send(
        comments.map((r) => ({
          ...r,
          display_name: r.profiles?.display_name,
          likes: 0,
          dislikes: 0,
        })),
      );
    if (u.pathname.endsWith("/comment_reactions")) return send(reactions);
    if (u.pathname.endsWith("/rpc/character_standings"))
      return send(
        evaluation
          ? [
              {
                fighter_id: "jin",
                likes: evaluation.vote === 1 ? 1 : 0,
                dislikes: evaluation.vote === -1 ? 1 : 0,
                average: evaluation.stars,
                rating_count: evaluation.stars === null ? 0 : 1,
                star_sum: evaluation.stars || 0,
              },
            ]
          : [],
      );
    if (method !== "GET") assert.ok(req.headers().authorization.includes(jwt));
    if (u.pathname.endsWith("/favorites")) {
      if (method === "POST") {
        const records = Array.isArray(body) ? body : [body];
        for (const r of records) {
          assert.equal(r.user_id, user.id);
          const old = favorites.findIndex(
            (x) => x.kind === r.kind && x.target === r.target,
          );
          if (old >= 0) favorites.splice(old, 1);
          favorites.push(r);
        }
        return send(null);
      }
      if (method === "DELETE") {
        const target = u.searchParams.get("target")?.slice(3);
        const index = favorites.findIndex((x) => x.target === target);
        if (index >= 0) favorites.splice(index, 1);
        return send(null);
      }
      return send(favorites);
    }
    if (u.pathname.endsWith("/evaluations")) {
      if (method === "POST") {
        assert.equal(body.user_id, user.id);
        evaluation = body;
        return send(null);
      }
      if (method === "DELETE") {
        evaluation = null;
        return send(null);
      }
      return send(evaluation ? [evaluation] : []);
    }
    if (u.pathname.endsWith("/comments")) {
      if (method === "POST") {
        assert.equal(body.user_id, user.id);
        assert.ok(Array.from(body.content).length <= 15);
        comments.splice(0, comments.length, {
          ...body,
          updated_at: new Date().toISOString(),
          profiles: { display_name: "Test Fighter" },
        });
        return send(null);
      }
      if (method === "DELETE") {
        comments.splice(0);
        return send(null);
      }
      return send(comments);
    }
    return send({ error: "Unexpected test request" }, 500);
  });
  await page.goto(cloudBase);
  await page.locator(".account-button").click();
  await page
    .locator(".community-tabs")
    .getByRole("button", { name: "注册", exact: true })
    .click();
  await page.locator('.auth-form [name="nickname"]').fill("Test Fighter");
  await page.locator('.auth-form [name="email"]').fill("test@example.invalid");
  await page.locator('.auth-form [name="password"]').fill("test-only-password");
  await page.locator('.auth-form [type="submit"]').click();
  await expect(page.locator(".community-message")).toContainText(
    "查收确认邮件",
  );
  await expect(page.locator(".account-button")).toHaveAttribute(
    "aria-label",
    "登录",
  );
  await page.getByRole("button", { name: "忘记密码", exact: true }).click();
  await page.locator('.auth-form [type="submit"]').click();
  await expect(page.locator(".community-message")).toContainText("重置邮件");
  await page
    .locator(".community-tabs")
    .getByRole("button", { name: "登录", exact: true })
    .click();
  await page.locator('.auth-form [name="email"]').fill("test@example.invalid");
  await page.locator('.auth-form [name="password"]').fill("test-only-password");
  await page.locator('.auth-form [type="submit"]').click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".account-button")).toHaveAttribute(
    "aria-label",
    "我的账户",
  );
  await page
    .getByRole("button", { name: "收藏角色 风间仁", exact: true })
    .click();
  await page.goto(cloudBase + "/#fighter/jin/moves");
  await page.locator(".move-name").first().click();
  await page.locator(".move-save-button").click();
  await expect(page.locator(".move-save-button")).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.keyboard.press("Escape");
  await page.locator(".vote-buttons button").first().click();
  await expect(page.locator(".vote-buttons button").first()).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByRole("button", { name: "5 / 5", exact: true }).click();
  await expect(page.locator(".community-average")).toHaveText("5.00 / 5");
  await page.locator(".visitor-thread summary").click();
  await page.locator(".thread-body .quick-comment input").fill("🥊".repeat(16));
  await expect(
    page.locator('.thread-body .quick-comment [type="submit"]'),
  ).toBeDisabled();
  await page.locator(".thread-body .quick-comment input").fill("很棒🥊");
  await page.locator('.thread-body .quick-comment [type="submit"]').click();
  await expect(page.locator(".thread-list p")).toHaveText("很棒🥊");
  await page.screenshot({
    path: "/tmp/tekken-atlas-checks/community-cloud-fixture.png",
  });
  await page.goto(cloudBase + "/#account");
  await expect(page.locator(".favorite-card:not(.saved-move)")).toHaveCount(1);
  await expect(page.locator(".saved-move")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".saved-move")).toHaveCount(1);
  await page.goto(cloudBase);
  await expect(page.locator(".community-standings li")).toHaveCount(1);
  await expect(page.locator(".standing-overall b")).toHaveText("5.00 / 5");
  await page.goto(cloudBase + "/#online");
  await page.locator("#online-query").fill("Fixture");
  await page.locator('.online-search [type="submit"]').click();
  await page.getByRole("button", { name: "Fixture Player" }).click();
  await expect(page.locator(".online-profile h2")).toHaveText("Fixture Player");
  await expect(page.locator(".online-table .match-win")).toHaveText("W");
  playerFailure = true;
  await page.locator('.online-search [type="submit"]').click();
  await expect(page.locator(".online-page .community-error")).toBeVisible();
  await expect(page.locator(".online-profile")).toHaveCount(0);
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator(".online-hero h1")).toHaveText("Online players");
  await page.getByRole("button", { name: "JP", exact: true }).click();
  await expect(page.locator(".online-hero h1")).toHaveText(
    "オンラインプレイヤー",
  );
  await page.goto(cloudBase + "/#account");
  await page.getByRole("button", { name: "ログアウト", exact: true }).click();
  await expect(page.locator(".account-button")).toHaveAttribute(
    "aria-label",
    "ログイン",
  );
  await expect(page.locator(".saved-move")).toHaveCount(0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: real unconfigured guest mode and local move favorites; MOCK cloud SDK login, owned favorites, comments and voting, aggregates, refresh persistence, logout isolation, player adapter and languages. No browser errors. Cloud and EWGF live services are NOT tested.",
  );
} finally {
  await browser.close();
}
