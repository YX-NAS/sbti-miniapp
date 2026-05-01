# SBTI 小程序 - AI 陪聊集成指南

## 快速开始

### 第 1 步：初始化陪聊管理器

在 `src/app.tsx` 中添加初始化代码：

```typescript
import { companionSessionManager } from './utils/companionSession'

function App() {
  useEffect(() => {
    // 初始化陪聊会话管理器
    companionSessionManager.init({
      apiUrl: 'https://api.your-domain.com', // 改为你的后端 API 地址
      h5BaseUrl: 'https://mvp.your-domain.com', // 改为你的 H5 应用地址
    })
  }, [])

  return (
    <View className="app">
      {/* 原有内容 */}
    </View>
  )
}
```

### 第 2 步：在结果页增加陪聊按钮

编辑 `src/pages/result/index.tsx`，在结果卡下方增加按钮：

```typescript
import { companionSessionManager, type CompanionParams } from '../../utils/companionSession'
import { trackEvent } from '../../utils/analytics'

export default function ResultPage() {
  // 原有代码...

  const handleEnterCompanion = async () => {
    console.log('[Result] Entering companion mode')
    
    Taro.showLoading({
      title: '召唤陪练中...',
      mask: true,
    })

    try {
      // 从测试结果映射到陪聊参数
      const companionParams: CompanionParams = {
        roleHint: mapSbtiToRole(result.finalType.code), // 从 SBTI 结果类型映射
        sceneHint: 'ice-break', // 或根据场景动态选择
        goal: '提升沟通表达效果',
        nickname: userNickname || '同学',
      }

      // 调用陪聊管理器创建会话
      const h5Url = await companionSessionManager.createSession(companionParams)

      trackEvent('companion_session_created', {
        sbtiType: result.finalType.code,
        h5Url,
      })

      // 导航到陪聊页面
      Taro.navigateTo({
        url: `/pages/companion/index?url=${encodeURIComponent(h5Url)}`,
        fail: (err) => {
          console.error('[Result] Navigate failed:', err)
          Taro.showToast({
            title: '打开陪聊页面失败',
            icon: 'none',
            duration: 2000,
          })
        },
      })

    } catch (error) {
      console.error('[Result] Companion error:', error)
      Taro.showToast({
        title: error instanceof Error ? error.message : '陪练召唤失败',
        icon: 'none',
        duration: 2000,
      })
    } finally {
      Taro.hideLoading()
    }
  }

  // 在结果卡下方添加按钮
  return (
    <View>
      {/* 原有结果卡内容 */}
      
      <View style={{ marginTop: '20px', padding: '0 12px' }}>
        <Button
          onClick={handleEnterCompanion}
          style={{
            width: '100%',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: '#FF6B9D',
            color: 'white',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
          }}
        >
          🎯 陪练讲解
        </Button>
        <View
          style={{
            fontSize: '12px',
            color: '#999',
            marginTop: '8px',
            textAlign: 'center',
          }}
        >
          根据你的测试结果，AI 教练将帮你实战演练沟通技巧
        </View>
      </View>
    </View>
  )
}

/**
 * 将 SBTI 结果类型映射到陪聊角色 hint
 * 根据你的映射关系修改
 */
function mapSbtiToRole(sbtiType: string): string {
  const roleMap: Record<string, string> = {
    'ISFJ': 'warm',     // 守护者 → 温暖陪练
    'INFJ': 'steady',   // 倡导者 → 稳健陪练
    'ENFP': 'spark',    // 竞选者 → 活跃陪练
    'ENTJ': 'direct',   // 指挥官 → 直接陪练
    // 添加更多映射...
  }
  return roleMap[sbtiType] || 'warm'
}
```

### 第 3 步：配置小程序页面注册

编辑 `src/app.config.ts`，在 `pages` 数组中添加陪聊页面：

```typescript
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/result/index',
    'pages/companion/index',  // 新增
    // 其他页面...
  ],
  // 其他配置...
})
```

### 第 4 步：配置小程序白名单

登录微信小程序后台 → 开发 → 开发设置：

