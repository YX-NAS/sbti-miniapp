# v2.5 版本主题置顶实现指南

## 目标
每个版本的主题内容应该显著突出，通过置顶展示（如 v2.5 的海洋系列）。

## 当前实现

### 1. 数据源配置
位置: `src/data/contentConfig.ts`

```typescript
hotTests: [
  {
    id: 'hot-ocean',           // ← v2.5 主题（置顶）
    emoji: '🌊',
    title: '海洋生物 Ti 测试',
    desc: '测测你是海豚型、章鱼型、海龟型还是水母型',
    tag: 'v2.5主题',           // ← 版本标签
    color: '#1AA7EC',
    path: '/pages/test-by-type/index?type=ocean',
    visible: true,
  },
  // 其他测试项...
]
```

### 2. 前端展示
位置: `src/pages/index/index.tsx` (206-227 行)

```tsx
<View className="hot-test-list">
  {pageContent.hotTests.map(item => (
    <View key={item.id} className="hot-test-card">
      {/* 按顺序渲染，第一项自动成为顶部位置 */}
    </View>
  ))}
</View>
```

### 3. 过滤与排序
位置: `src/utils/contentConfig.ts` (66-72 行)

```typescript
export function getHomePageContent() {
  const config = getContentAdminConfig()
  return {
    hotTests: config.hotTests.filter(item => item.visible),
    // 保持原始数组顺序（ocean 已在第一位）
  }
}
```

## 版本升级流程

### 下一个版本（如 v2.6 天空系列）
1. 在 `contentConfig.ts` 中，将新的天空系列测试移到 `hotTests` 数组最前面：
```typescript
hotTests: [
  {
    id: 'hot-sky',
    emoji: '☁️',
    title: '天空生物 Ti 测试',
    tag: 'v2.6主题',
    // ...
  },
  {
    id: 'hot-ocean',    // v2.5 降级到第二位
    // ...
  },
  // 其他项...
]
```

2. 更新版本标签：
   - 新主题：`tag: 'v2.6主题'`
   - 前版本：`tag: '动物TI'` （降级为普通标签）

3. 重新构建：
```bash
npm run build:weapp
git add .
git commit -m "feat: v2.6 天空系列置顶 - 移除海洋系列主题标签"
```

## 访问方式

### 用户入口
1. **首页热门** - "🔥 本周热门" 区域第一卡片
2. **分享标签** - 版本标签清晰标注当前主题
3. **发现页** - 测试中心中也优先展示新主题

### 管理员更新
1. 编辑 `src/data/contentConfig.ts`
2. 调整 `hotTests` 数组顺序
3. 重新构建并发布

## 验证方式

### 本地验证
```bash
# 构建后查看输出
npm run build:weapp

# 在开发工具中导入 release/v3.0-weapp 目录
# 首页热门区域应显示：
# 🌊 海洋生物 Ti 测试 [v2.5主题]  <- 顶部位置
```

### 灰度部署
1. 新建分支：`git checkout -b feature/v2.6-sky-series`
2. 更新配置并测试
3. 发起 MR 前进行截图验证

## 相关文件
- 配置数据: `src/data/contentConfig.ts`
- 首页代码: `src/pages/index/index.tsx`
- 工具函数: `src/utils/contentConfig.ts`
- 样式文件: `src/pages/index/index.scss`

## 注意事项
- 置顶操作只需修改数组顺序，无需修改其他代码
- `visible: true` 确保内容显示，`false` 则隐藏
- 标签 `tag` 字段用于标识版本，用户可见
- 每次版本更新后应该提交 Git，便于版本回退
