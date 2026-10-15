# SYM DOJO — 3D 素材与模拟数据来源

## 已实际取得的资源

- 作者：Quaternius；Universal Animation Library，Standard 免费版本。
- 作者页面：https://quaternius.itch.io/universal-animation-library
- 原作者网站：https://quaternius.com/
- 下载镜像：https://github.com/J-Ponzo/gltf-universal-animation-library
- 固定提交：e24c23cf2a1323488a3faa226ea7ea21f644b73e
- 文件：glTF/AnimationLibrary_Godot_Standard.gltf、对应 .bin；本地改名 generic-rig.gltf，内部 bin 引用保持原样。
- 内容：1 个带蒙皮的通用人形、骨骼、46 段动画，包括拳击、蹲姿、移动、受击等。资源查看器播放这些原始动画。
- 许可证：CC0 1.0；完整副本见同目录 CC0-LICENSE.txt。镜像 README 声明来自作者于 2025-06-10 公开的免费包。
- 这个通用模型不是沙欣，也没有沙欣专属动作。它目前只用于独立素材预览；战斗原型使用项目内原创蒙皮模型和程序制作的骨骼动作。

## 尚未取得的素材

沙欣原版模型、专属动作和《铁拳8》三岛道场原版地图尚未找到可以核验授权、直接下载的来源。检索过公开 GitHub 项目；名为 K00258726/Mishima-Dojo 的仓库仅含 .gitattributes，不能当作地图资源。当前环境对 Sketchfab 和部分搜索站点的网络访问受限，尚未完成这些站点的人工素材核查。

当前可玩页面的沙欣形象、对手及日式道场为原创几何示意，不是从游戏提取的资产，也不宣称还原原版地图。后续获得可用 GLB/GLTF 模型时仍需骨骼映射、动画重定向和命中轨迹校准；不只是替换文件。

## 招式与战斗数据

- 数据：https://wavu.wiki/t/Shaheen_movelist
- 本仓库快照：2026-07-27，补丁版本未标定；不能视为已验证的最新 S3 帧级还原。
- 发生、有效帧范围、伤害、命中和防御帧标记从 public/data/shaheen.json 读取。派生招式独立演示时使用末段数据。
- 有总时长 t 标记时采用总时长；缺失总时长、攻击轨迹、判定体尺寸、移动速度、重力、派生窗口、打击停顿、空中伤害缩放均为原型参数。
- 不支持 Heat、Rage、拆投、完整起身、墙体破坏或原版完整招式表。
- 倒地朝向默认示意，未逐招验证；投技动画与 FUFA 朝向也为示意，不是原版结论。

核查日期：2026-10-15。
