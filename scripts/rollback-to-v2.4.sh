#!/bin/bash
set -e

echo "🔄 开始回退到 v2.4..."
echo ""

# 1. 备份当前版本
echo "1️⃣  备份当前版本..."
if [ -d "dist" ]; then
  cp -r dist dist-v3.0-backup
  echo "   ✅ 已备份 dist → dist-v3.0-backup"
fi

if [ -d "release/v3.0-weapp" ]; then
  cp -r release/v3.0-weapp release/v3.0-weapp-backup
  echo "   ✅ 已备份 release/v3.0-weapp → release/v3.0-weapp-backup"
fi

echo ""

# 2. 删除 v3.0 新增文件
echo "2️⃣  删除 v3.0 新增文件..."
rm -rf src/pages/companion/ && echo "   ✅ 删除 src/pages/companion/"
rm -f src/utils/companionSession.ts && echo "   ✅ 删除 src/utils/companionSession.ts"
rm -f COMPANION_INTEGRATION.md && echo "   ✅ 删除 COMPANION_INTEGRATION.md"

echo ""

# 3. 恢复 v2.4 版本的改动文件
echo "3️⃣  恢复 v2.4 版本的数据文件..."
if [ -d ".git" ]; then
  git checkout v2.4 -- \
    src/data/topicQuestions.ts \
    src/data/contentConfig.ts \
    src/utils/recommendations.ts 2>/dev/null && echo "   ✅ 已从 git 恢复 v2.4 版本" || echo "   ⚠️  Git 恢复失败，需要手动恢复这些文件"
else
  echo "   ⚠️  未找到 .git 目录，无法自动恢复，请参考 VERSION_HISTORY.md 手动恢复"
fi

echo ""

# 4. 重新构建
echo "4️⃣  重新构建..."
npm run build:weapp
BUILD_STATUS=$?

echo ""

if [ $BUILD_STATUS -eq 0 ]; then
  echo "✅ 回退到 v2.4 成功！"
  echo ""
  echo "备份位置："
  echo "  - dist-v3.0-backup/"
  echo "  - release/v3.0-weapp-backup/"
  echo ""
  echo "如需恢复到 v3.0，执行："
  echo "  rm -rf dist && cp -r dist-v3.0-backup dist"
  echo "  rm -rf release/v3.0-weapp && cp -r release/v3.0-weapp-backup release/v3.0-weapp"
  echo "  npm run build:weapp"
else
  echo "❌ 构建失败！"
  echo "请检查 src/data/ 下的文件是否正确恢复"
  exit 1
fi
