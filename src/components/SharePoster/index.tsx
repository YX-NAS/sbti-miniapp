/**
 * SharePoster — Canvas 2D 分享海报组件
 *
 * 原理：用 Canvas 2D 绘制结果海报，调用微信 API 保存到相册。
 * Canvas 逻辑尺寸 630×1120，CSS 显示 630rpx×1120rpx（约 315×560 CSS px），
 * 配合 canvas.width / canvas.height = 630 / 1120 形成标准 2x 清晰度。
 */
import { View, Canvas, Button, Text } from '@tarojs/components'
import { useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

export interface SharePosterProps {
  typeCode: string
  typeCn: string
  typeIntro: string
  similarity: number   // 0–100
  special?: boolean    // 是否特殊人格（不显示相似度）
  onClose: () => void
}

// ─── Canvas 绘图工具函数 ──────────────────────────────────────────────────────

/** 手动 roundRect（兼容低版本 Canvas 2D） */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/** 中文文本自动折行，返回行数 */
function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
): number {
  let line = ''
  let lineCount = 0
  for (let i = 0; i < text.length; i++) {
    const testLine = line + text[i]
    if (ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line, x, startY + lineCount * lineHeight)
      line = text[i]
      lineCount++
      if (lineCount >= maxLines) {
        ctx.fillText(line + '…', x, startY + lineCount * lineHeight)
        return lineCount + 1
      }
    } else {
      line = testLine
    }
  }
  if (line) {
    ctx.fillText(line, x, startY + lineCount * lineHeight)
    lineCount++
  }
  return lineCount
}

// ─── 主绘制函数 ───────────────────────────────────────────────────────────────

function drawPoster(
  canvas: any,
  typeCode: string,
  typeCn: string,
  typeIntro: string,
  similarity: number,
  special: boolean
) {
  const W = 630
  const H = 1120
  canvas.width = W
  canvas.height = H

  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')

  // ── 背景 ──────────────────────────────────────────
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H)
  bgGrad.addColorStop(0, '#FFF5F8')
  bgGrad.addColorStop(0.55, '#FFFBF0')
  bgGrad.addColorStop(1, '#F0F8FF')
  ctx.fillStyle = bgGrad
  roundRect(ctx, 0, 0, W, H, 40)
  ctx.fill()

  // ── 边框 ──────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,107,157,0.25)'
  ctx.lineWidth = 3
  roundRect(ctx, 6, 6, W - 12, H - 12, 37)
  ctx.stroke()

  // ── 装饰圆 ────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,217,61,0.18)'
  ctx.beginPath()
  ctx.arc(W - 60, 130, 90, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(77,150,255,0.12)'
  ctx.beginPath()
  ctx.arc(50, H - 140, 100, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = 'rgba(107,203,119,0.12)'
  ctx.beginPath()
  ctx.arc(W - 40, H - 200, 60, 0, Math.PI * 2)
  ctx.fill()

  // ── App 名称标签 ──────────────────────────────────
  ctx.fillStyle = 'rgba(255,107,157,0.12)'
  roundRect(ctx, W / 2 - 140, 44, 280, 56, 28)
  ctx.fill()

  ctx.fillStyle = '#FF6B9D'
  ctx.font = 'bold 24px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('🌟 星座人格实验室', W / 2, 72)

  // ── 副标题 ────────────────────────────────────────
  ctx.fillStyle = '#9a8a9a'
  ctx.font = '26px sans-serif'
  ctx.fillText('我的 SBTI 人格类型', W / 2, 150)

  // ── 人格 Code（大字）─────────────────────────────
  ctx.fillStyle = '#FF6B9D'
  ctx.font = `bold ${typeCode.length > 5 ? 80 : 96}px sans-serif`
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(typeCode, W / 2, 320)

  // ── 中文名 ────────────────────────────────────────
  ctx.fillStyle = '#3a3a3a'
  ctx.font = 'bold 44px sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(`「${typeCn}」`, W / 2, 390)

  // ── 分割线 ────────────────────────────────────────
  const lineGrad = ctx.createLinearGradient(80, 0, W - 80, 0)
  lineGrad.addColorStop(0, 'transparent')
  lineGrad.addColorStop(0.3, 'rgba(255,107,157,0.3)')
  lineGrad.addColorStop(0.7, 'rgba(255,107,157,0.3)')
  lineGrad.addColorStop(1, 'transparent')
  ctx.strokeStyle = lineGrad
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(80, 425)
  ctx.lineTo(W - 80, 425)
  ctx.stroke()

  // ── 简介文本（折行）──────────────────────────────
  ctx.fillStyle = '#6a5a6a'
  ctx.font = '30px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  drawWrappedText(ctx, typeIntro, W / 2, 490, W - 120, 50, 5)

  // ── 相似度 / 特殊标签 ─────────────────────────────
  const badgeY = 780
  ctx.fillStyle = 'rgba(77,150,255,0.1)'
  roundRect(ctx, W / 2 - 170, badgeY - 36, 340, 60, 30)
  ctx.fill()

  ctx.fillStyle = '#4D96FF'
  ctx.font = 'bold 26px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const badgeText = special
    ? '✨ 隐藏人格已解锁'
    : `匹配度 ${similarity}%  ·  SBTI 性格测试`
  ctx.fillText(badgeText, W / 2, badgeY - 6)

  // ── 底部 CTA ──────────────────────────────────────
  ctx.fillStyle = 'rgba(255,107,157,0.1)'
  roundRect(ctx, 60, 870, W - 120, 88, 44)
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,107,157,0.3)'
  ctx.lineWidth = 1.5
  roundRect(ctx, 60, 870, W - 120, 88, 44)
  ctx.stroke()

  ctx.fillStyle = '#FF6B9D'
  ctx.font = 'bold 30px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('扫码探索你的性格 →', W / 2, 914)

  // ── 底部版权 ──────────────────────────────────────
  ctx.fillStyle = '#c8b8c8'
  ctx.font = '22px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText('星座人格实验室 · 仅供娱乐参考', W / 2, 1078)
}

