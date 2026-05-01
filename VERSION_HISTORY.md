# SBTI 小程序版本管理

> 版本管理规范，方便快速定位、回退和发布

---

## 📦 版本总览

| 版本 | 发布日期 | 主要功能 | 状态 | 快照 |
|-----|---------|--------|------|------|
| **v3.0** | 2026-05-01 | 海洋系列 + AI 陪聊集成 | ✅ 当前版本 | [v3.0 快照](#v30-快照) |
| v2.4 | 2026-04-28 | 内容扩容、留存增强、运营增强 | ✅ 已交付 | 见 docs/v2.4_UPDATE_NOTES.md |
| v2.3 | 2026-04-15 | 快测+完整版+历史记录+云同步 | ✅ 已交付 | 见 docs/v2.3_DEPLOY_GUIDE.md |

---

## v3.0 快照

**发布日期**：2026-05-01  
**Git Tag**：`v3.0`  
**Dist 产物**：`release/v3.0-weapp/dist`  

### 核心变动

#### 新增功能
- ✨ **海洋系列测试** (`ocean` 类型)
  - 4 题快测，结果为海洋生物（海豚、章鱼、海龟、水母）
  - 已默认置顶到首页热门和测试中心
  - 完全推荐流融合
  
- ✨ **AI 陪聊集成** (Web-view)
  - 新页面：`src/pages/companion/`
  - 会话管理工具：`src/utils/companionSession.ts`
  - 结果页增加"陪练讲解"按钮入口
  - 后端接口：`POST /api/session/create-code` + `POST /api/session/exchange`

#### 改动清单

| 文件 | 改动类型 | 描述 |
|-----|--------|------|
| `src/data/topicQuestions.ts` | 新增 | 添加 `ocean` 题型和 4 题题库 |
| `src/data/contentConfig.ts` | 改动 | 首页热门置顶海洋系列；topicTests 前置 ocean |
| `src/utils/recommendations.ts` | 改动 | 推荐流增加 ocean 并提升曝光 |
| `src/pages/companion/` | 新增 | 3 个文件（tsx + scss + config） |
| `src/utils/companionSession.ts` | 新增 | 陪聊会话管理工具 |
| `COMPANION_INTEGRATION.md` | 新增 | AI 陪聊集成指南 |

### 构建信息

```
Framework: Taro v4.2.0
Output: dist/
Build Status: ✅ Success
Build Time: 3.33s
```

### 验证清单

- [x] 构建通过 (`npm run build:weapp`)
- [x] 海洋系列题库正确加载
- [x] 海洋系列置顶展示
- [x] Web-view 页面可导航
- [x] 会话管理工具可调用

---

## 版本回退指南

### 场景 1：回退到 v2.4

**风险等级**：🟡 中等（删除新增文件，恢复改动）

```bash
# 方法 A：Git 回退（假设已 commit）
git reset --hard v2.4
git clean -fd  # 删除未追踪文件

# 方法 B：手动回退（如未 commit）
# 1. 删除新增文件
rm -rf src/pages/companion/
rm src/utils/companionSession.ts
rm COMPANION_INTEGRATION.md

# 2. 恢复改动的文件
# - src/data/topicQuestions.ts（删除 ocean 类型）
# - src/data/contentConfig.ts（移除海洋系列置顶）
# - src/utils/recommendations.ts（移除 ocean 推荐）

# 3. 重新构建
npm run build:weapp
```

### 场景 2：回退到 v2.3

**风险等级**：🔴 高（删除 v2.4 内容扩容 + v3.0 新功能）

```bash
# 更多工作，建议保存备份后操作
cp -r dist dist-v3.0-backup  # 备份当前版本

git reset --hard v2.3
npm run build:weapp
```

### 场景 3：快速切换分支版本

**推荐做法**：建立版本分支

```bash
# 创建 v3.0 分支并 commit
git checkout -b release/v3.0
git add -A
git commit -m "Release v3.0: Ocean series + AI companion integration"
git tag v3.0

# 切换回主分支
git checkout main

# 后续如需回退：
git checkout release/v3.0

# 或者直接重置到标签
git reset --hard v3.0
```

---

## 文件结构对比

### v3.0 新增文件

```
src/
├── pages/
│   └── companion/              # ← NEW
│       ├── index.tsx
│       ├── index.scss
│       └── index.config.ts
└── utils/
    └── companionSession.ts     # ← NEW

root/
├── COMPANION_INTEGRATION.md    # ← NEW
└── VERSION_HISTORY.md          # ← 本文件

release/
└── v3.0-weapp/                 # ← NEW (2026-05-01)
    ├── dist/
    ├── project.config.json
    └── project.private.config.json
```

### v3.0 改动文件（可回退）

```
src/
├── data/
│   ├── topicQuestions.ts       # + ocean 类型和题库
│   └── contentConfig.ts        # + 海洋系列置顶配置
└── utils/
    └── recommendations.ts      # + ocean 推荐流
```

---

## 版本发布流程

### 发布新版本时

```bash
# 1. 更新版本号和日期
# - 修改本文件的版本表
# - 更新 package.json version 字段

# 2. 提交代码
git add -A
git commit -m "Release v3.X: [功能描述]"

# 3. 打 tag
git tag v3.X

# 4. 构建产物
npm run build:weapp

# 5. 打包分发包
mkdir -p release/v3.X-weapp
cp -R dist release/v3.X-weapp/
cp project.config.json project.private.config.json release/v3.X-weapp/
cd release
zip -rq sbti-miniapp-v3.X-weapp-20260501.zip v3.X-weapp
cd ..

# 6. 记录变更日志
echo "v3.X 发布日志" >> RELEASE_NOTES.md
```

---

## 快速命令

```bash
# 查看所有版本标签
git tag

# 查看特定版本详情
git show v3.0

# 查看版本之间的差异
git diff v2.4 v3.0

# 从特定版本创建新分支
git checkout -b fix/v3.0-hotfix v3.0

# 快速回退（不保留历史）
git reset --hard v2.4

# 快速回退（保留历史记录）
git revert -n v3.0..HEAD  # 回退 v3.0 之后的所有提交
```

---

## 版本命名规范

**格式**：`v<MAJOR>.<MINOR>`  
**示例**：v3.0, v3.1, v4.0

| 场景 | 更新类型 | 示例 |
|-----|--------|------|
| 新功能、内容扩充 | MINOR +1 | v2.4 → v2.5 |
| 重大功能/架构调整 | MAJOR +1 | v2.X → v3.0 |
| Bug 修复 | 补丁号 | v3.0 → v3.0.1 |

---

## 常见问题

**Q：如何检查某个文件是在哪个版本改动的？**

```bash
git log --oneline -- src/pages/result/index.tsx
```

**Q：如何看特定版本的完整代码？**

```bash
# 切换到 v2.4 版本的代码
git show v2.4:src/pages/result/index.tsx

# 或者整个项目
git checkout v2.4 -- .
npm run build:weapp
```

**Q：如何撤销某个版本的部分改动？**

```bash
# 撤销某个文件在 v3.0 中的改动
git show v2.4:src/data/topicQuestions.ts > src/data/topicQuestions.ts
git add src/data/topicQuestions.ts
git commit -m "Revert topicQuestions to v2.4"
```

---

**最后更新**：2026-05-01  
**维护者**：SBTI 开发团队  
**反馈**：如发现版本问题，请更新本文档
