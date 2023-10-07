// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const userDB = db.collection('user_db')
const defaultAvatar = 'cloud://cloud1-2gum4le1e2076a50.636c-cloud1-2gum4le1e2076a50-1321067110/user.png'

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  let id = wxContext.OPENID
  if ('id' in event) {
    id = event.id
  }
  let result = await userDB.where({ id }).get()
  if (result.data.length == 0) {
    if (id === wxContext.OPENID) {
      const defaultUserRecord = {
        id,
        nickname: `用户${id.slice(0, 8)}`,
        avatar: defaultAvatar,
        winCount: 0,
        loseCount: 0
      }
      await userDB.add({
        data: defaultUserRecord
      })
      result.data.push(defaultUserRecord)
    }
    else {
      return null
    }
  }
  return result.data[0]
}