// ─── 组件 ─────────────────────────────────────────────────────────────────────

export default function SharePoster({
  typeCode,
  typeCn,
  typeIntro,
  similarity,
  special = false,
  onClose,
}: SharePosterProps) {
  const canvasNodeRef = useRef<any>(null)
  const drawnRef = useRef(false)

  useEffect(() => {
    if (drawnRef.current) return
    // 等待 canvas 挂载后再绘制
    const timer = setTimeout(() => {
      Taro.createSelectorQuery()
        .select('#sharePosterCanvas')
        .node((res: any) => {
          if (!res?.node) return
          const canvas = res.node
          canvasNodeRef.current = canvas
          drawnRef.current = true
          drawPoster(canvas, typeCode, typeCn, typeIntro, similarity, special)
        })
        .exec()
    }, 120)
    return () => clearTimeout(timer)
  }, [typeCode])

  const handleSave = () => {
    if (!canvasNodeRef.current) {
      Taro.showToast({ title: '海报未生成，请稍后重试', icon: 'none' })
      return
    }
    Taro.canvasToTempFilePath({
      canvas: canvasNodeRef.current,
      fileType: 'jpg',
      quality: 0.95,
      success: ({ tempFilePath }) => {
        Taro.saveImageToPhotosAlbum({
          filePath: tempFilePath,
          success: () =>
            Taro.showToast({ title: '已保存到相册 ✓', icon: 'none', duration: 2000 }),
          fail: (err: any) => {
            if (err?.errMsg?.includes('authorize') || err?.errMsg?.includes('auth deny')) {
              Taro.showModal({
                title: '需要相册权限',
                content: '请在设置中开启「保存到相册」权限，才能保存分享图',
                confirmText: '去设置',
                success: ({ confirm }) => {
                  if (confirm) Taro.openSetting()
                },
              })
            } else {
              Taro.showToast({ title: '保存失败，请重试', icon: 'none' })
            }
          },
        })
      },
      fail: () => Taro.showToast({ title: '生成图片失败', icon: 'none' }),
    })
  }

  return (
    <View className="poster-overlay" onClick={onClose}>
      <View className="poster-modal" onClick={(e) => e.stopPropagation()}>
        {/* 提示文字 */}
        <Text className="poster-tip">长按图片或点击保存分享给朋友 ✨</Text>

        {/* Canvas 海报 */}
        <Canvas
          type="2d"
          id="sharePosterCanvas"
          className="poster-canvas"
        />

        {/* 操作按钮 */}
        <View className="poster-actions">
          <Button className="poster-save-btn" onClick={handleSave}>
            💾 保存到相册
          </Button>
          <Button className="poster-close-btn" onClick={onClose}>
            关闭
          </Button>
        </View>
      </View>
    </View>
  )
}
