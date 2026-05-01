# 微信小程序导入指南 - v3.0

**包名**：`sbti-miniapp-v3.0-weapp-20260501.zip`  
**大小**：~275 KB  
**版本**：v3.0  
**日期**：2026-05-01  

---

## 📦 包内容

```
sbti-miniapp-v3.0-weapp-20260501.zip
└── v3.0-weapp/
    ├── dist/                          # 编译后的小程序代码
    │   ├── pages/                    # 所有页面（含新的 companion）
    │   ├── app.json                  # 小程序配置
    │   ├── app.js / app.wxss         # 应用主文件
    │   ├── common.js / common.wxss   # 公共代码
    │   └── ... 其他资源文件
    ├── project.config.json           # 项目配置（微信开发工具识别）
    └── project.private.config.json   # 私密配置
```

---

## 🚀 快速导入步骤

### 步骤 1：下载包文件

```bash
# 包位置
/Users/yaxun/SynologyDrive/日常工作/Github/NAS_Code/sbti-miniapp/release/
sbti-miniapp-v3.0-weapp-20260501.zip
```

### 步骤 2：打开微信开发工具

```
打开 → 微信开发者工具
```

### 步骤 3：导入项目

**菜单**：文件 → 打开项目（或 ⌘ + O）

| 字段 | 值 |
|-----|-----|
| **项目路径** | 选择解压后的 `v3.0-weapp` 文件夹 |
| **AppID** | 你的小程序 AppID（如没有保留空白） |
| **项目名称** | sbti-miniapp-v3.0 |

### 步骤 4：验证项目

```
☑️ 项目名称：sbti-miniapp-v3.0
☑️ 编译器版本：Webpack 5.91.0
☑️ 框架：Taro 4.2.0
☑️ 预览正常：可在模拟器看到首页
```

---

## 📋 导入前检查清单

### 环境要求

- [ ] 已安装微信开发者工具（最新版）
- [ ] 项目路径不包含中文或特殊字符
- [ ] 有至少 500 MB 的磁盘空间

### 配置要求

- [ ] 有微信小程序的 AppID（可选，为空时无法真机测试）
- [ ] 理解"开发版"和"体验版"的区别

---

## 🎯 导入后立即可做

### 1️⃣ 预览首页

```
模拟器 → 点击首页 → 查看以下功能：
✅ 海洋系列卡片（首页热门、置顶）
✅ 各个测试中心
✅ 用户个人页面
```

### 2️⃣ 测试海洋系列

```
首页 → 热门测试 → 海洋生物 Ti 测试
或
测试中心 → 海洋生物 Ti 测试
```

**预期结果**：
- 4 题快速测试
- 完成后显示 4 种海洋生物之一（海豚、章鱼、海龟、水母）

### 3️⃣ 测试陪聊功能（需要后端）

```
任何测试结果 → "🎯 陪练讲解"按钮
```

**预期结果**：
- 加载后端会话
- Web-view 打开 H5 陪聊应用

**注意**：此功能需要后端 API 正常运行

---

## 🔧 常见问题

### Q1：导入后项目无法编译

**症状**：出现 "Webpack compilation failed" 错误

**解决方案**：
```bash
# 清除旧缓存
rm -rf .umi dist

# 重新编译
npm install
npm run build:weapp

# 重新打包导入包
# 参考本指南最后的"重新生成包"部分
```

### Q2：首页看不到海洋系列

**症状**：首页不显示海洋生物卡片

**排查步骤**：
1. 清除小程序缓存：模拟器 → 右键 → 清除所有数据
2. 重新打开首页
3. 检查浏览器控制台是否有错误

**如果仍无显示**：
```bash
# 可能需要回到 v2.4 版本检查
bash scripts/rollback-to-v2.4.sh
```

### Q3：陪聊按钮报错

**症状**：点击"陪练讲解"后显示错误

**原因**：后端 API 未配置或不可用

**解决方案**：
1. 检查 `src/app.tsx` 中的陪聊初始化配置
2. 确保后端 API 地址正确
3. 配置小程序白名单域名

详见：[COMPANION_INTEGRATION.md](COMPANION_INTEGRATION.md)

