/**
 * 游戏动作，该对象负责描述游戏过程中发生的事件，其会递交给界面层的dispatchAction进行处理
 * @module gameAction
 */

/**
 * @typedef GameAction 游戏动作
 * @property {ActionType} type 动作类型
 * @property {string} id 玩家ID
 * @property {any} param 附加数据
 */

/**
 * 动作类型
 * @readonly
 * @enum {number}
 */
export const ActionType = {
    /**
     * 投掷骰子，param若为number[]，则表示投掷结果
     */
    ROLL_DICE: 0,
    /**
     * 设置骰子锁定状态，param为number，表示锁定位图
     */
    LOCK_DICE: 1,
    /**
     * 加倍，param为number，表示所加倍数
     */
    DOUBLE: 2,
    /**
     * 玩家离开
     */
    PLAYER_LEAVE: 3,
    /**
     * 本局游戏结束
     */
    FINISH_GAME: 4,
    /**
     * 本轮游戏结束
     */
    FINISH_ROUND: 5,
    /**
     * 游戏结束
     */
    GAME_OVER: 6,
    /**
     * 有玩家被击飞
     */
    KNOCKOUT: 7
}