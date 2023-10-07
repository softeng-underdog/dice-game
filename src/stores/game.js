/**
 * 全局存储，存储全程要用到的数据、表格
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import GameData from '../game-data'


export const useGameStore = defineStore('game', () => {
  const gd = ref(new GameData())
  
  return { gd }
})