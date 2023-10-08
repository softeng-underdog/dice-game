// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database({
  throwOnNotFound: false
})
const userDB = db.collection('user_db')
const defaultAvatar = 'cloud://cloud1-2gum4le1e2076a50.636c-cloud1-2gum4le1e2076a50-1321067110/user.png'

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  let id = event.id ?? wxContext.OPENID
  
  let result = await userDB.doc(id).get()
  if (result.data === null) {
    if (id === wxContext.OPENID) {
      const defaultUserRecord = {
        _id: id,
        nickname: `用户${id.slice(0, 8)}`,
        avatar: defaultAvatar,
        bio: '这个人很懒，还没设置个性签名。',
        winCount: 0,
        loseCount: 0
      }
      await userDB.add({
        data: defaultUserRecord
      })
      result.data = defaultUserRecord
    }
    else {
      throw new Error('User does not exist')
    }
  }
  return {
    id: result.data._id,
    nickname: result.data.nickname,
    avatar: result.data.avatar,
    bio: result.data.bio,
    winCount: result.data.winCount,
    loseCount: result.data.loseCount
  }
}