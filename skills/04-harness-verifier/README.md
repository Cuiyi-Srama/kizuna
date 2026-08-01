# 确定性验证器

55 行零依赖 JS 脚本，提供 AI 无法跳过的代码级确定性检查：路径安全（禁止写入系统路径）、版本号递增校验、6 种危险命令模式阻断。通过 code_runner 在 PreToolUse 阶段调用，返回结构化 approve/block 决策。

## 安装

1. 下载本目录 zip 包
2. 解压后将 `04-harness-verifier` 文件夹放入平台的 skills 目录（如 `/sdcard/Download/Operit/skills/`）
3. 确保目录内含 SKILL.md，平台会自动识别

## 许可证

MIT © 2026 Cuiyi-Srama — 详见 LICENSE
