import Taro from '@tarojs/taro'

/**
 * 陪聊会话管理工具
 * 负责与后端交互，创建一次性 code 并生成 H5 URL
 */

export type CompanionSessionConfig = {
  apiUrl: string // 后端 API 地址，如 https://api.your-domain.com
  h5BaseUrl: string // H5 应用基础 URL，如 https://mvp.your-domain.com
}

export type CompanionParams = {
  roleHint: string // SBTI 角色 hint，如 "warm", "steady", "spark", "direct"
  sceneHint: string // 场景 hint，如 "ice-break", "invite", "boundary"
  goal: string // 用户目标，如 "把开场说得自然"
  nickname?: string // 用户昵称
}

class CompanionSessionManager {
  private config: CompanionSessionConfig | null = null

  /**
   * 初始化配置
   */
  init(config: CompanionSessionConfig) {
    this.config = config
    console.log('[CompanionSession] Initialized:', config)
  }

  /**
   * 创建陪聊会话
   * 1. 调用后端 /api/session/create-code 获取一次性 code
   * 2. 生成 H5 URL
   * 3. 返回 URL
   */
  async createSession(params: CompanionParams): Promise<string> {
    if (!this.config) {
      throw new Error('CompanionSessionManager not initialized')
    }

    const { apiUrl, h5BaseUrl } = this.config
    const { roleHint, sceneHint, goal, nickname = '同学' } = params

    console.log('[CompanionSession.createSession] Creating with params:', params)

    try {
      // 步骤 1：调用后端创建 code
      const codeResponse = await this.createCode({
        source: 'sbti-miniapp',
        roleHint,
        sceneHint,
        goal,
      })

      const code = codeResponse.code
      if (!code) {
        throw new Error('Failed to get code from server')
      }

      console.log('[CompanionSession.createSession] Got code:', code)

      // 步骤 2：拼装 H5 URL
      const h5Url = this.buildH5Url(h5BaseUrl, {
        code,
        roleHint,
        sceneHint,
        goal,
        nickname,
      })

      console.log('[CompanionSession.createSession] Built URL:', h5Url)

      return h5Url
    } catch (error) {
      console.error('[CompanionSession.createSession] Error:', error)
      throw error
    }
  }

  /**
   * 调用后端创建 code
   */
  private async createCode(data: Record<string, string>): Promise<{ code: string; expiresIn: number }> {
    if (!this.config) {
      throw new Error('CompanionSessionManager not initialized')
    }

    const { apiUrl } = this.config

    return new Promise((resolve, reject) => {
      Taro.request({
        url: `${apiUrl}/api/session/create-code`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        data,
        success: (res) => {
          console.log('[createCode] Response:', res)
          if (res.statusCode === 200 && res.data?.code) {
            resolve({
              code: res.data.code,
              expiresIn: res.data.expiresIn || 300,
            })
          } else {
            reject(new Error(`Bad response status: ${res.statusCode}`))
          }
        },
        fail: (err) => {
          console.error('[createCode] Request failed:', err)
          reject(err)
        },
      })
    })
  }

  /**
   * 拼装 H5 URL
   */
  private buildH5Url(
    baseUrl: string,
    params: { code: string; roleHint: string; sceneHint: string; goal: string; nickname: string }
  ): string {
    const url = new URL(baseUrl)
    url.searchParams.append('source', 'miniapp')
    url.searchParams.append('code', params.code)
    url.searchParams.append('role', params.roleHint)
    url.searchParams.append('scene', params.sceneHint)
    url.searchParams.append('goal', params.goal)
    url.searchParams.append('nickname', params.nickname)
    return url.toString()
  }
}

// 导出单例
export const companionSessionManager = new CompanionSessionManager()
