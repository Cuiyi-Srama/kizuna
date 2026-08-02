# Kizuna 适配层 — Claude Code

> Claude Code 官方支持 Hooks（settings.json）与记忆文件（CLAUDE.md）。Kizuna 的 Hook 体系天然对应。

## 安装方式

1. 将 `references/` 内容合并进项目的 `CLAUDE.md`（或 `~/.claude/CLAUDE.md` 全局生效）
2. 配置官方 Hooks（`~/.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {"type": "command", "command": "node /path/to/kizuna/harness_verifier.js"}
        ]
      }
    ],
    "PostToolUse": [],
    "Stop": []
  }
}
```

3. 铁律条款追加到 CLAUDE.md 顶部（AI 每次会话自动读取）

## 能力映射

| Kizuna 概念 | Claude Code 实现 |
|-------------|------------------|
| 记忆库 | CLAUDE.md（项目级）+ ~/.claude/（全局级） |
| 世界书 | CLAUDE.md 常驻段落 |
| 10事件Hook | settings.json hooks（PreToolUse/PostToolUse/Stop等） |
| 全局强制 | CLAUDE.md 全局文件 |
| 确定性验证 | hooks command 调用脚本（node） |

## 注意

- Claude Code 的 Hook 是系统级执行（command），比提示词级强制更强——Kizuna 的铁律可直接升级为 Hook 命令
- harness_verifier.js 为 Node 脚本，可直接复用