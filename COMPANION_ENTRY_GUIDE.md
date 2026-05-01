# 🎯 AI 陪聊功能 - 入口指南

**更新时间**：2026-05-01  
**功能状态**：✅ 已集成到结果页面  
**入口位置**：测试结果页 → "陪练讲解"卡片  

---

## 📍 功能入口路径

```
用户完成测试
    ↓
进入结果页面
    ↓
向下滑动到"陪练讲解"卡片 (AI 教练)
    ↓
点击"开始陪练"按钮
    ↓
初始化会话（后端创建 code）
    ↓
跳转到 Web-view 页面
    ↓
加载 H5 AI 陪聊应用
    ↓
AI 教练根据你的测试结果进行实战演练
```

---

## 🎨 UI 界面

在结果页面，陪聊卡片位置：

```
┌─────────────────────────────────────┐
│     15维度解析                       │
│  (15 个维度图表...)                  │
├─────────────────────────────────────┤
│     猜你喜欢                         │
│  (推荐其他测试卡片...)              │
├─────────────────────────────────────┤
│                                     │
│  🎯 陪练讲解  ← 新增卡片            │
│                                     │
│  AI 教练根据你的测试结果，           │
│  帮你实战演练沟通技巧               │
│                                     │
│     [开始陪练]                      │
│                                     │
├─────────────────────────────────────┤
│  🎨 生成海报   晒给朋友   重新测试   │
│  (底部按钮栏)                       │
└─────────────────────────────────────┘
```

---

## 🔌 技术集成详情

### 已集成的文件改动

| 文件 | 改动内容 |
|-----|--------|
| **src/pages/result/index.tsx** | + 导入 companionSessionManager + handleEnterCompanion 函数 + mapSbtiToRole 映射 + 陪聊卡片 JSX |
| **src/pages/result/index.scss** | + 陪聊卡片样式（companion-card 类） |
| **src/app.tsx** | + 导入 companionSessionManager + 初始化（init 调用） |
| **src/app.config.ts** | + 注册 pages/companion/index 路由 |

### 核心功能代码

#### 1. SBTI 类型到陪聊角色的映射

```typescript
const mapSbtiToRole = (sbtiType: string): string => {
  const roleMap: Record<string, string> = {
    'ISFJ': 'warm',     // 守护者 → 温暖陪练
    'ISFP': 'warm',     // 探险家 → 温暖陪练
    'INFJ': 'steady',   // 倡导者 → 稳健陪练
    'INFP': 'steady',   // 调解者 → 稳健陪练
    'ISTJ': 'direct',   // 后勤官 → 直接陪练
    'ISTP': 'direct',   // 鉴赏家 → 直接陪练
    'INTJ': 'direct',   // 指挥官 → 直接陪练
    'INTP': 'spark',    // 逻辑家 → 活跃陪练
    'ESFJ': 'warm',     // 执政官 → 温暖陪练
    'ESFP': 'spark',    // 表演者 → 活跃陪练
    'ENFJ': 'steady',   // 主人公 → 稳健陪练
    'ENFP': 'spark',    // 竞选者 → 活跃陪练
    'ESTJ': 'direct',   // 总经理 → 直接陪练
    'ESTP': 'spark',    // 企业家 → 活跃陪练
    'ENTJ': 'direct',   // 总司令 → 直接陪练
    'ENTP': 'spark',    // 辩手 → 活跃陪练
  }
  return roleMap[sbtiType] || 'warm'
}
```

#### 2. 点击处理函数

```typescript
const handleEnterCompanion = async () => {
  // 1. 显示加载中
  Taro.showLoading({ title: '召唤陪练中...' })

  try {
    // 2. 根据 SBTI 类型生成陪聊参数
    const companionParams: CompanionParams = {
      roleHint: mapSbtiToRole(result.finalType.code),  // 角色（warm/steady/spark/direct）
      sceneHint: 'ice-break',                           // 场景（破冰）
      goal: '提升沟通表达效果',                          // 目标
      nickname: '同学',                                 // 昵称
    }

    // 3. 调用后端创建 code（需要 API）
    const h5Url = await companionSessionManager.createSession(companionParams)

    // 4. 导航到 Web-view 页面
    Taro.navigateTo({
      url: `/pages/companion/index?url=${encodeURIComponent(h5Url)}`
    })

  } catch (error) {
    // 5. 错误处理
    Taro.showToast({
      title: error instanceof Error ? error.message : '陪练召唤失败',
      icon: 'none'
    })
  } finally {
    Taro.hideLoading()
  }
}
```

---

## ⚙️ 配置要求

### 1. 后端 API 配置

在 `src/app.tsx` 中初始化：

