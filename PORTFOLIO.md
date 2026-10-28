# RAY PAN 作品集

公开地址：https://novpan356.github.io/second-one/portfolio/
管理地址：https://novpan356.github.io/second-one/portfolio/manage/

作品集是独立子站，位于 portfolio/，不覆盖铁拳首页。只有作品集内容更新时，工作流仍验证并构建网站，保留目前已发布 Android APK，并校验其 SHA256；铁拳程序有修改时，照常执行原 Android 构建和测试。

## 站主在线更新

1. 打开管理地址，编辑文字、导入图片或视频、调整作品顺序。
2. 点击“保存并发布到网站”，首次连接你的 GitHub 发布权限。
3. 创建 fine-grained personal access token：资源所有者 novpan356，只选择 second-one 仓库，Repository permissions → Contents → Read and write。不需要授予工作流、其他仓库或账号管理权限。
4. 将令牌输入管理页（不要发到聊天），连接后再次点击发布。令牌只在当前页面内存中，不存储、不提交到网站，也不包含在项目备份中。关闭或刷新页面后需重新连接，建议设置较短有效期。
5. 代码提交后 GitHub Actions 构建并发布。页面会等待上线标记，超时可稍后刷新或在仓库 Actions 查看状态。发生失败不会强制覆盖其他提交。

未持有仓库写入权限的访客不能发布；能查看管理界面不等于能修改网站。仓库管理员及被你授予写入权限的协作者也能改动仓库；请在 GitHub 中管理协作者、开启双重验证，并撤销不再需要的令牌。

GitHub Pages 是静态站点，上传通过 GitHub Git Data API 提交仓库，非原来的 Node.js 密码后台。可继续使用下载项目备份和导出网站 ZIP。大视频受浏览器内存、GitHub 单文件和 Pages 额度约束，建议压缩后发布。不要把 .raypan.json 项目备份或自己的令牌放进仓库。
