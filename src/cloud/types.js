/**
 * 云端模块类型定义，提供数据库记录类型的JSDoc定义
 */

import * as gdTypes from '../game-data/types'
import * as actTypes from '../game-action'
import GameData from '../game-data'

/**
 * @typedef UserRecord 用户数据库记录
 * @property {string} id 用户ID
 * @property {string} nickname 用户昵称
 * @property {string} avatar 用户头像
 * @property {string} bio 个性签名
 * @property {number} winCount 胜场数
 * @property {number} loseCount 负场数
 */

/**
 * @typedef MatchRecord 对局数据库记录
 * @property {string} id 房间ID
 * @property {gdTypes.PlayerDescriptor[]} descriptors 每个玩家的描述符
 * @property {actTypes.GameAction} action 上一个发生的游戏动作
 */

export default {}