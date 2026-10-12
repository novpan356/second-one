// Deterministic auth error fixtures: no real signup or confirmation emails.
import { chromium, expect } from "@playwright/test";
const base = process.env.ATLAS_AUTH_TEST_URL || "http://127.0.0.1:5176";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
try {
  const p = await browser.newPage({ reducedMotion: "reduce" });
  let failure = {
      code: "email_address_not_authorized",
      msg: "Email address not authorized",
    },
    status = 400,
    posts = 0;
  await p.route("https://atlas-test.supabase.co/**", async (route) => {
    const req = route.request(),
      url = new URL(req.url());
    const send = (data, s = 200) =>
      route.fulfill({
        status: s,
        headers: {
          "content-type": "application/json",
          "x-supabase-api-version": "2024-01-01",
          "access-control-expose-headers": "x-supabase-api-version",
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
        },
        body: JSON.stringify(data),
      });
    if (req.method() === "OPTIONS")
      return route.fulfill({
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-headers": "*",
          "access-control-allow-methods": "GET,POST",
        },
      });
    if (url.pathname.endsWith("/auth/v1/settings"))
      return send({
        external: { email: true },
        disable_signup: false,
        mailer_autoconfirm: false,
      });
    if (url.pathname.endsWith("/auth/v1/signup")) {
      posts++;
      const form = req.postDataJSON();
      if (
        form.email !== "test@example.invalid" ||
        form.data.display_name !== "Test Fighter"
      )
        throw Error("Form fields were displaced");
      return send(failure, status);
    }
    return send([]);
  });
  await p.goto(base);
  await p.locator(".account-button").click();
  await p.locator('.auth-form [name="email"]').fill("test@example.invalid");
  await p.locator('.auth-form [name="password"]').fill("test-only-password");
  await p
    .locator(".community-tabs")
    .getByRole("button", { name: "注册", exact: true })
    .click();
  await expect(p.locator('.auth-form [name="email"]')).toHaveValue(
    "test@example.invalid",
  );
  await expect(p.locator('.auth-form [name="nickname"]')).toHaveValue("");
  await p.locator('.auth-form [name="nickname"]').fill("Test Fighter");
  await p.locator('.auth-form [type="submit"]').click();
  await expect(
    p.locator(
      ".auth-form>.community-message,.auth-form form>.community-message",
    ),
  ).toContainText("email_address_not_authorized");
  await expect(p.locator(".auth-form form>.community-message")).toContainText(
    "SMTP",
  );
  failure = { code: "over_email_send_rate_limit", msg: "Too many emails" };
  status = 429;
  await p.locator('.auth-form [type="submit"]').click();
  await expect(p.locator(".auth-form form>.community-message")).toContainText(
    "HTTP 429",
  );
  failure = {
    code: "unexpected_failure",
    msg: "Database error saving new user",
  };
  status = 500;
  await p.locator('.auth-form [type="submit"]').click();
  await expect(p.locator(".auth-form form>.community-message")).toContainText(
    "create_profile",
  );
  await p
    .getByRole("button", { name: "检查邮箱服务配置", exact: true })
    .click();
  await expect(p.locator(".auth-diagnostics p")).toContainText(
    "已连接 Supabase",
  );
  await expect(p.locator(".auth-diagnostics p")).toContainText("邮箱注册开启");
  await p.locator('.auth-form [name="nickname"]').fill("长".repeat(25));
  await p.locator('.auth-form [type="submit"]').click();
  await expect(p.locator(".auth-form form>.community-message")).toContainText(
    "1–24",
  );
  if (posts !== 3) throw Error("Invalid nickname reached the server");
  console.log(
    "PASS: preserves email/password when switching modes, surfaces actual SMTP/quota/database codes, reads auth settings, validates nickname; all auth requests mocked, no email sent.",
  );
} finally {
  await browser.close();
}
