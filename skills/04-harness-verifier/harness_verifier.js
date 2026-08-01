// Harness Kizuna — 确定性验证器 v1.0
// 通过 code_runner 调用，提供代码级确定性检查

class HarnessVerifier {
  checkPathSafe(filePath, operation) {
    const safePrefixes = ['/data/local/tmp/', '/sdcard/Download/Operit/', '/sdcard/Download/'];
    const blockedPrefixes = ['/data/data/', '/system/', '/etc/', '/proc/', '/sys/'];
    if (operation === 'write' || operation === 'delete') {
      for (const blocked of blockedPrefixes) {
        if (filePath.startsWith(blocked)) {
          return { decision: 'block', reason: `禁止写入系统路径: ${filePath}` };
        }
      }
    }
    return { decision: 'approve' };
  }

  checkVersionIncrement(oldVC, newVC) {
    if (!oldVC || !newVC) return { decision: 'approve', reason: '无版本号信息' };
    if (parseInt(newVC) <= parseInt(oldVC)) {
      return { decision: 'block', reason: `版本号未递增! old=${oldVC} new=${newVC}`, fix: `改为至少 ${parseInt(oldVC)+1}` };
    }
    return { decision: 'approve', detail: `${oldVC} → ${newVC} ✓` };
  }

  checkDangerousCommand(command) {
    const patterns = [
      [/rm\s+-rf\s+\//, '禁止递归删除根目录'],
      [/mkfs\./, '禁止格式化'],
      [/>\s*\/dev\//, '禁止直接写入设备'],
      [/chmod\s+777/, '禁止全局可写权限'],
      [/curl.*\|\s*(ba)?sh/, '禁止pipe到shell的curl'],
      [/wget.*\|\s*(ba)?sh/, '禁止pipe到shell的wget'],
    ];
    for (const [p, reason] of patterns) {
      if (p.test(command)) return { decision: 'block', reason };
    }
    return { decision: 'approve' };
  }

  preToolUse(operation, context = {}) {
    const results = [];
    if (context.filePath) results.push(this.checkPathSafe(context.filePath, operation.tool));
    if (operation.tool === 'Bash' && context.command) results.push(this.checkDangerousCommand(context.command));
    if (context.oldVersionCode && context.newVersionCode) results.push(this.checkVersionIncrement(context.oldVersionCode, context.newVersionCode));
    const blocks = results.filter(r => r.decision === 'block');
    return { overall: blocks.length > 0 ? 'block' : 'approve', checks: results, summary: { total: results.length, blocks: blocks.length } };
  }
}

// CLI入口
const args = JSON.parse(process.argv[2] || '{}');
const verifier = new HarnessVerifier();
const result = verifier.preToolUse(args.operation || {}, args.context || {});
console.log(JSON.stringify(result, null, 2));