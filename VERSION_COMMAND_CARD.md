# v3.0 版本快速命令卡

**发布日期**：2026-05-01  
**Git Tag**：`v3.0`  
**提交 ID**：`c54d4ddf`  

---

## 🚀 快速命令

### 查看当前版本

```bash
# 查看 git 日志
git log --oneline -5

# 查看当前标签
git tag -l

# 查看 v3.0 详情
git show v3.0
```

### 回退到 v2.4（一键脚本）

```bash
# 最简单：执行自动脚本
bash scripts/rollback-to-v2.4.sh

# 手动回退
git checkout v2.4
npm run build:weapp
```

### 查看版本差异

```bash
# 查看 v2.4 → v3.0 的改动
git diff v2.4 v3.0

# 显示改动统计
git diff --stat v2.4 v3.0

# 查看特定文件变化
git diff v2.4 v3.0 -- src/data/topicQuestions.ts
```

---

## 📋 版本内容

### 新增文件（v3.0）

```
✅ src/pages/companion/              # Web-view 陪聊页面
✅ src/utils/companionSession.ts     # 会话管理工具
✅ COMPANION_INTEGRATION.md          # 集成指南
✅ VERSION_HISTORY.md                # 版本管理文档
✅ VERSION_SNAPSHOT.md               # 版本快照
✅ QUICK_VERSION_REF.md              # 快速参考
✅ scripts/rollback-to-v2.4.sh       # 回退脚本
```

### 改动文件（v3.0）

| 文件 | 改动 |
|-----|------|
| src/data/topicQuestions.ts | + ocean 题型 |
| src/data/contentConfig.ts | + 海洋置顶 |
| src/utils/recommendations.ts | + ocean 推荐 |

---

## 🔄 常用回退场景

### 场景 1：需要回到 v2.4

```bash
# 执行一键回退脚本（推荐）
bash scripts/rollback-to-v2.4.sh

# 会自动：
# 1. 备份当前 dist → dist-v3.0-backup
# 2. 删除 v3.0 新增文件
# 3. 恢复 v2.4 数据文件
# 4. 重新构建
```

### 场景 2：需要恢复到 v3.0

```bash
# 从备份恢复
cp -r dist-v3.0-backup dist
cp -r release/v3.0-weapp-backup release/v3.0-weapp

# 或重新构建
git checkout v3.0
npm run build:weapp
```

### 场景 3：查看某个版本的完整代码

```bash
# 查看 v2.4 中的某个文件
git show v2.4:src/pages/result/index.tsx

# 临时切换到 v2.4 分支检查
git checkout v2.4 -- src/
npm run build:weapp
```

---

## ⚡ 快速检查清单

### 发布前

- [ ] 构建通过 (`npm run build:weapp`)
- [ ] 所有新增文件已提交
- [ ] Git 标签已创建 (`git tag v3.0`)
- [ ] 版本文档已更新

### 发布后

- [ ] 产物已打包 (`release/sbti-miniapp-v3.0-*.zip`)
- [ ] 备份文件完整
- [ ] 回退脚本可用

---

## 📚 详细文档

- [VERSION_HISTORY.md](VERSION_HISTORY.md) — 完整版本管理指南
- [VERSION_SNAPSHOT.md](VERSION_SNAPSHOT.md) — v3.0 版本快照
- [QUICK_VERSION_REF.md](QUICK_VERSION_REF.md) — 快速问题排查
- [COMPANION_INTEGRATION.md](COMPANION_INTEGRATION.md) — AI 陪聊集成指南

---

## 🔗 下个版本计划

### v3.1（预计）

- [ ] 陪聊功能优化
- [ ] 后端 API 完善
- [ ] 数据分析增强

### v4.0（预计）

- [ ] 新的内容系列
- [ ] 推荐算法升级
- [ ] 性能优化

---

**维护时间**：2026-05-01  
**维护者**：SBTI Development Team
