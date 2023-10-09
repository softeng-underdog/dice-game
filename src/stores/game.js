/**
 * 游戏存储，存储游戏数据层对象以及其他相关游戏信息
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import GameData from '../game-data'

/**
 * 游戏模式枚举
 * @readonly
 * @enum {number}
 */
export const GameMode = {
  /**
   * 本地游戏
   */
  OFFLINE: 0,
  /**
   * 在线对战
   */
  ONLINE: 1
}

export const useGameStore = defineStore('game', () => {
  /**
   * 游戏数据层模块对象
   */
  const gd = ref(new GameData())
  /**
   * 游戏模式
   */
  const mode = ref(GameMode.offline)
  /**
   * 房间Id（仅对战模式）
   */
  const roomId = ref('')
  /**
   * 该客户端玩家的数据索引
   */
  const playerIndex = ref(0)
  /**
   * 玩家托管模式位图
   */
  const playerAutoBitmap = ref(0)
  /**
   * 获取玩家托管模式状态
   * @param {number} index 玩家数据索引
   * @returns {boolean} 托管模式状态
   */
  const getPlayerAuto = index => {
    return (playerAutoBitmap.value & (1 << index)) !== 0
  }
  /**
   * 设置玩家托管模式状态
   * @param {number} index 玩家数据索引
   * @param {boolean} auto 托管模式状态
   */
  const setPlayerAuto = (index, auto) => {
    if (auto) {
      playerAutoBitmap.value |= (1 << index)
    }
    else {
      playerAutoBitmap.value &= ~(1 << index)
    }
  }
  /**
   * 切换玩家托管模式
   * @param {number} index 玩家数据索引
   */
  const togglePlayerAuto = index => {
    playerAutoBitmap.value ^= (1 << index)
  }

  return { 
    gd,
    mode,
    roomId,
    playerIndex,
    playerAutoBitmap,
    getPlayerAuto,
    setPlayerAuto,
    togglePlayerAuto
   }
})