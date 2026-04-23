# SBTI+ 小程序版本规划文档

> 产品定位：面向学生群体的星座人格实验室  
> 核心价值：用趣味测试 + 社交传播，让学生找到"最懂自己的人"

---

## v1.0 框架与基础服务（已上线）

**目标**：跑通核心流程，建立产品框架

### 功能清单

| 模块 | 功能 | 状态 |
|------|------|------|
| 首页 | 5大功能入口 + SBTI介绍卡片 | ✅ 已完成 |
| 星座人格测试 | 40题SBTI测试 + 16型结果分析 | ✅ 已完成 |
| 室友匹配 | 两位室友MBTI匹配度分析 | ✅ 已完成 |
| CP配对 | 两人MBTI合盘分析 | ✅ 已完成 |
| 每日测试 | 每天一道精选测试题 + 四选一独立结果 | ✅ 已完成 |
| 学习风格测试 | 4种学习风格测试 | ✅ 已完成 |
| 分享机制 | 结果/报告分享到微信 | ✅ 已完成 |

### 技术架构

```
小程序前端（纯前端，无后端API）
├── React + Taro 4.x
├── 本地存储（Taro.getStorageSync）
└── 测试结果纯前端计算
```

### 数据存储

- 用户答题数据：本地缓存
- 测试结果：本地存储
- 无云端用户体系

### 不足与待改进

- 题库数量有限（性格题17题 + 学习风格4题）
- 每日测试题偏少
- 无分享图设计，传播力弱
- 无用户历史记录（换手机丢失）
- 无运营数据分析

---

## v2.0 内容扩充与功能增强

**目标**：丰富内容质量，优化用户体验，增加传播裂变能力

### 新增 / 优化功能

#### 2.1 题库扩充

| 类型 | 新增数量 | 特点 |
|------|---------|------|
| 性格测试题 | +30题 | 贴近大学生活场景（选课/社团/恋爱/室友） |
| 情感测试题 | +20题 | 暗恋/恋爱/分手/复合等学生情感场景 |
| 趣味测试题 | +20题 | 兴趣/习惯/口味等轻松话题 |
| 学习风格题 | +16题 | 考前焦虑/复习方法/时间管理等 |
| 职场提前测试 | +15题 | 实习/面试/职场人际（准毕业生） |

**每道题保持4个选项各自对应独立结果**

#### 2.2 分享图设计

```
┌─────────────────────────┐
│   [星座人格实验室]        │
│                         │
│   ♈ 你是 ISFJ 守护者 ♈   │
│                         │
│   温柔体贴的照顾者        │
│   室友眼中的最佳倾听者     │
│                         │
│   [生成我的专属报告]      │
│                         │
│   扫码测试 →             │
└─────────────────────────┘
```

- 每种测试结果生成专属分享图
- 带小程序码，方便传播
- 结果页一键保存/分享

#### 2.3 用户历史记录

| 功能 | 说明 |
|------|------|
| 测试历史 | 保存所有测试记录，换手机不丢失 |
| 历史报告 | 可重新查看历史测试结果 |
| 对比功能 | 室友/CP匹配记录对比 |

#### 2.4 星座内容扩充

| 内容 | 说明 |
|------|------|
| 每日运势 | 12星座每天的运势解读（感情/学业/财运） |
| 每周星座排行 | 本周最旺星座/最需注意星座 |
| 月度星座总结 | 月度星座运势总览 |

#### 2.5 新增趣味功能

| 功能 | 说明 |
|------|------|
| 室友默契度测试 | 两人答题对比，看默契程度 |
| 一周运势测试 | 趣味答题，生成下周运势 |
| 期末运势测试 | 考前趣味测试，调剂心情 |
| 开学季特别测试 | 新生专属：大学四年规划测试 |

### v2.0 技术需求

```
新增后端服务（轻量）
├── Node.js API
│   ├── 用户体系（微信授权登录）
│   ├── 历史记录云同步
│   ├── 星座运势内容API
│   └── 运营数据上报
├── MySQL 数据库
└── 群晖NAS备份
```

### v2.0 数据结构

```sql
-- 用户表（轻量）
users:
  id, openid, nickname, avatar_url,
  created_at, last_login_at

-- 测试记录表
test_records:
  id, user_id, test_type, test_result,
  options_json, created_at

-- 星座运势表（后台管理）
horoscope:
  id, zodiac_id, date, type, content, created_at

-- 题目表（后台管理）
questions:
  id, type, type_emoji, question,
  options_json, created_at, status

-- 每日运势记录
daily_horoscope_cache:
  id, date, cache_json, updated_at
```

### v2.0 运营数据指标

| 指标 | 说明 |
|------|------|
| DAU / MAU | 日活/月活用户数 |
| 测试完成率 | 各测试的完成转化率 |
| 分享率 | 分享用户占总用户比例 |
| 留存率 | 次日/7日/30日留存 |
| 各功能使用排行 | 用户偏好功能 |

