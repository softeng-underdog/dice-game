// 云函数入口文件
const cloud = require('wx-server-sdk')
const { v4: uuidv4 } = require('uuid')
const { match } = require('assert')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database({
  throwOnNotFound: false
})
const matchDB = db.collection('match_db')

// 云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command
  let existingMatch = await matchDB.where({
    descriptors: _.size(1)
  }).get()
  if (existingMatch.data == []) {
    const newMatch = {
      _id: uuidv4(),
      descriptors: [{
        id: event.info.id,
        name: event.info.name,
        avatar: event.info.avatar,
        isCPU: false
      }],
      action: null
    }
    await matchDB.add({
      data: newMatch
    })
    return newMatch._id
  }
  let descriptors = existingMatch.data[0].descriptors
  descriptors.push({
    id: event.id,
    name: event.name,
    avatar: event.avatar,
    isCPU: false
  })
  await matchDB.doc(existingMatch.data[0]._id).update({
    data: {
      descriptors
    }
  })
  return existingMatch.data[0]._id
}