<template>
  <view class="page-rank">
    <view class="rank-bar">
      <image class="return-btn" src="../../images/game-control/return-btn.svg" @tap="goHome" />
      <text class="rank-bar-title">排名</text>
    </view>
    <view class="rank-view">
      <player-rank trophy="../../images/game-rank/first.svg" title="土块"
        :player-avatar="rankPlayerList[0].avatar" :player-name="rankPlayerList[0].name" :chips="rankPlayerList[0].chips" />
      <player-rank trophy="../../images/game-rank/second.svg" title="赌怪"
        :player-avatar="rankPlayerList[1].avatar" :player-name="rankPlayerList[1].name" :chips="rankPlayerList[1].chips" />
      <player-rank v-if="rankPlayerList.length > 2" trophy="../../images/game-rank/third.svg" title="土怪"
        :player-avatar="rankPlayerList[2].avatar" :player-name="rankPlayerList[2].name" :chips="rankPlayerList[2].chips" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { useGameStore } from '../../stores/game'
import { useGlobalStore } from '../../stores/global'
import * as gdTypes from '../../game-data/types'
import playerRank from '../../components/game/player-rank.vue'
import './rank.css'
import '../../images/game-rank/first.svg'
import '../../images/game-rank/second.svg'
import '../../images/game-rank/third.svg'

const gameStore = useGameStore()
const globalStore = useGlobalStore()

const rankPlayerList = ref([
  {
    name: '用户',
    avatar: globalStore.defaultAvatar,
    chips: 100
  },
  {
    name: '用户',
    avatar: globalStore.defaultAvatar,
    chips: 100
  }
])

const goHome = () => {
  Taro.reLaunch({
    url: '/pages/home/home'
  })
}

useLoad(() => {
  Taro.hideHomeButton()
  /**
   * @type {gdTypes.PlayerData[]}
   */
  let playerDataList = gameStore.gd.getPlayerDataAll()
  playerDataList.sort((a, b) => b.chips - a.chips)
  let rpl = []
  for (let i = 0; i < Math.min(3, playerDataList.length); i++) {
    rpl.push({
      name: playerDataList[i].name,
      avatar: playerDataList[i].avatar,
      chips: playerDataList[i].chips
    })
  }
  rankPlayerList.value = rpl
})

</script>