---

## v3.0 付费中心与商业化

**目标**：建立商业化基础，实现小程序变现

### 页面架构

```
付费中心（独立Tab）
├── 首页Banner（推广活动）
├── 匿名告白信
│   ├── 写告白信
│   ├── 我的发件箱
│   └── 收件通知
├── 云端存储
│   ├── 开通会员
│   ├── 存储空间
│   └── 历史记录
├── 报告解锁
│   ├── 性格完整报告 ¥6
│   ├── 深度分析报告 ¥9.9
│   └── 定制化建议 ¥12
├── 特色功能
│   ├── 自定义昵称 ¥3
│   ├── 专属头像框 ¥3~6
│   ├── 好友PK对战 ¥1/次
│   └── 悄悄话信箱 ¥5/月
└── 会员中心
    ├── 会员权益说明
    ├── 开通记录
    └── 续费管理
```

### 付费功能详情

#### 3.1 匿名告白信

```
功能说明：
- 用户支付 ¥2~3 可发送一封匿名告白信给指定好友
- 好友在"我的信"中查看，无法知道发送者身份
- 好友可选择"回复"或"假装没看见"
- 发信人有3次猜测机会，猜对送小礼品

技术实现：
- 内容加密存储（后台也看不到原文）
- 10天内未读自动退款
- 每天每人限发3封

定价：¥2/封 或 ¥5/3封
```

#### 3.2 云端历史记录存储

```
功能说明：
- 开通后所有测试记录自动同步云端
- 换手机不丢失，可随时查看
- 支持导出数据为PDF

定价：
- 个人版：¥6/年
- 家庭版（3个账号）：¥15/年

注意：需对接微信支付
```

#### 3.3 完整分析报告

```
功能说明：
- 免费版：基础性格描述（200字）
- 付费版：完整16页深度报告（4000字+）

报告内容包括：
1. 性格全景分析
2. 优势与短板
3. 学习风格建议
4. 室友相处指南
5. CP匹配深度解读
6. 职场发展建议
7. 压力应对方式
8. 成长规划路线图

定价：¥6/份 或 ¥9.9/深度版
```

#### 3.4 悄悄话信箱

```
功能说明：
- 每天收到一条专属星座悄悄话
- 内容个性化（结合用户星座+日期）
- 可选择"鼓励型"或"调侃型"风格

定价：¥5/月 或 ¥30/年
```

#### 3.5 好友PK对战

```
功能说明：
- 好友之间发起匹配对战
- 每人答5道题，系统判定谁更契合
- 获胜者获得"战神"标识（有效期7天）

定价：¥1/次
```

#### 3.6 会员体系

```
普通会员（免费）：
- 每日免费测试1次
- 基础分享功能
- 查看历史记录（本地）

星际会员（¥6/月）：
- 每日免费测试3次
- 云端历史记录
- 解锁全部报告（9折）
- 专属头像框
- 悄悄话信箱基础版

银河会员（¥15/月）：
- 不限测试次数
- 云端历史记录
- 解锁全部报告免费
- 专属头像框
- 悄悄话信箱高级版
- 优先体验新功能
```

### v3.0 技术架构

```
┌────────────────────────────────────────┐
│              小程序前端                  │
└──────────────┬────────────────────────┘
               │ HTTPS
               ▼
┌────────────────────────────────────────┐
│         4核8G 服务器（后台API）           │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Node.js API  │  │  React后台    │   │
│  │  付费/订单    │  │  内容管理    │   │
│  └──────────────┘  └──────────────┘   │
│         │                               │
│         ▼                               │
│  ┌──────────────┐                      │
│  │   MySQL      │                      │
│  │  订单/用户    │                      │
│  └──────────────┘                      │
└──────────────┬──────────────────────────┘
               │ 每日备份
               ▼
┌────────────────────────────────────────┐
│            群晖 NAS                      │
│     数据库备份 / 文件存储                 │
└────────────────────────────────────────┘
```

### v3.0 数据库表结构

