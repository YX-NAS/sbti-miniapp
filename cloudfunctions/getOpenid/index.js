// 云函数：getOpenid
// 通过云函数调用自动获取 OPENID，无需前端传 code
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  return { openid: OPENID }
}
