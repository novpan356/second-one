import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const base = (process.env.ATLAS_TEST_URL || "http://127.0.0.1:5173").replace(
  /\/+$/,
  "",
);
await mkdir("/tmp/tekken-atlas-checks", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const errors = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/");
  await expect(page.locator(".home-story-feature")).toHaveCSS(
    "display",
    "grid",
  );
  await page.setViewportSize({ width: 700, height: 900 });
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeVisible();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/#fighter/jin/story");
  await page.locator(".relationship-tree").waitFor();
  await expect(page.locator(".story-reader-header h2")).toHaveText("风间仁");
  await expect(page.locator(".biography-chapters > section")).toHaveCount(3);
  await page
    .locator(".relationship-tree")
    .getByRole("button", {
      name: "阅读故事 三岛一八 · 父亲 / 对立",
      exact: true,
    })
    .click();
  await expect(page.locator(".story-reader-header h2")).toHaveText("三岛一八");
  assert.ok(
    (await page.locator(".biography-chapters").textContent()).includes("火山"),
  );
  await page
    .getByRole("button", { name: "将此人物设为树的中心", exact: true })
    .click();
  await expect(page.locator(".relation-root b")).toHaveText("三岛一八");
  await page
    .getByRole("button", { name: "回到本角色故事", exact: true })
    .click();
  await expect(page.locator(".relation-root b")).toHaveText("风间仁");
  await page
    .locator(".relationship-tree")
    .getByRole("button", { name: /阅读故事 斗神（Ogre）/ })
    .click();
  await expect(page.locator(".story-reader-header h2")).toHaveText(
    "斗神（Ogre）",
  );
  assert.ok(
    (await page.locator(".biography-chapters").textContent()).includes(
      "保罗击败第一形态",
    ),
  );
  await page
    .getByRole("button", { name: "回到本角色故事", exact: true })
    .click();
  await page
    .locator(".relationship-section")
    .screenshot({ path: "/tmp/tekken-atlas-checks/relationships.png" });
  await page
    .locator(".site-header nav")
    .getByRole("button", { name: "剧情档案", exact: true })
    .click();
  await page.locator(".story-archive").waitFor();
  await expect(page.locator(".story-timeline > .story-arc")).toHaveCount(6);
  assert.ok(
    (await page.locator(".story-timeline").textContent()).includes(
      "另一可触发结局",
    ),
  );
  await page.getByRole("button", { name: "历代主线", exact: true }).click();
  await expect(page.locator(".story-timeline > .story-arc")).toHaveCount(7);
  await page.screenshot({
    path: "/tmp/tekken-atlas-checks/story-archive.png",
    fullPage: false,
  });
  await page.getByRole("button", { name: "支线与客串", exact: true }).click();
  await expect(page.locator(".story-timeline > .story-arc")).toHaveCount(3);
  await page.getByRole("button", { name: "人物索引", exact: true }).click();
  await expect(page.locator(".story-person-card")).toHaveCount(69);
  await page.getByPlaceholder("搜索角色、配角或组织").fill("波斯科诺维奇");
  await expect(page.locator(".story-person-card")).toHaveCount(1);
  await page.locator(".story-person-card").click();
  await page.locator(".story-reader-header h2").waitFor();
  await expect(page.locator(".story-reader-header h2")).toHaveText(
    "波斯科诺维奇博士",
  );
  assert.ok(page.url().includes("#story/person/bosconovitch"));
  await page.reload();
  await page.locator(".story-reader").waitFor();
  await expect(page.locator(".story-reader-header h2")).toHaveText(
    "波斯科诺维奇博士",
  );
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator(".story-reader-header h2")).toHaveText(
    "Dr. Bosconovitch",
  );
  assert.ok(
    (await page.locator(".biography-chapters").textContent()).includes(
      "master control",
    ),
  );
  await page.getByRole("button", { name: "JP", exact: true }).click();
  await expect(page.locator(".story-reader-header h2")).toHaveText(
    "Dr.ボスコノビッチ",
  );
  await page.goto(base + "/#story/person/__proto__");
  await page.locator(".story-timeline").waitFor();
  await expect(page.locator(".story-timeline > .story-arc")).toHaveCount(6);
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto(base + "/#fighter/jin/story");
  await mobile.locator(".relationship-tree").waitFor();
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await mobile
    .locator(".relationship-tree")
    .getByRole("button", { name: "阅读故事 风间准 · 母亲", exact: true })
    .click();
  await expect(mobile.locator(".story-reader-header h2")).toHaveText("风间准");
  await mobile.waitForFunction(
    () =>
      document.querySelector(".story-reader-header").getBoundingClientRect()
        .top < innerHeight,
  );
  await mobile.screenshot({
    path: "/tmp/tekken-atlas-checks/story-mobile.png",
    fullPage: false,
  });
  await mobile.goto(base + "/#story/people");
  await mobile.locator(".story-person-card").first().waitFor();
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await mobile.getByRole("button", { name: "Menu", exact: true }).click();
  await mobile
    .locator(".site-header nav")
    .getByRole("button", { name: "剧情档案", exact: true })
    .click();
  await mobile.locator(".story-timeline").waitFor();
  await expect(mobile.locator(".story-timeline > .story-arc")).toHaveCount(6);
  await mobile.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: relationship direction, related-person reading and rerooting, supporting dossiers, main/history/extra stories, 69-person search, deep-link refresh, three languages, safe unknown routes, mobile tree and reading visibility; no browser errors.",
  );
} finally {
  await browser.close();
}
