# Kizuna — 通用 Agent 治理框架

> 仓库：`kizuna` | 名称来源：AI 命名（日语「絆」= 纽带）
> 基于 Anthropic Claude Code 公开系统提示词源码（515 条）+ 官方工程博客重建。
> **平台中立**：核心方法论与平台无关；文档中的 Operit 实现（query_memory / use_package / 世界书 / enforcement: global）为参考实现，其他平台可映射到对应机制（如 Claude Code 的 CLAUDE.md / hooks）。

## 这是什么

一套完整的 **Agent 治理框架**，把"犯错 → 修正 → 永久工程化"的循环落地到 AI 运行环境：

- **10 事件 Hook 注册表**（3 类型 × 决策三分法）— 会话开始到回复结束的全生命周期约束
- **4 型记忆分类 + 精选规则** — 记忆按 user/project/feedback/reference 分型，≤5 条按需注入
- **反退化闭环** — 错误模式检测 → 分析 → 持久化 → 自动激活（铁律 L1→L4 升级路径）
- **经验纠错三路径** — 被动触发 / 版本变更自检 / 工具缺陷触发，统一修正标记
- **确定性路由表** — 按问题特征路由到最相关记忆源，检索前先缩小范围
- **跨卡入口模板** — 世界书标准条目，新角色卡 10 秒接入
- **铁律强制执行清单** — 13 条行为规则 + 3 条用户约束（通用版）

## 安装（4 步，约 10 分钟）

### 第 1 步：安装技能
1. 下载本 zip 包
2. 解压后将 `05-harness-kizuna` 文件夹放入平台 skills 目录（如 `/sdcard/Download/Operit/skills/`）
3. 确保目录内含 SKILL.md，平台会自动识别

### 第 2 步：导入记忆（AI 执行）
让 AI 读取 `references/` 目录并导入记忆库：

```
请读取 references/ 下所有文档，按 [铁律] / [Harness] 前缀导入记忆库：
- ironlaw-v4.md        → [铁律] 强制执行清单 v4.0
- kizuna-overview.md   → [Harness] Kizuna — 架构总览
- hooks-registry.md    → [Harness] HooksRegistry — 10事件注册表
- memory-taxonomy.md   → [Harness] MemoryTaxonomy — 4型分类规则
- memory-selector.md   → [Harness] MemorySelector — 精选规则
- anti-regression.md   → [Harness] AntiRegression — 反退化闭环
- cross-card-entry.md  → [Harness] 跨卡入口模板
```

### 第 3 步：贴世界书（可选但推荐）
打开当前角色卡 → 世界书 → 新建条目 → 粘贴 `worldbook/harness-hooks.md` 中的条目文本 → 激活方式选【常驻】。

> 不贴世界书也能用：全局强制技能会兜底触发铁律查询；贴了则完整 Hook 自动注入。

### 第 4 步：启用全局强制（可选）
若平台支持 `enforcement: global`，建议将铁律相关技能设为全局强制，确保跨对话/跨角色卡生效。

### 验证
- 新会话首条消息：AI 是否自动查询了铁律？
- 说"检查马具"：AI 能否列出 10 事件注册表？
- 说"导入 Harness 记忆"：AI 能否完整导入 references/？

## 文件结构

```
05-harness-kizuna/
├── SKILL.md              — 主入口（架构 + 使用指引）
├── README.md             — 本文件（安装手册）
├── LICENSE               — MIT
├── references/           — 记忆导入文档集（7 个组件）
│   ├── ironlaw-v4.md     — 铁律 v4.0（社区版，已泛化个人约束）
│   ├── kizuna-overview.md
│   ├── hooks-registry.md
│   ├── memory-taxonomy.md
│   ├── memory-selector.md
│   ├── anti-regression.md
│   └── cross-card-entry.md
└── worldbook/
    └── harness-hooks.md  — 世界书条目（4 条，可直接粘贴）
```

## 作品集（本仓库 skills/ 目录）

除核心框架外，本仓库还收录配套作品（全部 MIT）：

| # | 作品 | 说明 |
|---|------|------|
| 01 | self-evolution-engine | 自进化引擎（5维自我批判，全局强制） |
| 02 | sub-agent-troubleshooting | 子Agent故障排查手册 |
| 03 | anti-hallucination | 反幻觉协议（全局强制） |
| 04 | harness-verifier | 确定性验证器（55行JS，code_runner调用） |
| 05 | kizuna | 本框架（根目录） |
| 06 | task-orchestration-system | 任务规划与执行系统 |
| 07 | self-evolution-action-framework | 自进化行动框架（S1-S5策略） |
| 08 | enforcement-engine | 强制规则引擎（含RULES_REGISTRY，全局强制） |
| 09 | chat-grouping | 对话分组整理 |

## 许可证

MIT © 2026 Cuiyi-Srama — 详见 LICENSE

> 架构依据 Anthropic Claude Code 公开源码（系统提示词 515 条）与官方工程博客（Harness design for long-running application development, 2026.03）重建。非 Anthropic 官方产品。