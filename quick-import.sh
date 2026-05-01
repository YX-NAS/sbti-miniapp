#!/bin/bash
# SBTI 小程序导入包 - 快速导入脚本
# 使用方法: bash quick-import.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASE_DIR="$SCRIPT_DIR/release"

echo "================================"
echo "🎯 SBTI 小程序快速导入"
echo "================================"
echo ""

# 检查包文件
echo "📋 检查可用的导入包..."
echo ""

V3_PKG="$RELEASE_DIR/sbti-miniapp-v3.0-weapp-20260501.zip"
V24_PKG="$RELEASE_DIR/sbti-miniapp-v2.4-weapp-20260501.zip"

if [ -f "$V3_PKG" ]; then
    V3_SIZE=$(du -h "$V3_PKG" | cut -f1)
    echo "✅ v3.0 (当前版本)   $V3_SIZE  $V3_PKG"
else
    echo "❌ v3.0 包不存在"
fi

if [ -f "$V24_PKG" ]; then
    V24_SIZE=$(du -h "$V24_PKG" | cut -f1)
    echo "✅ v2.4 (备份版本)   $V24_SIZE  $V24_PKG"
else
    echo "⚠️  v2.4 包不存在（可生成备份）"
fi

echo ""
echo "================================"
echo "🚀 导入步骤（选一种）"
echo "================================"
echo ""

echo "方式 A：使用已解压的目录（推荐）"
echo "  1. 打开 微信开发者工具"
echo "  2. 文件 → 打开项目"
echo "  3. 选择：$RELEASE_DIR/v3.0-weapp"
echo "  4. 输入 AppID（可选）"
echo "  5. 点击打开"
echo ""

echo "方式 B：导入 ZIP 包"
echo "  1. 打开 微信开发者工具"
echo "  2. 文件 → 打开项目"
echo "  3. 选择：$V3_PKG"
echo "  4. 工具会自动解压"
echo ""

echo "================================"
echo "📚 帮助文档"
echo "================================"
echo ""
echo "详细导入教程：    IMPORT_GUIDE.md"
echo "版本管理指南：    VERSION_HISTORY.md"
echo "陪聊功能集成：    COMPANION_INTEGRATION.md"
echo "快速问题排查：    QUICK_VERSION_REF.md"
echo ""

echo "🎉 导入完成后可进行以下测试："
echo "  ✅ 预览首页（查看海洋系列）"
echo "  ✅ 测试海洋生物 Ti 测试"
echo "  ✅ 测试其他功能"
echo ""

echo "================================"
