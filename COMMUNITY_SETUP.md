# 开启账户、收藏、留言和公共角色评分

网站目前仍由 GitHub Pages 托管。前端已经接入 Supabase 的真实账户和数据库接口；在你创建 Supabase 项目并配置之前，它显示本机访客模式，不会伪造登录成功、公共评价或实时战绩。本机可以收藏角色和招式，账户页为 `#account`，招式详情弹窗中有收藏按钮。

## 1. 创建免费的 Supabase 项目

1. 打开 https://supabase.com/dashboard ，使用你的账户登录。
2. 点击 **New project**，选择组织，输入项目名称（例如 `tekken-atlas`）。选择 Free 方案并创建项目。
3. 项目就绪后，左侧打开 **SQL Editor → New query**。
4. 将仓库中的 [supabase/schema.sql](supabase/schema.sql) 全部复制到编辑器，点击 **Run**。脚本可重复运行并保留数据。

脚本建立 41 位角色标识、公开昵称、私人收藏、私人评价行和公开留言；用户只能操作自己的记录。排行榜通过函数仅返回汇总数字，不公开个人评分行。每个账户每个角色最多一条可修改的留言、一组赞踩及 1–5 星评分。数据库也检查 15 字限制，Emoji 按 Unicode 码点计数，不只依赖网页。

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
