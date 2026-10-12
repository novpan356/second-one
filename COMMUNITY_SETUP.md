# 游客留言与角色评价配置

最新版本无需填写账户即可在主页头像下赞踩和发表 15 字留言。角色详情顶部的「角色热评」点击可展开，对每条留言赞踩。公共留言在可见页面每 30 秒自动刷新。主页展示该角色赞数最高的留言；同赞数时踩少者优先，再按更新时间排序。

**当前未连接 Supabase 时，留言和评价可在本浏览器使用并保存，但其他访客不可见。** 要共享公共留言，请按下面步骤创建项目并运行完整 SQL。已运行旧版本 SQL 的项目，重新运行最新 `supabase/schema.sql` 即可追加留言反应表和热评视图，保留现有数据。

在 **Authentication → Sign In / Providers → Anonymous Sign-Ins** 开启匿名登录（Allow anonymous sign-ins）。访客首次发表或投票时，应用自动建立游客会话，无需邮箱、密码或登录表单。不要关闭数据库行级权限，也不要把写权限直接授予未验证身份的 `anon` 角色；游客会话由 Supabase 签发并仍受所有者权限限制。匿名登录未开启时，发表会显示失败，而不会假装公开成功。

一个游客会话每位角色保留一条可修改的留言，每条留言一份可切换的赞踩。清除浏览器数据或换设备会形成新的游客身份，不是全站唯一自然人身份。

# 创建和连接 Supabase 项目

网站目前仍由 GitHub Pages 托管。前端已经接入 Supabase 的真实账户和数据库接口；在你创建 Supabase 项目并配置之前，它显示本机访客模式，允许本机留言和评价，不会伪造公共共享或实时战绩。本机可以收藏角色和招式，账户页为 `#account`，招式详情弹窗中有收藏按钮。

## 1. 创建免费的 Supabase 项目

1. 打开 https://supabase.com/dashboard ，使用你的账户登录。
2. 点击 **New project**，选择组织，输入项目名称（例如 `tekken-atlas`）。选择 Free 方案并创建项目。
3. 项目就绪后，左侧打开 **SQL Editor → New query**。
4. 将仓库中的 [supabase/schema.sql](supabase/schema.sql) 全部复制到编辑器，点击 **Run**。脚本可重复运行并保留数据。

脚本建立 41 位角色标识、公开昵称、私人收藏、私人评价行和公开留言；用户只能操作自己的记录。排行榜通过函数仅返回汇总数字，不公开个人评分行。每个账户或游客会话每个角色最多一条可修改的留言、一组赞踩及 1–5 星评分。数据库也检查 15 字限制，Emoji 按 Unicode 码点计数，不只依赖网页。

## 2. 设置登录邮件跳转

1. 打开 **Authentication → URL Configuration**。
2. **Site URL** 填写 `https://novpan356.github.io/second-one/`。
3. 在 **Redirect URLs** 中添加相同地址，保存。
4. 在 **Authentication → Providers / Sign In** 中开启 Email 登录和邮箱确认。

本站支持邮箱密码注册、登录、确认邮件和密码重置。注册时填写的昵称显示在公开留言中；邮箱与密码不写入公开档案。确认邮件发件服务和发送额度遵循你的 Supabase 项目设置；需要更多邮件额度时可在 Supabase 配置自己的 SMTP。此仓库不处理或储存明文密码。

## 3. 给 GitHub 自动构建配置公开连接参数

1. Supabase 项目中打开 **Project Settings → API / API Keys**，找到 Project URL 和 **publishable key**（旧项目可使用 anon key）。
2. GitHub 打开仓库 https://github.com/novpan356/second-one 。
3. 点击 **Settings → Secrets and variables → Actions → Variables → New repository variable**。
4. 添加这两个变量：

| 名称                            | 值                                         |
| ------------------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`             | 项目 URL，例如 `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key / anon key        |

这些是供浏览器公开使用的连接参数。**不要填写 service_role、secret key 或数据库密码。** 数据访问控制由脚本中的行级权限规则执行。

5. 打开 GitHub **Actions → Deploy TEKKEN ATLAS to GitHub Pages → Run workflow**，选择 `main`，运行。
6. 工作流成功后刷新网站，点击登录并注册一个账户，确认邮件后登录。
7. 分别验证：角色收藏、招式弹窗收藏、15 字留言、赞踩和五星评分；退出再登录时收藏应保持。

访客收藏不会自动上传或覆盖账户收藏；登录后可在「我的账户」点击「导入本机收藏」主动合并。退出登录恢复本机访客收藏。

本地开发复制 `.env.example` 为 `.env.local` 并填写同样两个公开参数，运行 `npm run dev`。这些本地配置已被 Git 忽略。

## 在线玩家数据与 EWGF

2026-10-12 查证：`ewgf-gg/ewgfgg-frontend` 的 README 说明公开仓库于 2025-10-16 归档，网站后续为闭源项目。旧版前端通过自己的后端查询玩家，而非公开一个保证支持跨站使用的数据 API。本环境访问 EWGF 和 Wavu Wank 返回 CONNECT 403，当前接口、CORS、iframe 权限与覆盖范围未核验。

