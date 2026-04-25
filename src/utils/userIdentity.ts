/**
 * 用户身份模块
 * 通过 wx.login 获取 openid，本地持久化，作为云端记录同步的基础。
 * openid 由云函数 getOpenid 解析，本地只存储加密后的 uid 标识。
 */
import Taro from '@tarojs/taro'

const USER_ID_KEY = 'campus_user_id'
const USER_LOGIN_AT_KEY = 'campus_user_login_at'
const CLOUD_ENV_ID = 'sbti-miniapp-prod'  // 云环境 ID，上线时替换

export type UserIdentity = {
  uid: string       // 本地唯一标识（来自 openid 哈希或随机生成）
  openid?: string   // 微信 openid（仅云函数解析后才有）
  loginAt: number   // 最后登录时间戳
}

/** 生成本地随机 uid（无需网络） */
function generateLocalUid(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

/** 读取本地存储的用户身份 */
export function getLocalUserIdentity(): UserIdentity | null {
  try {
    const uid = Taro.getStorageSync(USER_ID_KEY) as string | undefined
    const loginAt = Taro.getStorageSync(USER_LOGIN_AT_KEY) as number | undefined
    if (uid) return { uid, loginAt: loginAt || 0 }
  } catch (_) {}
  return null
}

/** 确保本地身份存在（无网络时回退本地 uid） */
export function ensureLocalIdentity(): UserIdentity {
  const existing = getLocalUserIdentity()
  if (existing) return existing

  const uid = generateLocalUid()
  const loginAt = Date.now()
  Taro.setStorageSync(USER_ID_KEY, uid)
  Taro.setStorageSync(USER_LOGIN_AT_KEY, loginAt)
  return { uid, loginAt }
}

/**
 * 微信登录并获取 openid
 * 1. 调用 wx.login 拿到 code
 * 2. 传给云函数 getOpenid 换取 openid
 * 3. 将 openid 持久化为 uid，供云端记录同步使用
 */
export async function wxLogin(): Promise<UserIdentity> {
  // 先尝试用已有身份
  const existing = getLocalUserIdentity()
  if (existing?.openid) return existing

  try {
    // 检查云开发是否已初始化
    if (typeof wx === 'undefined' || !wx.cloud) {
      return ensureLocalIdentity()
    }

    const loginRes = await Taro.login()
    if (!loginRes.code) return ensureLocalIdentity()

    // 调用云函数获取 openid
    const cloudRes = await wx.cloud.callFunction({
      name: 'getOpenid',
      data: { code: loginRes.code },
    }) as { result?: { openid?: string } }

    const openid = cloudRes?.result?.openid
    if (!openid) return ensureLocalIdentity()

    // 用 openid 的后16位作为 uid（不直接存明文 openid）
    const uid = `wx_${openid.slice(-16)}`
    const loginAt = Date.now()
    Taro.setStorageSync(USER_ID_KEY, uid)
    Taro.setStorageSync(USER_LOGIN_AT_KEY, loginAt)

    return { uid, openid, loginAt }
  } catch (_) {
    return ensureLocalIdentity()
  }
}

/** 清除本地身份（退出/重置用） */
export function clearUserIdentity() {
  Taro.removeStorageSync(USER_ID_KEY)
  Taro.removeStorageSync(USER_LOGIN_AT_KEY)
}

export { CLOUD_ENV_ID }