| 类型 | 域名 |
|------|------|
| 业务域名 | `https://mvp.your-domain.com` |
| Request 合法域名 | `https://api.your-domain.com` |

### 第 5 步：后端接口实现

你的后端需要实现两个接口：

#### `POST /api/session/create-code`

**请求体**：
```json
{
  "source": "sbti-miniapp",
  "roleHint": "warm",
  "sceneHint": "ice-break",
  "goal": "提升沟通表达效果"
}
```

**响应 200**：
```json
{
  "code": "wx-abc123...",
  "expiresIn": 300
}
```

**实现参考**（Node.js Express）：

```javascript
const crypto = require('crypto');
const redis = require('redis');

app.post('/api/session/create-code', async (req, res) => {
  try {
    const { source, roleHint, sceneHint, goal } = req.body;

    // 验证必填字段
    if (!source || !roleHint || !sceneHint || !goal) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    // 生成一次性 code
    const code = 'wx-' + crypto.randomBytes(12).toString('hex');
    const expiresIn = 300;

    // 存储到 Redis
    await redisClient.setex(
      `session:code:${code}`,
      expiresIn,
      JSON.stringify({ source, roleHint, sceneHint, goal, used: false })
    );

    res.json({ code, expiresIn });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### `POST /api/session/exchange`

**请求体**：
```json
{
  "code": "wx-abc123...",
  "source": "miniapp"
}
```

**响应 200**：
```json
{
  "sessionId": "sess_xyz789",
  "nickname": "同学"
}
```

**实现参考**（Node.js Express）：

```javascript
app.post('/api/session/exchange', async (req, res) => {
  try {
    const { code, source } = req.body;

    // 从 Redis 获取 code 数据
    const codeDataStr = await redisClient.get(`session:code:${code}`);
    if (!codeDataStr) {
      return res.status(404).json({ error: 'code_not_found' });
    }

    const codeData = JSON.parse(codeDataStr);
    if (codeData.used) {
      return res.status(400).json({ error: 'code_already_used' });
    }

    // 生成 sessionId
    const sessionId = 'sess_' + crypto.randomBytes(6).toString('hex');

    // 标记为已使用
    codeData.used = true;
    await redisClient.setex(`session:code:${code}`, 300, JSON.stringify(codeData));

    // 存储 session 数据
    await redisClient.setex(
      `session:${sessionId}`,
      86400,
      JSON.stringify({ ...codeData, sessionId, exchangedAt: Date.now() })
    );

    res.json({ sessionId, nickname: '同学' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 测试清单

- [ ] 小程序后台白名单已配置
- [ ] 后端 API 可访问
- [ ] H5 应用已部署到 HTTPS
- [ ] 在小程序中打开结果页
- [ ] 点击"陪练讲解"按钮
- [ ] 预期：加载后端 code 成功
- [ ] 预期：Web-view 打开 H5 应用
- [ ] 预期：H5 应用能接收到 code 和角色参数

---

## 故障排查

| 问题 | 原因 | 解决方案 |
|-----|------|--------|
| 点击按钮无反应 | 初始化不完整或 API URL 错误 | 检查 `app.tsx` 初始化配置 |
| "陪练召唤失败" | 后端接口不可达 | 检查 API URL、网络连接、后端服务状态 |
| Web-view 加载失败 | 白名单未配置或 H5 URL 错误 | 检查小程序后台白名单配置 |
| H5 页面空白 | H5 应用无法解析参数 | 检查 URL 参数是否正确拼装 |

---

## 文件清单

已为你创建的文件：

```
src/
├── pages/
│   └── companion/
│       ├── index.tsx          # Web-view 页面组件
│       ├── index.scss         # 样式
│       └── index.config.ts    # 页面配置
└── utils/
    └── companionSession.ts    # 陪聊会话管理工具
```

---

## 下一步

1. 更新 `app.tsx` 的初始化配置（API 和 H5 域名）
2. 修改 `src/pages/result/index.tsx`，集成陪聊按钮和逻辑
3. 后端实现两个接口
4. 配置小程序后台白名单
5. 测试完整流程
