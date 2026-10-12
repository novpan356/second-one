import test from "node:test";
import assert from "node:assert/strict";
import {
  authErrorInfo,
  formatAuthError,
  summarizeAuthSettings,
  authCopy,
} from "../src/community/auth-errors.js";
test("registration distinguishes SMTP recipient restriction, email quota and disabled providers", () => {
  assert.equal(
    authErrorInfo({ code: "email_address_not_authorized", status: 400 }).key,
    "mailRestricted",
  );
  assert.match(
    formatAuthError(
      { code: "email_address_not_authorized", status: 400 },
      "zh",
    ),
    /SMTP.*HTTP 400.*email_address_not_authorized/,
  );
  assert.equal(
    authErrorInfo({ code: "over_email_send_rate_limit", status: 429 }).key,
    "mailRate",
  );
  assert.equal(
    authErrorInfo({ code: "email_provider_disabled", status: 400 }).key,
    "emailDisabled",
  );
  assert.equal(
    authErrorInfo({ code: "signup_disabled", status: 403 }).key,
    "signupDisabled",
  );
});
test("database failures, weak passwords, nickname validation and network failure are actionable", () => {
  assert.equal(
    authErrorInfo({
      code: "unexpected_failure",
      status: 500,
      message: "Database error saving new user",
    }).key,
    "database",
  );
  assert.equal(
    authErrorInfo({ code: "weak_password", status: 422 }).key,
    "weakPassword",
  );
  assert.equal(authErrorInfo(Error("nickname")).key, "nickname");
  assert.equal(authErrorInfo(new TypeError("Failed to fetch")).key, "network");
  assert.equal(
    authErrorInfo({ status: 401, message: "Invalid API key" }).key,
    "apiKey",
  );
});
test("unknown errors do not echo raw response details or credentials", () => {
  const text = formatAuthError(
    {
      code: "unknown_error",
      status: 500,
      message: "Private token example-secret and email person@example.invalid",
    },
    "zh",
  );
  assert.ok(!text.includes("example-secret"));
  assert.ok(!text.includes("person@example.invalid"));
  assert.ok(text.includes("unknown_error"));
  assert.equal(authErrorInfo({ code: "<script>alert(1)</script>" }).code, null);
});
test("public auth settings do not assume missing fields are enabled", () => {
  assert.match(
    summarizeAuthSettings(
      {
        external: { email: true },
        disable_signup: false,
        mailer_autoconfirm: false,
      },
      "zh",
    ),
    /注册开启.*确认邮件/,
  );
  assert.match(
    summarizeAuthSettings(
      { external: { email: false }, disable_signup: false },
      "zh",
    ),
    /注册关闭/,
  );
  assert.match(summarizeAuthSettings({}, "zh"), /未提供/);
  for (const lang of ["en", "ja"])
    assert.deepEqual(Object.keys(authCopy[lang]), Object.keys(authCopy.zh));
});

test("legacy code-less responses distinguish bad passwords from invalid API keys", () => {
  assert.equal(
    authErrorInfo({ status: 401, message: "Invalid login credentials" }).key,
    "credentials",
  );
  assert.equal(
    authErrorInfo({ status: 429, message: "Email rate limit exceeded" }).key,
    "mailRate",
  );
  assert.equal(
    authErrorInfo({
      status: 400,
      message: "Signups not allowed for this instance",
    }).key,
    "signupDisabled",
  );
  assert.equal(
    authErrorInfo({
      name: "AuthRetryableFetchError",
      status: 503,
      message: "Service unavailable",
    }).key,
    "server",
  );
});
