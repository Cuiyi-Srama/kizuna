# Kizuna 适配层 — 通用平台

> 适用于无记忆库/无Hook机制的平台（普通 Chat UI、其他 Agent 前端）。

## 安装方式

1. 将 `references/ironlaw-v4.md` 全文注入 system prompt（或角色卡系统提示词）
2. 将 `references/hooks-registry.md` 追加为"每次回复前的检查清单"
3. 每次会话开始提示 AI 执行 SessionStart 清单（查铁律→查项目→查偏好）

## 能力映射

| Kizuna 概念 | 通用平台实现 |
|-------------|-------------|
| 记忆库 | system prompt 常量段（或平台自带记忆功能） |
| 世界书 | 角色卡系统提示词 |
| 10事件Hook | 提示词清单（AI 自觉执行，无系统级强制） |
| 全局强制 | 无法实现——只能靠提示词纪律 |

## 限制说明

- 通用平台无系统级 Hook，铁律为"软强制"（模型可忽略）
- 跨会话持久化依赖平台记忆功能；无记忆平台需每次注入
- 建议优先使用支持 Hook/记忆的平台（Operit / Claude Code）获得完整能力