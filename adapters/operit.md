# Kizuna 适配层 — Operit 平台

> 参考实现平台。本仓库文档中的 query_memory / create_memory / use_package / 世界书 / enforcement: global 均以本平台为例。

## 安装方式（完整）

1. 解压包 → 将 `05-kizuna-harness` 放入 skills 目录（如 `/sdcard/Download/Operit/skills/`）
2. 对 AI 说 **"安装 Kizuna"** → AI 按 INSTALL.md 协议执行
3. 粘贴世界书条目到角色卡（常驻激活）
4. （可选）将铁律相关技能设为 `enforcement: global`

## 能力映射

| Kizuna 概念 | Operit 实现 |
|-------------|-------------|
| 记忆库 | memory-space（query_memory / create_memory / update_memory） |
| 世界书 | 角色卡 worldbook（entries.json，常驻/关键词触发） |
| 全局强制 | SKILL.md frontmatter `enforcement: global` |
| 包工具 | use_package 激活 |
| 确定性验证 | harness_verifier.js（code_runner 调用） |

## 验证

- 说"检查马具" → AI 列出 10 事件注册表
- 新会话首条消息 → AI 自动查询铁律
- 切换角色卡 → 贴跨卡入口模板（references/cross-card-entry.md）