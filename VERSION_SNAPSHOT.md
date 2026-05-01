# SBTI 小程序版本快照

**快照时间**：2026-05-01 23:59:59  
**版本**：v3.0  
**构建产物**：`release/sbti-miniapp-v3.0-weapp-20260501.zip`

---

## 新增文件清单（v3.0）

### 核心功能文件

```
✅ src/pages/companion/index.tsx
   - Web-view 容器页面
   - 用于加载 H5 陪聊应用

✅ src/pages/companion/index.scss
   - Web-view 页面样式

✅ src/pages/companion/index.config.ts
   - Web-view 页面配置

✅ src/utils/companionSession.ts
   - 陪聊会话管理工具
   - 与后端 API 交互
   - 生成一次性 code 和 H5 URL
```

### 文档文件

```
✅ COMPANION_INTEGRATION.md
   - AI 陪聊集成指南
   - 包含代码示例、后端参考、故障排查

✅ VERSION_HISTORY.md
   - 版本管理文档（本文件）

✅ VERSION_SNAPSHOT.md
   - 版本快照清单（本文件）
```

---

## 改动文件清单（v3.0）

### 数据文件

| 文件 | 改动 | 行数 |
|-----|------|------|
| `src/data/topicQuestions.ts` | + ocean 类型定义 + 4 题题库 | +120 |
| `src/data/contentConfig.ts` | + 海洋系列热测 + topicTests 前置 | +10 |

### 推荐流文件

| 文件 | 改动 | 行数 |
|-----|------|------|
| `src/utils/recommendations.ts` | + ocean 推荐项 + 所有推荐顺序调整 | +12 |

---

## 构建验证

```bash
# 构建命令
npm run build:weapp

# 输出结果
✔ Webpack Compiled successfully in 3.33s

# 输出目录
dist/
├── app.js
├── app.json
├── app.wxss
├── pages/
├── common.js
├── comp.js
├── comp.json
├── comp.wxml
├── taro.js
├── utils.wxs
└── vendors.js

# 产物包大小
Total size: ~2.8MB (uncompressed)
```

---

## 版本回退命令速查

### 保险做法（保留当前文件备份）

```bash
# 1. 备份当前构建
cp -r dist dist-v3.0-backup
cp -r release/v3.0-weapp release-v3.0-backup

# 2. 回退到 v2.4 的文件版本
# 手动删除：
rm -rf src/pages/companion/
rm src/utils/companionSession.ts
rm COMPANION_INTEGRATION.md

# 手动恢复 v2.4 版本的：
# - src/data/topicQuestions.ts（移除 ocean）
# - src/data/contentConfig.ts（移除海洋置顶）
# - src/utils/recommendations.ts（移除 ocean 推荐）

# 3. 重新构建
npm run build:weapp
```

### 快速做法（使用 Git）

```bash
# 假设已建立 git 版本管理
git reset --hard v2.4
npm run build:weapp
```

### 恢复到 v3.0

```bash
# 从备份恢复
cp -r dist-v3.0-backup dist
cp -r release-v3.0-backup/v3.0-weapp release/

# 或重新构建
git reset --hard v3.0
npm run build:weapp
```

---

## 版本差异摘要

### 相对 v2.4 的改动

**新增功能**：
- 🌊 海洋系列测试（4 题快测，生物角色结果）
- 🤖 AI 陪聊集成（Web-view + 会话管理）

**改动点**：
- topicQuestions.ts：+ocean 类型 +120 行
- contentConfig.ts：+热测置顶 +10 行
- recommendations.ts：+推荐流融合 +12 行
- app.config.ts：需新增 pages 注册（companion）

**向后兼容**：✅ 完全兼容，v2.4 所有功能保留

---

## 下次发布清单

发布 v3.1 或 v4.0 时，记得：

- [ ] 更新 VERSION_HISTORY.md
- [ ] 更新本文件（VERSION_SNAPSHOT.md）
- [ ] 创建 git tag
- [ ] 打包分发 zip
- [ ] 更新 package.json version
- [ ] 验证构建通过

---

**维护时间**：2026-05-01  
**维护者**：SBTI 开发团队