### Q4：需要回到 v2.4 版本

**快速方案**：
```bash
# 使用自动脚本
bash scripts/rollback-to-v2.4.sh

# 然后重新生成 v2.4 导入包
# 或直接导入已有的：
# /release/sbti-miniapp-v2.4-weapp-20260501.zip
```

---

## 📤 提交/上传小程序

### 前提条件

```
✅ 已取得微信小程序 AppID
✅ 已配置 AppID 到项目
✅ 已通过本地预览测试
✅ 已配置所有必需的白名单域名
```

### 上传流程

**微信开发工具**：

```
1. 版本管理 → 上传
2. 填写版本号和更新说明
   版本号：3.0
   更新说明：
   - 新增海洋生物 Ti 测试
   - 新增 AI 陪聊功能
   - 增强推荐系统
3. 确认上传
```

**微信小程序后台**：

```
1. 登录小程序管理后台
2. 版本管理 → 开发版本
3. 找到刚上传的 3.0 版本
4. 点击"提交审核"
5. 等待腾讯审核（通常 1-3 个工作日）
6. 审核通过后在小程序后台"发布"即可
```

### 审核检查清单

- [ ] 功能完整无报错
- [ ] 隐私政策已配置
- [ ] 第三方服务已备案（如云函数）
- [ ] 所有权限申请合理
- [ ] 用户数据收集合法合规

---

## 🔄 重新生成包

如果修改了源代码，需要重新生成导入包：

```bash
# 1. 重新构建
npm run build:weapp

# 2. 清理旧包（可选）
rm release/sbti-miniapp-v3.0-weapp-20260501.zip

# 3. 重新打包
cd release
mkdir -p v3.0-weapp
cp -r ../dist v3.0-weapp/
cp ../project.config.json ../project.private.config.json v3.0-weapp/
zip -rq sbti-miniapp-v3.0-weapp-20260501.zip v3.0-weapp/

# 4. 验证
ls -lh sbti-miniapp-v3.0-weapp-*.zip
```

---

## 📂 包文件位置

```
项目根目录/
├── release/
│   ├── sbti-miniapp-v2.4-weapp-20260501.zip    # v2.4 版本（备用）
│   ├── sbti-miniapp-v3.0-weapp-20260501.zip    # v3.0 版本（当前）⭐
│   ├── v2.4-weapp/                             # v2.4 解压目录
│   └── v3.0-weapp/                             # v3.0 解压目录
├── dist/                                        # 最新编译产物
└── scripts/
    └── rollback-to-v2.4.sh                     # 版本回退脚本
```

---

## 💡 提示

### 开发过程中

```bash
# 实时预览
npm run dev:weapp          # 开发模式

# 或在微信开发工具中
预览 → 预览版二维码 → 扫码测试
```

### 导入失败时

1. 确保解压了 zip 文件
2. 选择的是 `v3.0-weapp` 文件夹（不是 zip 本身）
3. 检查文件夹内是否有 `dist/` 和 `project.config.json`

### 性能优化

```bash
# 如需减小包大小
npm run build:weapp -- --minify

# 或检查未使用的依赖
npm list --depth=0
```

---

## 📞 技术支持

遇到问题可参考：

| 问题类型 | 参考文档 |
|--------|--------|
| 版本管理相关 | [VERSION_HISTORY.md](VERSION_HISTORY.md) |
| 陪聊功能集成 | [COMPANION_INTEGRATION.md](COMPANION_INTEGRATION.md) |
| 快速问题排查 | [QUICK_VERSION_REF.md](QUICK_VERSION_REF.md) |
| 常用命令 | [VERSION_COMMAND_CARD.md](VERSION_COMMAND_CARD.md) |

---

## ✅ 导入完成标志

```
✅ 微信开发工具能打开项目
✅ 模拟器能编译并预览首页
✅ 能看到海洋系列卡片
✅ 测试按钮可点击
✅ 无 TypeScript 或编译错误
```

---

**生成时间**：2026-05-01  
**包版本**：v3.0  
**包文件**：sbti-miniapp-v3.0-weapp-20260501.zip  
**文件大小**：~275 KB

🎉 **现在可以导入微信开发工具进行开发和测试了！**
