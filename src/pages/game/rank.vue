<template>
  <view class="page-rank">
    <view class="rank-bar">
      <image class="return-btn" src="../../images/game-control/return-btn.svg" />
      <text class="rank-bar-title">排名</text>
    </view>
    <view class="rank-view">
      <player-rank trophy="../../images/game-rank/first.svg" title="土块" player-avatar="../../images/user.png" player-name="WinTP" :chips="500" />
      <player-rank trophy="../../images/game-rank/second.svg" title="赌怪" player-avatar="../../images/user.png" player-name="WinTP" :chips="500" />
      <player-rank trophy="../../images/game-rank/third.svg" title="土怪" player-avatar="../../images/user.png" player-name="WinTP" :chips="500" />
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import playerRank from '../../components/game/player-rank.vue'
import './rank.css'
import '../../images/game-rank/first.svg'
import '../../images/game-rank/second.svg'
import '../../images/game-rank/third.svg'

useLoad(() => {
  Taro.hideHomeButton()
})

</script>