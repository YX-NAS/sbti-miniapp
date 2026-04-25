/**
 * 云端测试记录同步
 * - push: 本地记录上传到云数据库（dedup by id）
 * - pull: 拉取云端记录并与本地合并，换设备不丢失
 * - 所有操作均有 fallback，云开发未启用时静默失败
 */
import Taro from '@tarojs/taro'
import { ensureLocalIdentity, CLOUD_ENV_ID } from './userIdentity'
import { trackEvent } from './analytics'

const HISTORY_KEY = 'campus_test_history_v2'
const CLOUD_SYNC_AT_KEY = 'campus_cloud_sync_at'
const CLOUD_INITIALIZED_KEY = 'campus_cloud_init'

export type HistoryEntry = {
  id: string
  testId: string
  title: string
  code: string
  summary: string
  completedAt: string
}

/** 初始化云开发（只初始化一次） */
function initCloud(): boolean {
  try {
    if (typeof wx === 'undefined' || !wx.cloud) return false
    const already = Taro.getStorageSync(CLOUD_INITIALIZED_KEY)
    if (already) return true
    wx.cloud.init({ env: CLOUD_ENV_ID, traceUser: true })
    Taro.setStorageSync(CLOUD_INITIALIZED_KEY, true)
    return true
  } catch (_) {
    return false
  }
}

/** 读取本地历史记录 */
function getLocalHistory(): HistoryEntry[] {
  try {
    return (Taro.getStorageSync(HISTORY_KEY) as HistoryEntry[] | undefined) || []
  } catch (_) {
    return []
  }
}

/** 写入本地历史记录 */
function saveLocalHistory(records: HistoryEntry[]) {
  Taro.setStorageSync(HISTORY_KEY, records.slice(0, 50))
}

/** 合并两组记录（按 id 去重，按 completedAt 降序，取前 50 条） */
function mergeRecords(local: HistoryEntry[], remote: HistoryEntry[]): HistoryEntry[] {
  const map = new Map<string, HistoryEntry>()
  ;[...remote, ...local].forEach(r => map.set(r.id, r))
  return Array.from(map.values())
    .sort((a, b) => (b.completedAt > a.completedAt ? 1 : -1))
    .slice(0, 50)
}

/**
 * 推送本地记录到云端
 * 在完成测试后调用，后台静默上传
 */
export async function pushRecordsToCloud(): Promise<boolean> {
  if (!initCloud()) return false
  ensureLocalIdentity()
  const records = getLocalHistory()
  if (records.length === 0) return true

  try {
    const res = await wx.cloud.callFunction({
      name: 'syncRecords',
      data: { action: 'push', records },
    }) as { result?: { success?: boolean; pushed?: number } }

    const ok = res?.result?.success === true
    if (ok) {
      Taro.setStorageSync(CLOUD_SYNC_AT_KEY, Date.now())
      trackEvent('cloud_push_success', { pushed: res.result?.pushed ?? 0 })
    }
    return ok
  } catch (_) {
    return false
  }
}

/**
 * 从云端拉取记录并与本地合并
 * 在历史记录页 / 登录后调用
 */
export async function pullAndMergeRecords(): Promise<{ merged: number; pulled: number }> {
  const empty = { merged: 0, pulled: 0 }
  if (!initCloud()) return empty
  ensureLocalIdentity()

  try {
    const res = await wx.cloud.callFunction({
      name: 'syncRecords',
      data: { action: 'pull' },
    }) as { result?: { success?: boolean; records?: HistoryEntry[] } }

    const cloudRecords = res?.result?.records
    if (!cloudRecords || !Array.isArray(cloudRecords)) return empty

    const local = getLocalHistory()
    const merged = mergeRecords(local, cloudRecords)
    saveLocalHistory(merged)
    Taro.setStorageSync(CLOUD_SYNC_AT_KEY, Date.now())
    trackEvent('cloud_pull_success', { pulled: cloudRecords.length, merged: merged.length })

    return { pulled: cloudRecords.length, merged: merged.length }
  } catch (_) {
    return empty
  }
}

/** 获取最后同步时间（ms 时间戳，0 表示未同步过） */
export function getLastSyncAt(): number {
  try {
    return (Taro.getStorageSync(CLOUD_SYNC_AT_KEY) as number | undefined) || 0
  } catch (_) {
    return 0
  }
}

/** 格式化同步时间展示 */
export function formatSyncAt(ts: number): string {
  if (!ts) return '未同步'
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} 已同步`
}
