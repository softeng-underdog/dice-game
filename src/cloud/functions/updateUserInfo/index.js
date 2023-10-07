// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database({
  throwOnNotFound: false
})
const userDB = db.collection('user_db')

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  let id = wxContext.OPENID
  if (event.id !== null) {
    id = event.id
  }
  let result = await userDB.doc(id).get()
  if (result.data === null) {
    throw new Error('User does not exist')
  }
  await userDB.doc(id).update({
    data: event.data
  })
}