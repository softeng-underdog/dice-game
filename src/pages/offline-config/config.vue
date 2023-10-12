<template>
  <view class="page-common">
    <user-bar />
    <menu-item-text class="page-title" icon-src="../../images/menu-dices/offline-dice.svg" btn-color="#F8DD46">本地对战</menu-item-text>
    <view class="flex-fill config-area">
      <config-field class="field-margin" v-model="playerNumber" label="玩家人数：" :min-value="2" :max-value="5" />
      <config-field class="field-margin" v-model="cpuNumber" label="AI数量：" :min-value="0" :max-value="playerNumber - 1" />
      <config-field class="field-margin" v-model="chipNumber" label="筹码数：" :min-value="100" :step="100"/>
      <config-field class="field-margin" v-model="gameNumber" label="游戏局数：" :min-value="1" />
      <text class="menu-btn-border start-btn" @tap="startGame">开始游戏</text>
    </view>
    <view class="navigator-area">
      <navigator open-type="navigateBack">
        <image class="navigator-back" src="../../images/navigator-btn/back-btn.svg" />
      </navigator>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { useGameStore, GameMode } from '../../stores/game'
import { useGlobalStore } from '../../stores/global'
import cloud from '../../cloud'
import * as gdTypes from '../../game-data/types'
import userBar from '../../components/common/user-bar.vue'
import menuItemText from '../../components/common/menu-item-text.vue'
import configField from '../../components/config-control/config-field.vue'
import '../../style/common.css'
import './config.css'

const gameStore = useGameStore()
const globalStore = useGlobalStore()

const playerNumber = ref(2)
const cpuNumber = ref(0)
const chipNumber = ref(100)
const gameNumber = ref(1)

const startGame = async () => {
  gameStore.mode = GameMode.OFFLINE
  gameStore.playerIndex = 0
  gameStore.playerAutoBitmap = 0
  let info = await cloud.UserDB.getUserInfo()
  /**
   * @type {gdTypes.PlayerDescriptor[]}
   */
  let playerDescriptors = [{
    id: info.id,
    name: info.nickname,
    avatar: info.avatar,
    isCPU: false
  }]
  for (let i = 0; i < playerNumber.value - cpuNumber.value - 1; i++) {
    playerDescriptors.push({
      id: `player${i}`,
      name: `玩家${i + 1}`,
      avatar: globalStore.defaultAvatar,
      isCPU: false
    })
  }
  for (let i = 0; i < cpuNumber.value; i++) {
    playerDescriptors.push({
      id: `cpu${i}`,
      name: `机器人${i + 1}`,
      avatar: globalStore.aiAvatar,
      isCPU: true
    })
  }
  gameStore.gd.initMatch(gameNumber.value, chipNumber.value, playerDescriptors)
  Taro.reLaunch({
    url: '/pages/game/game'
  })
}

</script>