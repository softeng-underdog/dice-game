/**
 * 游戏数据层模块，提供存储和操纵游戏数据的相关类及方法
 * @module gameData
 */

import * as dataTypes from './types'

/**
 * GameData类存储一场游戏的所有状态数据，同时对数据提供基本的操作方法
 * @class
 * @constructor
 * @public
 */
class GameData {
    /**
     * 构造GameData类的一个实例
     */
    constructor() {
        /**
         * 这局游戏的倍率
         * @type {number}
         * @private
         */
        this.multiplier = 1;
        /**
         * 当前游戏局号
         * @type {number}
         * @private
         */
        this.currentGame = 1;
        /**
         * 游戏局数
         * @type {number}
         * @private
         */
        this.games = 1;
        /**
         * 这局游戏轮号
         * @type {number}
         * @private
         */
        this.currentRound = 1;
        /**
         * 当前玩家的数据索引
         * @type {number}
         * @private
         */
        this.currentPlayerIndex = 0;
        /**
         * 所有玩家的游戏数据
         * @type {PlayerData[]}
         * @private
         */
        this.playerData = []
    }

    /**
     * 初始化整盘游戏的状态
     * @param {number} games 游戏局数
     * @param {number} playerChips 玩家初始持有的筹码数
     * @param {dataTypes.PlayerDescriptor[]} playerDescriptors 每个玩家的描述符列表
     */
    initMatch(games, playerChips, playerDescriptors) {
        throw new Error('Not implemented')
    }

    /**
     * 获取全局游戏信息
     * @returns {dataTypes.GlobalInfo} 全局游戏信息
     */
    getGlobalInfo() {
        throw new Error('Not implemented')
    }

    /**
     * 获取指定玩家游戏数据（及其引用）
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {dataTypes.PlayerData} 游戏数据
     */
    getPlayerData(playerIndex = -1) {
        throw new Error('Not implemented')
    }

    /**
     * 获取整个玩家游戏数据的数组
     * @returns {dataTypes.PlayerData[]} 游戏数据数组
     */
    getPlayerDataAll() {
        throw new Error('Not implemented')
    }

    /**
     * 切换当前玩家的数据索引
     * @param {number} playerIndex 玩家数据索引，若为-1，则循环选取下一位玩家
     */
    switchPlayer(playerIndex = -1) {
        throw new Error('Not implemented')
    }

    /**
     * 获取玩家目前的分数情况
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {dataTypes.ScoreInfo} 分数信息
     */
    getPlayerScoreInfo(playerIndex = -1) {
        throw new Error('Not implemented')
    }

    /**
     * 完成本局游戏，根据目前的分数分配筹码，局号+1，重置倍率，重置轮数
     * @returns {dataTypes.AllocateInfo} 筹码分配结果
     */
    finishGame() {
        throw new Error('Not implemented')
    }

    /**
     * 完成本轮游戏，轮数+1
     */
    finishRound() {
        throw new Error('Not implemented')
    }

    /**
     * 投掷未被锁定的骰子，或直接设置投掷结果
     * @param {number[]?} rollResult 投掷结果，若不为null，则直接设置骰子数据为指定结果
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {number[]} 投掷结果
     */
    rollDice(rollResult = null, playerIndex = -1) {
        throw new Error('Not implemented')
    }

    /**
     * 切换指定索引骰子的锁定状态
     * @param {number} index 骰子索引
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {boolean} 切换后的锁定状态
     */
    toggleLockedByIndex(index, playerIndex = -1) {
        throw new Error('Not implemented')
    }

    /**
     * 获取指定索引骰子的锁定状态
     * @param {number} index 骰子索引
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     * @returns {boolean} 锁定状态
     */
    getLockedByIndex(index, playerIndex = -1) {
        throw new Error('Not implemented')
    }

    /**
     * 设置骰子锁定状态位图
     * @param {number} bitmap 骰子锁定状态位图
     * @param {number} playerIndex 玩家数据索引，若为-1，则选取当前玩家
     */
    setLockedBitmap(bitmap, playerIndex = -1) {
        throw new Error('Not implemented')
    }

    /**
     * 增加倍率
     * @param {number} times 增加的倍率
     */
    double(times) {
        throw new Error('Not implemented')
    }
}