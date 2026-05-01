// 云函数：syncRecords
// 支持两个操作：
//   action: 'push'  — 上传本地记录（合并，不重复）
//   action: 'pull'  — 拉取该用户全部云端记录
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const col = db.collection('test_records')

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  const { action, records } = event

  if (action === 'push') {
    if (!records || !Array.isArray(records) || records.length === 0) {
      return { success: true, pushed: 0 }
    }

    // 查询已有的记录 id，避免重复写入
    const existing = await col
      .where({ openid: OPENID })
      .field({ recordId: true })
      .limit(100)
      .get()

    const existingIds = new Set(existing.data.map(d => d.recordId))
    const toInsert = records.filter(r => !existingIds.has(r.id))

    for (const r of toInsert) {
      await col.add({
        data: {
          openid: OPENID,
          recordId: r.id,
          testId: r.testId,
          title: r.title,
          code: r.code,
          summary: r.summary,
          completedAt: r.completedAt,
          syncAt: new Date().toISOString(),
        },
      })
    }

    return { success: true, pushed: toInsert.length }
  }

  if (action === 'pull') {
    const res = await col
      .where({ openid: OPENID })
      .orderBy('completedAt', 'desc')
      .limit(50)
      .get()

    const records = res.data.map(d => ({
      id: d.recordId,
      testId: d.testId,
      title: d.title,
      code: d.code,
      summary: d.summary,
      completedAt: d.completedAt,
    }))

    return { success: true, records }
  }

  return { success: false, error: 'unknown action' }
}
