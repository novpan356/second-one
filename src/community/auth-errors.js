// Expose actionable error categories, not raw responses or credential values.
const messages = {
  zh: {
    nickname: "昵称需为 1–24 字。",
    validation: "提交字段未通过验证，请检查邮箱格式、昵称和密码要求。",
    server:
      "Supabase 认证服务返回内部错误，请在 Authentication 的日志中查看失败原因。",
    mailDelivery:
      "确认邮件发送失败，请检查 Supabase 的 SMTP 连接、发件人配置和 Auth 日志。",
    mailRestricted:
      "Supabase 邮件服务限制了此收件地址。站长需要在 Authentication → Email / SMTP Settings 配置自定义 SMTP；默认邮件服务可能仅允许发送给项目团队邮箱。",
    mailRate:
      "确认邮件发送过于频繁或已达到额度。请稍后重试；站长可检查 Auth 日志、邮件发送额度与 SMTP 设置。",
    signupDisabled:
      "Supabase 已关闭新用户注册。请在 Authentication → Sign In / Providers 开启 Allow new users to sign up。",
    emailDisabled:
      "Supabase 的 Email 登录未开启。请在 Authentication → Sign In / Providers → Email 开启。",
    weakPassword:
      "密码不符合项目的安全要求。请至少使用 8 位，并满足 Supabase 配置的复杂度要求。",
    invalidEmail: "邮箱格式或域名未被接受，请检查邮箱地址。",
    database:
      "Supabase 在保存用户时发生数据库错误。请查看 Auth 日志，检查 public.create_profile 触发器与 profiles 表是否已按最新 schema.sql 建立。",
    network:
      "无法连接 Supabase。请检查当前网络、项目地址和项目是否处于暂停状态。",
    credentials: "邮箱或密码不正确，请检查后重试。",
    unconfirmed: "邮箱尚未确认，请先打开确认邮件中的链接。",
    alreadyExists: "此邮箱已注册，请直接登录或使用忘记密码。",
    captcha:
      "项目要求 CAPTCHA，但当前页面未接入验证组件。请检查 Supabase 的 Auth Bot and Abuse Protection 设置。",
    apiKey:
      "Supabase 连接参数未获授权。请检查 Project URL 与 Publishable key 是否来自同一项目。",
    rate: "请求过于频繁，请稍后重试。",
    generic: "注册或登录失败，请将下方错误代码提供给站长排查。",
    check: "检查邮箱服务配置",
    checking: "检查中",
    connected: "已连接 Supabase",
    enabled: "邮箱注册开启",
    disabled: "邮箱注册关闭",
    confirm: "需要确认邮件",
    autoConfirm: "邮箱自动确认",
    unknown: "未提供此设置",
  },
  en: {
    nickname: "Use a display name of 1–24 characters.",
    validation:
      "Submitted fields failed validation. Check email, display name and password requirements.",
    server:
      "Supabase authentication returned a server error. Check Authentication logs for its cause.",
    mailDelivery:
      "Confirmation mail could not be sent. Check SMTP connection, sender settings and Auth logs.",
    mailRestricted:
      "The Supabase mail service does not allow this recipient. Configure custom SMTP under Authentication → Email / SMTP Settings; the default mail service may only deliver to project-team addresses.",
    mailRate:
      "Confirmation mail is rate-limited or its quota is exhausted. Try later and check Auth logs, email quotas and SMTP settings.",
    signupDisabled:
      "New user registration is disabled. Enable Allow new users to sign up under Authentication → Sign In / Providers.",
    emailDisabled:
      "The Email provider is disabled in Authentication → Sign In / Providers → Email.",
    weakPassword:
      "The password does not meet project requirements. Use at least 8 characters and the configured complexity.",
    invalidEmail:
      "The email address or domain was not accepted. Check the address.",
    database:
      "Supabase failed to save the user. Check Auth logs and the public.create_profile trigger and profiles table from schema.sql.",
    network:
      "Cannot connect to Supabase. Check your network, project URL and whether the project is paused.",
    credentials: "The email or password is incorrect.",
    unconfirmed: "Confirm the email address using the confirmation link first.",
    alreadyExists: "This email is registered. Sign in or reset the password.",
    captcha:
      "The project requires CAPTCHA but this page has no verification widget. Check Auth Bot and Abuse Protection settings.",
    apiKey:
      "Connection parameters were not authorized. Ensure Project URL and Publishable key belong to the same project.",
    rate: "Too many requests. Try again later.",
    generic:
      "Registration or sign-in failed. Share the error code below with the site administrator.",
    check: "Check email service settings",
    checking: "Checking",
    connected: "Connected to Supabase",
    enabled: "Email registration enabled",
    disabled: "Email registration disabled",
    confirm: "Confirmation email required",
    autoConfirm: "Email auto-confirmed",
    unknown: "Setting not supplied",
  },
  ja: {
    nickname: "表示名は1〜24文字です。",
    validation:
      "入力の検証に失敗しました。メール、表示名、パスワードの要件を確認してください。",
    server:
      "Supabase認証サービスの内部エラーです。Authenticationのログを確認してください。",
    mailDelivery:
      "確認メールを送信できません。SMTP接続、送信者設定とAuthログを確認してください。",
    mailRestricted:
      "Supabaseのメールサービスがこの宛先を許可していません。Authentication → Email / SMTP SettingsでSMTPを設定してください。標準メールはチームのアドレスだけに届く場合があります。",
    mailRate:
      "確認メールの送信制限または上限に達しました。時間を置き、AuthログとSMTP設定を確認してください。",
    signupDisabled:
      "新規登録が無効です。Authentication → Sign In / ProvidersでAllow new users to sign upを有効にしてください。",
    emailDisabled:
      "Authentication → Sign In / Providers → Emailでメール認証を有効にしてください。",
    weakPassword:
      "パスワードが要件を満たしません。8文字以上と設定された複雑さが必要です。",
    invalidEmail: "メール形式またはドメインが認められませんでした。",
    database:
      "ユーザー保存時にデータベースエラーが発生しました。Authログ、public.create_profileトリガーとprofilesテーブルを確認してください。",
    network:
      "Supabaseに接続できません。ネットワーク、プロジェクトURLと一時停止状態を確認してください。",
    credentials: "メールまたはパスワードが正しくありません。",
    unconfirmed: "確認メールのリンクで認証してください。",
    alreadyExists:
      "登録済みのメールです。ログインまたはパスワード再設定をしてください。",
    captcha:
      "CAPTCHAが必要ですがページに認証ウィジェットがありません。Auth Bot and Abuse Protection設定を確認してください。",
    apiKey:
      "接続設定が認証されませんでした。URLとPublishable keyが同じプロジェクトのものか確認してください。",
    rate: "リクエストが多すぎます。しばらくお待ちください。",
    generic:
      "登録またはログインに失敗しました。以下のエラーコードを管理者に伝えてください。",
    check: "メールサービス設定を確認",
    checking: "確認中",
    connected: "Supabaseに接続済み",
    enabled: "メール登録が有効",
    disabled: "メール登録が無効",
    confirm: "確認メールが必要",
    autoConfirm: "メールを自動確認",
    unknown: "設定の情報なし",
  },
};
const codeMap = {
  email_address_not_authorized: "mailRestricted",
  over_email_send_rate_limit: "mailRate",
  email_provider_disabled: "emailDisabled",
  signup_disabled: "signupDisabled",
  weak_password: "weakPassword",
  email_address_invalid: "invalidEmail",
  validation_failed: "validation",
  invalid_credentials: "credentials",
  email_not_confirmed: "unconfirmed",
  user_already_exists: "alreadyExists",
  email_exists: "alreadyExists",
  captcha_failed: "captcha",
  over_request_rate_limit: "rate",
};
export function authErrorInfo(error) {
  const code =
    typeof error?.code === "string" && /^[a-z0-9_]{1,64}$/.test(error.code)
      ? error.code
      : null;
  const status =
    Number.isInteger(error?.status) &&
    error.status >= 400 &&
    error.status <= 599
      ? error.status
      : null;
  const text = String(error?.message || "");
  let key = codeMap[code];
  if (!key) {
    if (text === "nickname") key = "nickname";
    else if (
      /database error (saving|updating|creating) (new )?user/i.test(text)
    )
      key = "database";
    else if (/not authorized.*email|email.*not authorized/i.test(text))
      key = "mailRestricted";
    else if (/sending confirmation email|send confirmation email/i.test(text))
      key = "mailDelivery";
    else if (/email.*rate.?limit|rate.?limit.*email/i.test(text))
      key = "mailRate";
    else if (
      /signups? (are )?not allowed|signup.*disabled|new user.*disabled/i.test(
        text,
      )
    )
      key = "signupDisabled";
    else if (/email.*(not enabled|disabled)/i.test(text)) key = "emailDisabled";
    else if (/invalid login credentials/i.test(text)) key = "credentials";
    else if (/email not confirmed/i.test(text)) key = "unconfirmed";
    else if (/user already registered/i.test(text)) key = "alreadyExists";
    else if (/captcha.*(failed|required)/i.test(text)) key = "captcha";
    else if (error?.name === "AuthWeakPasswordError") key = "weakPassword";
    else if (status >= 500) key = "server";
    else if (
      error?.name === "AuthRetryableFetchError" ||
      error?.name === "TimeoutError" ||
      error?.name === "AbortError" ||
      /failed to fetch|fetch failed|network|load failed/i.test(text)
    )
      key = "network";
    else if (status === 401 || /invalid api key/i.test(text)) key = "apiKey";
    else if (status === 429) key = "rate";
    else key = "generic";
  }
  return { key, code, status };
}
export function formatAuthError(error, lang) {
  const info = authErrorInfo(error),
    detail = [info.status && `HTTP ${info.status}`, info.code]
      .filter(Boolean)
      .join(" · ");
  return messages[lang][info.key] + (detail ? ` [${detail}]` : "");
}
export const authCopy = messages;
export function summarizeAuthSettings(data, lang) {
  const c = messages[lang],
    email =
      typeof data?.external?.email === "boolean" ? data.external.email : null,
    disabled =
      typeof data?.disable_signup === "boolean" ? data.disable_signup : null,
    confirm =
      typeof data?.mailer_autoconfirm === "boolean"
        ? !data.mailer_autoconfirm
        : null;
  return [
    c.connected,
    email === false || disabled === true
      ? c.disabled
      : email === true && disabled === false
        ? c.enabled
        : c.unknown,
    confirm === null ? c.unknown : confirm ? c.confirm : c.autoConfirm,
  ].join(" · ");
}