```typescript
companionSessionManager.init({
  apiUrl: 'https://api.your-domain.com',      // ← 改为你的后端地址
  h5BaseUrl: 'https://mvp.your-domain.com',   // ← 改为你的 H5 地址
})
```

**需要实现的后端接口**：
- `POST /api/session/create-code` — 创建一次性 code
- `POST /api/session/exchange` — 交换 sessionId

详见：[COMPANION_INTEGRATION.md](COMPANION_INTEGRATION.md)

### 2. 小程序白名单配置

在微信小程序后台配置：

| 类型 | 域名 |
|-----|------|
| 业务域名 | `https://mvp.your-domain.com` |
| Request 合法域名 | `https://api.your-domain.com` |

### 3. 本地测试

```bash
# 重新构建（已自动完成）
npm run build:weapp

# 在微信开发工具中：
1. 重新打开项目
2. 完成一个测试
3. 查看结果页面
4. 向下滑动到"陪练讲解"卡片
5. 点击"开始陪练"
```

---

## 🧪 测试流程

### 无后端的本地测试（验证 UI）

✅ **已完成**：UI 和路由都已集成

```
1. npm run build:weapp
2. 完成测试 → 查看结果页
3. ✅ 看到"陪练讲解"卡片
4. ✅ 点击"开始陪练"
5. ❌ 会出现后端错误（正常，因为没有配置 API）
```

### 完整端到端测试（需要后端）

⏳ **待完成**：需要后端 API 实现

```
1. 部署后端 API
2. 配置小程序白名单
3. 部署 H5 陪聊应用
4. 在 app.tsx 中配置正确的 API 和 H5 地址
5. npm run build:weapp && 重新导入微信工具
6. 完成测试 → 点击陪练 → 看到 H5 应用
```

---

## 📋 SBTI 类型与陪聊角色映射

| SBTI 类型 | 名称 | 陪聊角色 | 特点 |
|---------|-----|--------|------|
| ISFJ | 守护者 | warm（温暖） | 温心、体贴 |
| ISFP | 探险家 | warm（温暖） | 亲切、友善 |
| INFJ | 倡导者 | steady（稳健） | 深思、专注 |
| INFP | 调解者 | steady（稳健） | 真挚、诚恳 |
| ISTJ | 后勤官 | direct（直接） | 高效、明确 |
| ISTP | 鉴赏家 | direct（直接） | 务实、精准 |
| INTJ | 指挥官 | direct（直接） | 决断、逻辑 |
| INTP | 逻辑家 | spark（活跃） | 探索、创新 |
| ESFJ | 执政官 | warm（温暖） | 热情、主动 |
| ESFP | 表演者 | spark（活跃） | 活力、热情 |
| ENFJ | 主人公 | steady（稳健） | 鼓舞、协调 |
| ENFP | 竞选者 | spark（活跃） | 充满活力、热情 |
| ESTJ | 总经理 | direct（直接） | 领导、有力 |
| ESTP | 企业家 | spark（活跃） | 冒险、快速 |
| ENTJ | 总司令 | direct（直接） | 坚定、果敢 |
| ENTP | 辩手 | spark（活跃） | 聪慧、灵活 |

---

## 🎯 下一步

### 立即可做

- ✅ 在结果页看到陪聊卡片
- ✅ 点击体验 UI 交互

### 需要配置的

- ⏳ 配置后端 API（需要 Node.js/Express + Redis）
- ⏳ 配置小程序白名单（微信小程序后台）
- ⏳ 部署 H5 陪聊应用（需要 React/Vue SPA）
- ⏳ 更新 app.tsx 中的 API 和 H5 地址

### 参考文档

- [COMPANION_INTEGRATION.md](COMPANION_INTEGRATION.md) — 完整集成指南
- [IMPORT_GUIDE.md](IMPORT_GUIDE.md) — 小程序导入教程
- [VERSION_HISTORY.md](VERSION_HISTORY.md) — 版本管理

---

## 🐛 常见问题

### Q：点击按钮出现错误怎么办？

**A**：这是正常的。需要后端 API 支持。检查：
1. 是否配置了 API 地址（src/app.tsx）
2. 后端是否运行（POST /api/session/create-code）
3. 小程序白名单是否配置

### Q：为什么陪聊卡片不显示？

**A**：检查构建是否完成：
```bash
npm run build:weapp
```
然后在微信工具中刷新。

### Q：能在本地测试吗？

**A**：可以看到 UI，但 API 调用会失败。需要后端 API 才能完整测试。

---

**集成完成时间**：2026-05-01  
**集成状态**：✅ 完成  
**当前版本**：v3.0  
**后端准备状态**：⏳ 待实现
