<template>
  <view class="page-game">
    <view class="game-info">
      <view class="return-avatar-group">
        <image class="return-btn" src="../../images/game-control/return-btn.svg" />
        <image class="game-avatar" src="../../images/user.png" @tap="togglePlayerView" />
      </view>
      <text class="multiplier-text">当前倍率 : 5</text>
      <view class="games-group">
        <text class="games-text">局数</text>
        <text class="games-text">1/12</text>
      </view>
    </view>
    <view v-if="!showPlayerView" class="game-view">
      <view class="game-area">
        <view class="free-area">
          <image class="game-dice" src="../../images/game-dices/one-dice.svg" />
          <image class="game-dice" src="../../images/game-dices/one-dice.svg" />
          <image class="game-dice" src="../../images/game-dices/one-dice.svg" />
          <image class="game-dice" src="../../images/game-dices/one-dice.svg" />
          <image class="game-dice" src="../../images/game-dices/one-dice.svg" />
        </view>
        <bonus-tr name="双对" :score="10" />
        <bonus-tr name="三连" :score="10" achieved />
        <bonus-tr name="葫芦" :score="20" />
        <bonus-tr name="小顺子" :score="30" />
        <bonus-tr name="四连" :score="40" />
        <bonus-tr name="大顺子" :score="60" />
        <bonus-tr name="五连" :score="100" />
        <total-tr name="骰子点数和" :score="0" />
        <total-tr name="本轮总分" :score="0" />
        <total-tr name="当前筹码" :score="0" />
        <view class="lock-area">
          
        </view>
      </view>
      <view class="action-area">
        <view v-if="lock && !auto" class="action-common-area">
          <text class="game-btn">确认锁定</text>
        </view>
        <view v-if="double && !auto" class="action-common-area">
          <image class="svg-btn" src="../../images/game-control/minus-btn.svg" @tap="decMultiplier" />
          <text class="game-btn">{{ actionMultiplierText }}</text>
          <image class="svg-btn" src="../../images/game-control/plus-btn.svg" @tap="incMultiplier" />
        </view>
        <view v-if="auto" class="action-common-area">
          <text class="game-btn">取消托管</text>
        </view>
        <text v-if="!auto" class="auto-btn">托管</text>
      </view>
    </view>

    <view v-else class="player-view">
      <player-card class="player-card-margin" name="WinTP" avatar="../../images/user.png" :chips="500" :score="123" :dice-data="[1, 2, 3, 4, 5]" top-player />
      <player-card class="player-card-margin" name="Blossom的那一束阳光" avatar="../../images/user.png" :chips="2010" :score="135" :dice-data="[1, 2, 2, 6, 6]" />
      <player-card class="player-card-margin" name="Blossom的那一束阳光" avatar="../../images/user.png" :chips="2010" :score="135" :dice-data="[1, 2, 2, 6, 6]" />
      <player-card class="player-card-margin" name="Blossom的那一束阳光" avatar="../../images/user.png" :chips="2010" :score="135" :dice-data="[1, 2, 2, 6, 6]" />
      <player-card class="player-card-margin" name="Blossom的那一束阳光" avatar="../../images/user.png" :chips="2010" :score="135" :dice-data="[1, 2, 2, 6, 6]" />
      <player-card class="player-card-margin" name="Blossom的那一束阳光" avatar="../../images/user.png" :chips="2010" :score="135" :dice-data="[1, 2, 2, 6, 6]" />
      <player-card class="player-card-margin" name="Blossom的那一束阳光" avatar="../../images/user.png" :chips="2010" :score="135" :dice-data="[1, 2, 2, 6, 6]" />
      <player-card class="player-card-margin" name="Blossom的那一束阳光" avatar="../../images/user.png" :chips="2010" :score="135" :dice-data="[1, 2, 2, 6, 6]" />
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { ref, computed } from 'vue'
import bonusTr from '../../components/game/bonus-tr.vue'
import totalTr from '../../components/game/total-tr.vue'
import playerCard from '../../components/game/player-card.vue'
import '../../style/common.css'
import './game.css'

useLoad(() => {
  Taro.hideHomeButton()
  Taro.setNavigationBarTitle({title: 'WinTP的回合'})
})

const incMultiplier = () => {
  actionMultiplier.value = Math.min(actionMultiplier.value + 1, 3);
}

const decMultiplier = () => {
  actionMultiplier.value = Math.max(actionMultiplier.value - 1, 0);
}

const togglePlayerView = () => {
  showPlayerView.value = !showPlayerView.value
}

let showPlayerView = ref(true)

let auto = ref(false)
let lock = ref(true)
let double = ref(false)

let actionMultiplier = ref(0)

let actionMultiplierText = computed(() => {
  if (actionMultiplier.value == 0) {
    return '不加倍'
  }
  return `${actionMultiplier.value}倍`
})

</script>