已提供「在线玩家」页面、TEKKEN ID 档案跳转和 EWGF 天梯入口。未配置获授权的数据接口时，页面清楚显示未接入状态，不生成任何虚构数据，也不声称对战记录能证明玩家此刻在线。

### 有可使用的数据接口时

仓库准备了 `supabase/functions/player-data/index.ts` 适配函数，采用旧版仓库公开的后端路径：

- `/player-stats/search?query=...`
- `/player-stats/<id>`
- `/statistics/leaderboards`

这是待核对的旧版协议，**不能将 `https://ewgf.gg` 直接当作此后端地址**。先向数据提供方确认使用许可、接口地址与返回格式，必要时调整函数。未完成核验之前，不要配置假的上游地址。

如协议相符，在本地安装 Supabase CLI，登录你的项目，使用它的部署流程：

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy player-data
```

在 Supabase 的 **Edge Functions → Secrets** 安全设置：

| 名称                    | 用途                              |
| ----------------------- | --------------------------------- |
| `PLAYER_UPSTREAM_URL`   | 获授权上游 API 的 HTTPS 根地址    |
| `PLAYER_UPSTREAM_TOKEN` | 上游需要的服务端 API 凭证（可选） |

凭证仅用于服务端，不加入 `VITE_` 变量、代码或聊天。函数仅返回公开游戏数据，与本站登录信息无关。函数为公开读取，使用固定上游地址、查询参数校验、超时、数量限制及 30 秒缓存；不接受任意 URL，不爬取网页、不返回上游凭证或内部错误。

随后添加 GitHub 仓库变量：

`VITE_PLAYER_API_URL=https://YOUR_PROJECT.supabase.co/functions/v1/player-data`

重新运行 Pages 工作流。页面可显示查询结果、玩家积分/排名/实力、可用的对战记录；上游缺失字段保持「未提供」，而不是推算。接口完整数据协议和测试样例见 [tests/community.test.mjs](tests/community.test.mjs) 与 [src/community/model.js](src/community/model.js)。

## 验证范围

`npm test` 包含真实 PostgreSQL 引擎（PGlite）的行级权限、不同账户隔离、匿名只读汇总与数据库留言长度检查。浏览器测试中的账户和玩家接口使用明确的测试桩；它们验证接入行为，不能替代你新建云项目后的实际注册邮件、跨设备验证或 EWGF 当前服务实测。

拥有项目管理权限后，可在 Supabase 删除违规留言或通过 Auth 管理用户。删除 Auth 用户会级联删除该用户的收藏、评分和留言。

运行浏览器接入测试时，启动一个普通开发服务器（5173），以及配置了明确测试地址的服务器（5176）。测试会拦截该测试域名，全部使用测试桩，不访问真实用户数据库：

```bash
VITE_SUPABASE_URL=https://atlas-test.supabase.co VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_atlas_test VITE_PLAYER_API_URL=https://atlas-test.supabase.co/functions/v1/player-data npm run dev -- --port 5176 --strictPort
# 在另一个终端，保留普通 npm run dev 的 5173 服务后运行：
npm run test:community-ui
```

新增浏览器验证：在前述两个开发服务器运行后执行 `npm run test:visitor-ui`，覆盖主页 41 个发布入口、本机持久化、顶部展开、两个模拟云游客之间赞踩改变热评及主页同步。实际云匿名登录仍需在你的 Supabase 项目开启并配置连接参数后验证。

## 邮箱注册提示失败时

登录/注册弹窗新增「检查邮箱服务配置」，在当前浏览器中只读请求 Supabase 的公开 Auth settings，不创建用户、不发送邮件。它验证连接、邮箱提供方/注册开关和邮箱自动确认设置；连接成功不代表 SMTP 发信或数据库触发器已经正常。

注册失败现在显示具体分类、HTTP 状态和 SDK 可提供的错误代码。不要反复提交注册，以免触发邮件发送额度。按照实际提示处理：

| 实际错误                                | 检查位置与处理                                                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `email_address_not_authorized`          | Authentication 的 Email / SMTP Settings；默认邮件服务可能仅向项目团队成员邮箱发送，向其他访客发邮件需配置自己的 SMTP。 |
| `over_email_send_rate_limit` / HTTP 429 | Auth 日志、邮件发送额度和 SMTP 限流；等待额度恢复后再试。                                                              |
| `email_provider_disabled`               | Sign In / Providers → Email，启用 Email provider。                                                                     |
| `signup_disabled`                       | Sign In / Providers，允许新用户注册。                                                                                  |
| `weak_password`                         | 按项目实际密码复杂度规则设置密码，页面注册至少要求 8 位。                                                              |
| 保存用户时数据库错误 / HTTP 500         | Authentication 的日志里查失败细节，核对 `profiles` 表和 `public.create_profile` 触发器。不要直接关闭行级权限。         |
| `captcha_failed`                        | 项目启用了 CAPTCHA，但当前注册表单未接入验证组件；需要匹配的 CAPTCHA 前端接入。                                        |
| 无法连接 / API 参数未授权               | 检查网络、项目是否暂停、Project URL 和 Publishable key 是否来自同一项目。                                              |

将新提示的 HTTP 状态和错误代码提供给维护者即可，不要提供密码或 Secret key。项目后台菜单的名称随 Supabase 版本可能略有不同；通过 Authentication 的 Logs / 日志查看实际失败记录。
