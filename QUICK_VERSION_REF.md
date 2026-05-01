# SBTI 小程序版本快速参考

> 快速版本切换和故障排查

---

## 快速查询

### 当前版本

```
版本：v3.0
日期：2026-05-01
状态：✅ 生产就绪
构建：✔ 通过 (3.33s)
```

### 版本列表

```bash
# 列出所有版本
git tag -l

# 查看特定版本信息
git show v3.0

# 查看版本之间的改动
git log --oneline v2.4..v3.0
```

---

## 一键回退脚本

### 方法 A：回退到 v2.4（推荐）

**脚本文件**：`scripts/rollback-to-v2.4.sh`

```bash
#!/bin/bash
set -e

echo "🔄 开始回退到 v2.4..."

# 1. 备份
cp -r dist dist-v3.0-backup
echo "✅ 已备份 dist 到 dist-v3.0-backup"

# 2. 删除 v3.0 新增文件
rm -rf src/pages/companion/
rm -f src/utils/companionSession.ts
rm -f COMPANION_INTEGRATION.md
echo "✅ 已删除 v3.0 新增文件"

# 3. 如果使用 git，恢复文件
if [ -d .git ]; then
  git checkout v2.4 -- \
    src/data/topicQuestions.ts \
    src/data/contentConfig.ts \
    src/utils/recommendations.ts
  echo "✅ 已从 v2.4 恢复改动文件"
fi

# 4. 重新构建
npm run build:weapp
echo "✅ 重新构建完成"

echo ""
echo "🎉 回退到 v2.4 成功！"
echo "如需回到 v3.0，执行：npm run build:weapp && git checkout main"
```

**使用方法**：
```bash
bash scripts/rollback-to-v2.4.sh
```

### 方法 B：Git 原子回退

```bash
# 如果所有改动已 commit 和 tag
git reset --hard v2.4
npm run build:weapp

# 恢复回 v3.0
git reset --hard v3.0
npm run build:weapp
```

---

## 常见问题解决

### 问题 1：海洋系列不显示

**症状**：首页看不到海洋系列卡片

**排查步骤**：
```bash
# 1. 检查 topicQuestions.ts 是否有 ocean 类型
grep -n "type TopicTestType" src/data/topicQuestions.ts

# 2. 检查 contentConfig.ts 是否有海洋置顶配置
grep -n "hot-ocean" src/data/contentConfig.ts

# 3. 检查构建是否生效
npm run build:weapp
```

**解决方案**：
```bash
# 如果缺少海洋系列，可能需要从 v3.0 恢复
git checkout v3.0 -- src/data/topicQuestions.ts src/data/contentConfig.ts
npm run build:weapp
```

### 问题 2：陪聊按钮报错

**症状**：点击按钮后 console 显示错误

**排查步骤**：
```bash
# 1. 检查 companion 页面是否存在
ls -la src/pages/companion/

# 2. 检查 companionSession.ts 是否存在
ls -la src/utils/companionSession.ts

# 3. 检查 app.config.ts 是否注册了页面
grep -n "companion" src/app.config.ts
```

**解决方案**：
```bash
# 如果缺少陪聊文件，可能需要恢复 v3.0
git checkout v3.0 -- src/pages/companion/ src/utils/companionSession.ts
npm run build:weapp
```

### 问题 3：需要快速对比两个版本

```bash
# 查看 v2.4 vs v3.0 的所有改动
git diff v2.4 v3.0 -- src/data/

# 查看特定文件的差异
git diff v2.4 v3.0 -- src/data/topicQuestions.ts

# 显示详细统计
git diff --stat v2.4 v3.0
```

---

## 定期检查清单

### 每次发布前

- [ ] 构建通过 (`npm run build:weapp`)
- [ ] 新增文件列表确认
- [ ] 改动文件列表确认
- [ ] 更新 VERSION_HISTORY.md 和 VERSION_SNAPSHOT.md
- [ ] Git 标签创建 (`git tag v3.X`)
- [ ] 产物打包 (`zip sbti-miniapp-v3.X-*.zip`)

### 每周

- [ ] 检查是否有遗留的临时文件
- [ ] 确认版本管理文档最新
- [ ] 验证回退脚本可用

---

## 版本回退风险评估

| 操作 | 风险等级 | 备注 |
|-----|--------|------|
| v3.0 → v2.4 | 🟡 中等 | 删除 companion 和 companionSession，恢复 3 个数据文件 |
| v2.4 → v2.3 | 🔴 高 | 需要恢复大量 v2.3 相关文件 |
| 恢复某个文件 | 🟢 低 | 单文件操作最安全 |

---

**如有问题，参考**：
- 详细版本管理：[VERSION_HISTORY.md](VERSION_HISTORY.md)
- AI 陪聊集成：[COMPANION_INTEGRATION.md](COMPANION_INTEGRATION.md)
