/**
 * 全局存储，存储全程要用到的数据、表格
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import '../images/game-dices/one-dice.svg'
import '../images/game-dices/two-dice.svg'
import '../images/game-dices/three-dice.svg'
import '../images/game-dices/four-dice.svg'
import '../images/game-dices/five-dice.svg'
import '../images/game-dices/six-dice.svg'

export const useGlobalStore = defineStore('global', () => {
  const diceSvgTable = ref({
    1: '../../images/game-dices/one-dice.svg',
    2: '../../images/game-dices/two-dice.svg',
    3: '../../images/game-dices/three-dice.svg',
    4: '../../images/game-dices/four-dice.svg',
    5: '../../images/game-dices/five-dice.svg',
    6: '../../images/game-dices/six-dice.svg'
  })
  let globalKey = 0

  const getGlobalKey = (n = 1) => {
    return n * (globalKey++);
  }

  const defaultAvatar = 'cloud://cloud1-2gum4le1e2076a50.636c-cloud1-2gum4le1e2076a50-1321067110/user.png'

  const userId = ref(0)
  const userNickname = ref('User')
  const userAvatar = ref(defaultAvatar)

  const fetchUserInfo = () => {
    
  }

  return {
    diceSvgTable,
    getGlobalKey,
    userId,
    userNickname,
    userAvatar,
    fetchUserInfo
  }
})