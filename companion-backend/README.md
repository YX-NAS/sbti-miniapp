# SBTI Companion Backend

这是给小程序陪聊入口提供最小会话能力的 Node.js 服务。

## 提供的接口

- `GET /healthz`
- `POST /api/session/create-code`
- `POST /api/session/exchange`
- `GET /api/session/:sessionId`

## 本地启动

```bash
cd companion-backend
npm install
npm start
```

或在仓库根目录执行：

```bash
npm run dev:companion-backend
```

## 环境变量

复制 `.env.example` 后按需注入：

- `PORT`: 服务监听端口，默认 `8080`
- `CODE_TTL_SECONDS`: 一次性 code 过期时间，默认 `300`
- `SESSION_TTL_SECONDS`: session 过期时间，默认 `86400`
- `ALLOWED_ORIGINS`: 允许的 H5 域名，多个用逗号分隔

## 对接小程序

将小程序中的 `apiUrl` 改为这个服务的公网 HTTPS 地址，例如：

```ts
companionSessionManager.init({
  apiUrl: 'https://api.your-domain.com',
  h5BaseUrl: 'https://mvp.your-domain.com',
})
```

然后在微信小程序后台配置：

- `Request 合法域名`: 后端 API 域名
- `业务域名`: H5 陪聊页域名