```sql
-- 会员表
vip_members:
  id, openid, vip_level, 
  expire_at, created_at, updated_at

-- 付费订单表
orders:
  id BIGINT PRIMARY KEY,
  order_no VARCHAR(64) UNIQUE,    -- 订单号
  openid VARCHAR(128),            -- 用户openid
  product_type VARCHAR(32),        -- product_letter/analyze_report/vip/storage
  product_id VARCHAR(64),         -- 具体商品ID
  amount DECIMAL(10,2),           -- 金额（元）
  status TINYINT,                 -- 0待支付 1已支付 2已退款 3已关闭
  transaction_id VARCHAR(128),    -- 微信支付订单号
  created_at DATETIME,
  paid_at DATETIME,
  updated_at DATETIME

-- 匿名告白信
anonymous_letters:
  id BIGINT PRIMARY KEY,
  sender_openid VARCHAR(128),
  receiver_openid VARCHAR(128),
  receiver_name VARCHAR(64),      -- 收信人昵称（备注）
  content_encrypted TEXT,         -- 加密内容（AES）
  is_read TINYINT DEFAULT 0,      -- 是否已读
  is_replied TINYINT DEFAULT 0,   -- 是否回复过
  sender_guesses INT DEFAULT 3,   -- 剩余猜测次数
  sender_guessed_right TINYINT,   -- 猜对了？
  created_at DATETIME,
  read_at DATETIME,
  expired_at DATETIME              -- 过期时间（10天）

-- 云端历史记录
cloud_records:
  id BIGINT PRIMARY KEY,
  openid VARCHAR(128),
  test_type VARCHAR(32),
  test_result JSON,
  options_json JSON,
  created_at DATETIME,
  synced_at DATETIME

-- 用户表（增强）
users:
  id BIGINT PRIMARY KEY,
  openid VARCHAR(128) UNIQUE,
  nickname VARCHAR(64),
  avatar_url VARCHAR(256),
  custom_nickname VARCHAR(64),    -- 自定义昵称
  avatar_frame VARCHAR(32),       -- 头像框
  zodiac VARCHAR(16),             -- 主星座
  vip_level TINYINT DEFAULT 0,
  vip_expire_at DATETIME,
  created_at DATETIME,
  updated_at DATETIME

-- 星座运势内容（后台管理）
horoscope_content:
  id BIGINT PRIMARY KEY,
  zodiac_id TINYINT,              -- 1-12
  date_type VARCHAR(8),           -- daily/weekly/monthly
  target_date DATE,
  love_score TINYINT,             -- 感情评分 1-5
  study_score TINYINT,
  career_score TINYINT,
  wealth_score TINYINT,
  content TEXT,                  -- 运势正文
  lucky_color VARCHAR(16),
  lucky_number VARCHAR(8),
  tags VARCHAR(128),             -- 幸运标签
  created_at DATETIME,
  updated_at DATETIME

-- 题目表（后台管理）
questions:
  id BIGINT PRIMARY KEY,
  type VARCHAR(32),              -- char/love/study/fun
  type_emoji VARCHAR(8),
  question TEXT,
  options_json JSON,              -- [{label,text,result:{title,desc,emoji}}]
  status TINYINT DEFAULT 1,       -- 1上架 0下架
  daily_available TINYINT DEFAULT 1,  -- 是否可用于每日测试
  created_at DATETIME,
  updated_at DATETIME

-- 管理员表
admins:
  id BIGINT PRIMARY KEY,
  username VARCHAR(32) UNIQUE,
  password_hash VARCHAR(128),
  role TINYINT,                  -- 1超级管理员 2内容运营
  created_at DATETIME
```

### v3.0 微信支付接入

```javascript
// 发起支付（Node.js 示例）
async function createPayment(openid, productType, productId, amount) {
  const orderNo = `ORD${Date.now()}${Math.random().toString(36).slice(2,8)}`
  
  // 调用微信支付统一下单
  const payParams = await wxPay.createUnifiedOrder({
    openid,
    body: 'SBTI+分析报告',
    out_trade_no: orderNo,
    total_fee: amount * 100, // 分
    trade_type: 'JSAPI',
    notify_url: 'https://api.example.com/pay/notify'
  })
  
  return payParams // 返回给小程序调起支付
}
```

### v3.0 运营策略

| 策略 | 说明 |
|------|------|
| **首单优惠** | 第一件商品5折，引导首次付费 |
| **邀请免费** | 邀请1位好友，双方得1次免费测试 |
| **节日活动** | 情人节/520/七夕，限定CP功能半价 |
| **限时抢购** | 每月1日，指定报告¥1秒杀 |
| **会员日** | 每月15日，续费8折 |

---

## 版本里程碑

| 版本 | 目标 | 重点 | 预计周期 |
|------|------|------|---------|
| **v1.0** | 核心功能上线 | 跑通流程，建立框架 | ✅ 已完成 |
| **v2.0** | 内容扩充 + 传播优化 | 题库扩充、分享图、基础后端 | 2~4周 |
| **v3.0** | 商业化 | 付费中心、会员体系、微信支付 | 4~6周 |

---

## 待确认事项

1. **微信支付资质**：是否已有企业/个体户营业执照？
2. **内容来源**：星座运势内容是否自建还是爬取/购买？
3. **匿名信合规性**：匿名内容需考虑敏感词过滤机制
4. **iOS支付限制**：虚拟商品付费需走苹果内购，建议区分平台定价

---

*文档版本：v1.0 创建于 2026-04-15*
