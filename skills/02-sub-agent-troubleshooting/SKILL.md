---
name: sub-agent-troubleshooting
version: 1.0.0
description: 子Agent管理器故障排查与无损修复经验。记录了 sub_agent_manager 包对空白角色卡的硬依赖问题、Tools.Chat API 探索、以及无侵入式修复方案。
disable-model-invocation: false
---

# 子Agent管理器故障排查笔记

## 问题背景

`sub_agent_manager` 包在 `review` 功能中硬性要求存在名为"空白角色卡"或"空白卡"的角色卡，否则报错：

```
失败: 未找到名为"空白角色卡"或"空白卡"的角色卡。
请在 Operit 中创建：名称填"空白角色卡"或"空白卡"，系统提示词随意或不填。
```

## 根因分析

包的 `findBlankCard()` 函数（位于 `sub-agent-manager-v1.0.0-*.js`）调用 `Tools.Chat.listCharacterCards()` 获取所有角色卡，然后按名称匹配。找不到时直接 `throw new Error`，没有降级方案。

## 探索过程

### Tools.Chat API 清单

通过 `operit_editor:debug_run_sandbox_script` 探索得到：

```javascript
const keys = Object.keys(Tools.Chat).filter(k => typeof Tools.Chat[k] === 'function');
// 结果：
[
  "startService",        // 启动聊天服务
  "createNew",           // 创建新会话（第三个参数=角色卡ID，可为null）
  "listAll",             // 列出所有会话
  "listChats",           // 列出聊天
  "findChat",            // 查找会话
  "agentStatus",         // Agent状态
  "switchTo",            // 切换会话
  "updateTitle",         // 更新标题
  "deleteChat",          // 删除会话
  "getMessages",         // 获取消息
  "getMessagesRange",    // 获取消息范围
  "sendMessage",         // 发送消息
  "sendMessageStreaming",// 流式发送
  "listCharacterCards"   // 列出角色卡
]
```

**关键发现：** `Tools.Chat.createNew(title, false, cardId)` 的第三个参数 `cardId` 可以传 `null`，此时创建的是**无角色卡绑定的纯净会话**。这比用空白角色卡更纯净，因为空白角色卡仍然带有系统级行为准则，而 `null` 则完全无约束。

**没有 `createCharacterCard` API** —无法通过脚本创建新角色卡。

### Tools.Files.read 返回值格式

```javascript
const result = await Tools.Files.read(path);
// result = { __type, path, content, size, env }
// content 才是文件内容（字符串）
```

注意 `.read()` 返回对象而非直接返回字符串，通过 `result.content` 获取内容。

### 包安装路径

```
/storage/emulated/0/Android/data/com.ai.assistance.operit/files/packages/
```

包文件命名格式：`<包名>-v<版本号>-<hash>.js` 或 `.toolpkg`

## 无损修复方案

不要修改用户角色卡，不要借用现有角色卡，直接修改包源码：

### 修改点 1：findBlankCard 降级

```javascript
// 修改前：
async function findBlankCard() {
    const result = await Tools.Chat.listCharacterCards();
    const cards = (result.cards ?? []);
    const blank = cards.find((c) => c.name === '空白角色卡' || c.name === '空白卡');
    if (!blank || !blank.id) {
        throw new Error('未找到名为"空白角色卡"或"空白卡"的角色卡。\n请在 Operit 中创建...');
    }
    return blank;
}

// 修改后：
async function findBlankCard() {
    const result = await Tools.Chat.listCharacterCards();
    const cards = (result.cards ?? []);
    const blank = cards.find((c) => c.name === '空白角色卡' || c.name === '空白卡');
    if (!blank || !blank.id) {
        return null;  // ⭐ 降级：返回null，后续创建纯净会话
    }
    return blank;
}
```

### 修改点 2：createNew 适配 null

```javascript
// 修改前：
const creation = await Tools.Chat.createNew('子Agent', false, blankCard.id);

// 修改后：
const cardId = blankCard ? blankCard.id : null;
const creation = await Tools.Chat.createNew('子Agent', false, cardId);
```

### 操作步骤

```bash
# 1. 备份原文件
cp <包路径>/sub-agent-manager-v1.0.0-*.js <包路径>/sub-agent-manager-v1.0.0-*.js.bak

# 2. 用 sed 或 python3 修改
python3 -c "
path = '<包路径>/sub-agent-manager-v1.0.0-*.js'
with open(path, 'r') as f:
    c = f.read()
# 替换 fallback 逻辑
old = '...'  # findBlankCard 原代码
new = '...'  # findBlankCard 新代码
c = c.replace(old, new)
# 替换 createNew 调用
old2 = 'const creation = await Tools.Chat.createNew(...blankCard.id);'
new2 = 'const cardId = blankCard ? blankCard.id : null;\n        const creation = await Tools.Chat.createNew(...cardId);'
c = c.replace(old2, new2)
with open(path, 'w') as f:
    f.write(c)
"

# 3. 重新加载包
use_package("sub_agent_manager")  # 触发重新加载
```

### 回滚

```bash
cp <包路径>/sub-agent-manager-v1.0.0-*.js.bak <包路径>/sub-agent-manager-v1.0.0-*.js
```

## 关键经验总结

1. **Tools.Chat.createNew 可以传 null 作为 cardId** — 创建完全纯净的会话，比空白角色卡更干净
2. **不要修改用户现有角色卡** — 用户的所有角色卡都是有意义的，借用或修改会破坏用户配置
3. **包修改后必须重新加载** — 单纯改文件不行，需要 `use_package` 或 `set_sandbox_package_enabled` 触发刷新
4. **修改前先备份** — `.bak` 文件是最后的安全网
5. **Tools.Files.read 返回对象而非字符串** — 需要 `.content` 属性获取内容
6. **优先无侵入方案** — 修改包自身的降级逻辑比创建/借用角色卡更优雅
7. **不要用 UI 自动化创建角色卡** — 太慢且不可靠，直接分析 API 和源码更高效
