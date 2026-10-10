import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
await mkdir("/tmp/tekken-atlas-checks", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.ATLAS_TEST_URL || "http://127.0.0.1:5173";
try {
  await page.goto(base);
  await page.locator(".fighter-card").first().waitFor();
  assert.equal(await page.locator(".fighter-card").count(), 12);
  await page.screenshot({
    path: "/tmp/tekken-atlas-checks/home.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "EN", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("lang"), "en");
  await page.getByPlaceholder("Search fighter, country or style").fill("Jin");
  assert.equal(await page.locator(".fighter-card").count(), 2);
  await page.getByPlaceholder("Search fighter, country or style").fill("");
  await page.getByRole("button", { name: "Season 2 DLC", exact: true }).click();
  assert.equal(await page.locator(".fighter-card").count(), 4);
  await page
    .getByRole("button", { name: "All fighters", exact: true })
    .first()
    .click();
  await page
    .getByRole("button", { name: "Save fighter Jin Kazama", exact: true })
    .click();
  await page.reload();
  await page.locator(".fighter-card").first().waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Unsave fighter Jin Kazama", exact: true })
      .getAttribute("aria-pressed"),
    "true",
  );
  await page.goto(base + "/#fighter/jin/moves");
  await page.locator(".move-table tbody tr").first().waitFor();
  await page.getByPlaceholder("Search move, input or property").fill("df+1");
  assert.ok((await page.locator(".move-table tbody tr").count()) > 0);
  await page.locator(".move-name").first().click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page.getByRole("tab", { name: "Combos", exact: true }).click();
  await page.locator(".combo-card").first().waitFor();
  assert.ok((await page.locator(".combo-card").count()) > 0);
  await page.getByRole("tab", { name: "Punishment", exact: true }).click();
  await page.locator(".punish-controls").waitFor();
  assert.ok((await page.locator(".move-table tbody tr").count()) > 0);
  await page.getByLabel("Opponent disadvantage").fill("15");
  await page
    .getByRole("button", { name: "While standing", exact: true })
    .click();
  assert.ok((await page.locator(".move-table tbody tr").count()) > 0);
  await page.getByRole("tab", { name: "Sidestep", exact: true }).click();
  await page.locator(".sidestep-cards").waitFor();
  await page.getByRole("tab", { name: "Profile", exact: true }).click();
  await page.getByText("Jin’s mother", { exact: false }).count();
  await page.locator(".profile-story").waitFor();
  await page.getByRole("button", { name: "JP", exact: true }).click();
  assert.equal(await page.locator("html").getAttribute("lang"), "ja");
  assert.ok(
    (await page.locator(".fighter-hero h1").textContent()).includes("風間仁"),
  );
  await page.goto(base + "/#updates");
  await page.locator(".timeline-card").first().waitFor();
  assert.equal(await page.locator(".timeline-card").count(), 3);
  await page.goto(base + "/#players");
  await page.locator(".player-card").first().waitFor();
  await page.getByPlaceholder("選手・キャラクターを検索").fill("Knee");
  assert.equal(await page.locator(".player-card").count(), 1);
  await page.locator(".player-card").click();
  await page.getByRole("dialog").waitFor();
  await page.getByRole("button", { name: "閉じる", exact: true }).click();
  await page.goto(base + "/#fighter/jin/moves");
  await page.locator(".move-table").waitFor();
  await page.screenshot({
    path: "/tmp/tekken-atlas-checks/fighter.png",
    fullPage: true,
  });
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  mobile.on("pageerror", (e) => errors.push(e.message));
  await mobile.goto(base);
  await mobile.locator(".fighter-card").first().waitFor();
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await mobile.screenshot({
    path: "/tmp/tekken-atlas-checks/mobile.png",
    fullPage: true,
  });
  await mobile.getByRole("button", { name: "Menu", exact: true }).click();
  await mobile
    .locator(".site-header nav")
    .getByRole("button", { name: "战斗实验室", exact: true })
    .click();
  await mobile.locator(".lab-select-card").waitFor();
  await mobile.goto(base + "/#fighter/jin/moves");
  await mobile.locator(".move-table tbody tr").first().waitFor();
  assert.ok(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  await mobile.locator(".move-name").first().click();
  await mobile.getByRole("dialog").waitFor();
  await mobile.keyboard.press("Escape");
  await mobile.close();
  assert.deepEqual(errors, []);
  console.log(
    "PASS: desktop and mobile navigation, three languages, DLC filtering, search, favorite persistence, move details, combos, punishment, sidestep, player modal, update timeline and overflow; no browser errors.",
  );
} finally {
  await browser.close();
}
