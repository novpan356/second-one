# GitHub Pages 发布

项目已支持 GitHub Pages 的 `/second-one/` 子路径；角色图片、帧数 JSON 与页面脚本使用相对地址。

`.github/workflows/pages.yml` 在 main 更新时自动安装依赖、执行数据测试、构建并部署到 GitHub Pages。首次使用需要仓库已启用 Pages；工作流不使用个人访问令牌。

## 首次启用

1. 打开仓库的 Settings → Pages。
2. 在 Build and deployment 中，将 Source 设为 **GitHub Actions**。
3. 打开 Actions → Deploy TEKKEN ATLAS to GitHub Pages。
4. 若刚才的运行因 Pages 尚未启用而失败，点击 Re-run all jobs；也可选择 Run workflow → main → Run workflow。
5. 等 build 和 deploy 都显示绿色成功，再打开 Settings → Pages 所列的网站地址。

预期地址：`https://novpan356.github.io/second-one/`。该地址仅在成功部署后可用，文件推送或工作流上传不代表网站已上线。

若使用已经准备好的 `gh-pages` 静态分支，也可选择 Source → Deploy from a branch，Branch → gh-pages，Folder → / (root)，再保存。之后若希望由 main 自动部署，请切回 GitHub Actions。

本云环境当前无法访问 Pages 设置 API 与最终公网地址（网络代理 CONNECT 403）。已保存所需 `api.github.com` 与 `novpan356.github.io` 的环境网络配置草稿；草稿未应用前不能据此确认 Pages 设置或上线状态。
