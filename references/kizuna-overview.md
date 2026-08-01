# Kizuna — 架构总览

> 基于 Anthropic Claude Code 公开系统提示词源码（515条）+ 官方工程博客重建。
> 本条目是 Harness 系统的根节点，安装时导入记忆库。

## 设计哲学

> "每次 agent 犯错，就把修正方案永久工程化进 agent 的运作环境里，让同样的错误不会再发生。" — Mitchell Hashimoto

Harness 不做"建议"，做"强制执行"。模型推理前，正确的约束已经注入 context。

## 三层架构

```
L1: 单Agent运行时
  ├── SystemPrompt Assembler (22条件组件)
  ├── Hooks Engine (10事件×3类型)
  ├── Memory System (4型分类 + 精选Agent + Dream整合)
  ├── Skill System (3层渐进披露)
  ├── Permission Manager (5级模式)
  ├── Context Budget (多级压缩+断路器)
  └── Frustration Detection (Regex匹配)

L2: 多Agent协作框架
  ├── Coordinator (唯一用户接口)
  ├── Worker×N (不直接对话用户)
  ├── Evaluator (测试+4维评分)
  ├── State Classifier (working/blocked/done/failed)
  └── Sprint Contract (Generator↔Evaluator协商)

L3: 自我进化引擎 (反馈闭环)
  ├── Dream Consolidation (4阶段: Orient→Gather→Consolidate→Prune)
  ├── Anti-Regression Loop (Detect→Analyze→Extract→Persist→Activate)
  └── Background Cleanup Agent (定期扫描→修复漂移)
```

## 关键设计决策

1. **Hook 是确定性约束，不是模型推理。** Command型Hook用记忆查询实现确定性检查。
2. **记忆选择是独立Agent。** 每次用户查询后运行精选Agent，≤5条，反误匹配。
3. **Worker不对话用户。** Coordinator是唯一用户接口。
4. **技能3层渐进。** Metadata始终在context，Body触发后注入，References按需。
5. **Dream是离线合成。** 利用会话日志+转录，合并新信号，修正过时事实。

## 子系统清单

| 子系统 | 文档 |
|--------|------|
| 10事件Hook注册表 | references/hooks-registry.md |
| 4型记忆分类 + 演进标记 | references/memory-taxonomy.md |
| 反退化闭环 + 三路径纠错 | references/anti-regression.md |
| 精选Agent + 确定性路由 | references/memory-selector.md |
| 铁律强制执行清单 | references/ironlaw-v4.md |
| 跨卡入口模板 | references/cross-card-entry.md |
| 世界书条目 | worldbook/harness-hooks.md |

---
v2.0 | 社区版 | 基于A社515条系统提示词原文+官方工程博客重建