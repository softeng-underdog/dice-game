/**
 * 游戏数据层模块类型定义，提供各种类型的JSDoc定义
 */

/**
 * @typedef PlayerDescriptor 玩家描述符
 * @property {number} id 玩家ID
 * @property {string} name 玩家名称
 * @property {string} avatar 玩家头像
 * @property {boolean} isCPU 是否是AI玩家
 */

/**
 * @typedef PlayerData 玩家游戏数据
 * @property {number} id 玩家ID
 * @property {string} name 玩家名称
 * @property {string} avatar 玩家头像
 * @property {boolean} isCPU 是否是AI玩家
 * @property {number[]} diceData 当前骰子数据
 * @property {number} diceLockedBitmap 骰子锁定状态位图,0为活动，1为锁定
 * @property {number} chips 筹码数
 */

/**
 * @typedef GlobalInfo 全局游戏信息
 * @property {number} multiplier 这局游戏的倍率
 * @property {number} currentGame 当前游戏局号
 * @property {number} games 游戏局数
 * @property {number} currentRound 这局游戏轮号
 * @property {number} currentPlayerIndex 当前玩家的数据索引
 */

/**
 * @typedef ScoreInfo 分数信息
 * @property {BonusType} bonusType 奖励分类型
 * @property {number} bonusScore 奖励分
 * @property {number} diceScore 骰子点数总分
 * @property {number} totalScore 总分
 */

/**
 * @typedef AllocateInfo 筹码分配结果信息
 * @property {number[]} topPlayerIndex 分数最高玩家的数据索引
 * @property {PlayerData[]} topPlayerData 分数最高玩家分配之前的游戏数据
 * @property {number[]} chipDifference 从每个玩家手中赢得的的筹码数，分数最高的玩家数据索引的筹码数固定为0
 * @property {number[]?} knockoutPlayerIndex 击飞玩家的数据索引，若为null则说明无人被击飞
 */

/**
 * 奖励分类型枚举
 * @readonly
 * @enum {number}
 */
export const BonusType = {
    /** 无奖励分 */
    NONE: 0,
    /** 双对 */
    DOUBLE_PAIR: 1,
    /** 三连 */
    TRIPLE: 2,
    /** 葫芦 */
    GOURD: 3,
    /** 四连 */
    QUADRUPLE: 4,
    /** 五连 */
    QUINTUPLE: 5,
    /** 小顺子 */
    SMALL_STRAIGHT: 6,
    /** 大顺子 */
    BIG_STRAIGHT: 7
}


