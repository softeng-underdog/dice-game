<template>
  <view class="page-game">
    <game-info :avatar="viewPlayerData.avatar" :multiplier="gameGlobalInfo.multiplier" :current-game="gameGlobalInfo.currentGame"
      :games="gameGlobalInfo.games" @toggle-view="togglePlayerView" />
    <view v-if="viewSelector == 0" class="game-view">
      <view class="game-area">
        <view class="free-area">
          <image-dice v-for="dice of viewPlayerData.diceData" class="game-dice" :key="globalStore.getGlobalKey(dice)" :dice="dice" />
        </view>
        <bonus-tr name="双对" :score="10" :achieved="viewPlayerScoreInfo.bonusType == gdTypes.BonusType.DOUBLE_PAIR" />
        <bonus-tr name="三连" :score="10" :achieved="viewPlayerScoreInfo.bonusType == gdTypes.BonusType.TRIPLE"/>
        <bonus-tr name="葫芦" :score="20" :achieved="viewPlayerScoreInfo.bonusType == gdTypes.BonusType.GOURD" />
        <bonus-tr name="小顺子" :score="30" :achieved="viewPlayerScoreInfo.bonusType == gdTypes.BonusType.SMALL_STRAIGHT" />
        <bonus-tr name="四连" :score="40" :achieved="viewPlayerScoreInfo.bonusType == gdTypes.BonusType.QUADRUPLE" />
        <bonus-tr name="大顺子" :score="60" :achieved="viewPlayerScoreInfo.bonusType == gdTypes.BonusType.BIG_STRAIGHT" />
        <bonus-tr name="五连" :score="100" :achieved="viewPlayerScoreInfo.bonusType == gdTypes.BonusType.QUINTUPLE" />
        <total-tr name="骰子点数和" :score="viewPlayerScoreInfo.diceScore" />
        <total-tr name="本轮总分" :score="viewPlayerScoreInfo.totalScore" />
        <total-tr name="当前筹码" :score="viewPlayerData.chips" />
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

    <view v-if="viewSelector == 1" class="player-view">
      <player-card v-for="(playerData, index) of gameStore.gd.getPlayerDataAll()" class="player-card-margin" :key="globalStore.getGlobalKey(index)" :name="playerData.name" :avatar="playerData.avatar" :chips="playerData.chips" :score="123" :dice-data="playerData.diceData" />
    </view>

    <view v-if="viewSelector == 2" class="end-view">
      <text class="end-view-text">WinTP，Blossom的那一束阳光</text>
      <image src="../../images/knockout.svg" />
      <text class="end-view-text">击飞！</text>
    </view>

    <view v-if="viewSelector == 3" class="end-view">
      <image src="../../images/gameover.svg" />
      <text class="end-view-text">游戏结束</text>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { ref, computed } from 'vue'
import gameInfo from '../../components/game/game-info.vue'
import imageDice from '../../components/game/image-dice.vue'
import bonusTr from '../../components/game/bonus-tr.vue'
import totalTr from '../../components/game/total-tr.vue'
import playerCard from '../../components/game/player-card.vue'
import { useGlobalStore } from '../../stores/global'
import { useGameStore } from '../../stores/game'
import * as actTypes from '../../game-action'
import * as gdTypes from '../../game-data/types'
import '../../style/common.css'
import './game.css'

const gameStore = useGameStore()
const globalStore = useGlobalStore()

/**
 * 游戏全局信息
 * @type {gdTypes.GlobalInfo}
 */
const gameGlobalInfo = computed(() => {
  return gameStore.gd.getGlobalInfo()
})

/**
 * 当前玩家视图对应的数据索引
 */
const viewPlayerIndex = ref(0)

/**
 * 当前玩家视图对应的玩家数据
 * @type {gdTypes.PlayerData}
 */
const viewPlayerData = computed(() => {
  return gameStore.gd.getPlayerData(viewPlayerIndex.value)
})

/**
 * 当前玩家视图对应的玩家分数信息
 * @type {gdTypes.ScoreInfo}
 */
const viewPlayerScoreInfo = computed(() => {
  return gameStore.gd.getPlayerScoreInfo(viewPlayerIndex.value)
})

useLoad(() => {
  Taro.hideHomeButton()
  Taro.setNavigationBarTitle({title: 'WinTP - 锁定阶段 - 10'})
})

/**
 * 根据游戏动作更改页面状态
 * @param {actTypes.GameAction} action 游戏动作
 */
const dispatchAction = (action) => {
  switch(action.type) {
    
  }
}

const incMultiplier = () => {
  actionMultiplier.value = Math.min(actionMultiplier.value + 1, 3);
}

const decMultiplier = () => {
  actionMultiplier.value = Math.max(actionMultiplier.value - 1, 0);
}

const togglePlayerView = () => {
  viewSelector.value = viewSelector.value == 0 ? 1 : 0
}

let viewSelector = ref(0)

let auto = ref(false)
let lock = ref(false)
let double = ref(true)

let actionMultiplier = ref(0)

let actionMultiplierText = computed(() => {
  if (actionMultiplier.value == 0) {
    return '不加倍'
  }
  return `${actionMultiplier.value}倍`
})

</script>