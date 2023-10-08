/**
 * 全局存储，存储全程要用到的数据、表格
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
   * 当前玩家数据索引（仅对战模式）
   */
  const playerIndex = ref(0)

  return { 
    gd,
    mode,
    roomId,
    playerIndex
   }
})