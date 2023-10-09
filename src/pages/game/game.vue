<template>
  <view class="page-game">
    <game-info :avatar="viewPlayerData.avatar" :multiplier="gameGlobalInfo.multiplier" :current-game="gameGlobalInfo.currentGame"
      :games="gameGlobalInfo.games" @toggle-view="togglePlayerListView" />
    <view v-if="currentView === GameView.MAIN" class="game-view">
      <view class="game-area">
        <view class="free-area">
          <image-dice v-for="index of freeDiceIndices" class="game-dice" :key="globalStore.getGlobalKey(index)"
            :dice="viewPlayerData.diceData[index]" @tap-dice="lockDice(index)" />
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
          <image-dice v-for="index of lockedDiceIndices" class="game-dice" :key="globalStore.getGlobalKey(index)"
            :dice="viewPlayerData.diceData[index]" @tap-dice="freeDice(index)" />
        </view>
      </view>
      <view class="action-area">
        <view v-if="showLockControl" class="action-common-area">
          <text class="game-btn">确认锁定</text>
        </view>
        <view v-if="showDoubleControl" class="action-common-area">
          <image class="svg-btn" src="../../images/game-control/minus-btn.svg" @tap="decMultiplier" />
          <text class="game-btn">{{ actionMultiplierText }}</text>
          <image class="svg-btn" src="../../images/game-control/plus-btn.svg" @tap="incMultiplier" />
        </view>
        <view v-if="showAutoControl" class="action-common-area">
          <text class="game-btn">取消托管</text>
        </view>
        <text v-if="!showAutoControl" class="auto-btn">托管</text>
      </view>
    </view>

    <view v-if="currentView === GameView.PLAYER_LIST" class="player-view">
      <player-card v-for="(playerData, index) of gameStore.gd.getPlayerDataAll()" class="player-card-margin" :key="globalStore.getGlobalKey(index)"
        :name="playerData.name" :avatar="playerData.avatar" :chips="playerData.chips" :score="gameStore.gd.getPlayerScoreInfo(index).totalScore"
        :dice-data="playerData.diceData" @tap-card="switchPlayerView(index)" />
    </view>

    <view v-if="currentView === GameView.KNOCKOUT" class="end-view">
      <text class="end-view-text">{{ knockoutPlayerStr }}</text>
      <image src="../../images/knockout.svg" />
      <text class="end-view-text">击飞！</text>
    </view>

    <view v-if="currentView === GameView.GAME_OVER" class="end-view">
      <image src="../../images/gameover.svg" />
      <text class="end-view-text">游戏结束</text>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { ref, computed, watch } from 'vue'
import gameInfo from '../../components/game/game-info.vue'
import imageDice from '../../components/game/image-dice.vue'
import bonusTr from '../../components/game/bonus-tr.vue'
import totalTr from '../../components/game/total-tr.vue'
import playerCard from '../../components/game/player-card.vue'
import { useGlobalStore } from '../../stores/global'
import { GameMode, useGameStore } from '../../stores/game'
import * as actTypes from '../../game-action'
import * as gdTypes from '../../game-data/types'
import '../../style/common.css'
import './game.css'

/**
 * 游戏阶段枚举
 * @readonly
 * @enum {number}
 */
const GameStage = {
  /**
   * 投掷阶段
   */
  ROLL: 0,
  /**
   * 锁定阶段
   */
  LOCK: 1,
  /**
   * 加倍阶段
   */
  DOUBLE: 2
}

/**
 * 游戏视图
 * @readonly
 * @enum {number}
 */
 const GameView = {
  /**
   * 主视图
   */
  MAIN: 0,
  /**
   * 玩家列表视图
   */
  PLAYER_LIST: 1,
  /**
   * 游戏结束视图
   */
  GAME_OVER: 2,
  /**
   * 击飞视图
   */
  KNOCKOUT: 3
}

/**
 * 游戏阶段字符串转换表
 */
const stageStrTable = [
  '投掷阶段',
  '锁定阶段',
  '加倍阶段'
]

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

/**
 * 击飞玩家的数据索引列表
 */
const knockoutPlayerIndex = ref([])

const knockoutPlayerStr = computed(() => {
  let playerName = []
  knockoutPlayerIndex.value.forEach(v => {
    playerName.push(gameStore.gd.getPlayerData(v).name)
  })
  return playerName.join('，')
})

/**
 * 当前游戏阶段
 */
const currentStage = ref(GameStage.LOCK)

/**
 * 当前游戏视图
 */
let currentView = ref(GameView.MAIN)

/**
 * 当前倒计时
 */
const countdown = ref(10)

/**
 * 投掷区骰子索引列表
 */
const freeDiceIndices = computed(() => {
  let indices = []
  for (let i = 0; i < 5; i++) {
    if (!gameStore.gd.getLockedByIndex(i, viewPlayerIndex.value))
      indices.push(i)
  }
  return indices
})

/**
 * 锁定区骰子索引列表
 */
const lockedDiceIndices = computed(() => {
  let indices = [0, 1, 2, 3, 4]
  indices = indices.filter(i => {
    return freeDiceIndices.value.indexOf(i) == -1
  })
  return indices
})

watch(countdown, updateTitle)
watch(currentStage, updateTitle)
watch(gameStore.gd.getPlayerData(), updateTitle)

/**
 * 更新标题
 */
const updateTitle = (ov, nv) => {
  let playerName = gameStore.gd.getPlayerData().name
  let stageStr = stageStrTable[currentStage.value]
  Taro.setNavigationBarTitle({title: `${playerName} - ${stageStr} - 10`})
}

/**
 * 是否显示锁定控件
 */
const showLockControl = computed(() => {
  return gameGlobalInfo.value.currentPlayerIndex === gameStore.playerIndex
    && viewPlayerIndex.value === gameStore.playerIndex
    && !gameStore.getPlayerAuto(gameStore.playerIndex)
    && currentStage.value === GameStage.LOCK
})

/**
 * 是否显示加倍控件
 */
const showDoubleControl = computed(() => {
  return gameGlobalInfo.value.currentPlayerIndex === gameStore.playerIndex
    && viewPlayerIndex.value === gameStore.playerIndex
    && !gameStore.getPlayerAuto(gameStore.playerIndex)
    && currentStage.value === GameStage.DOUBLE
})

/**
 * 是否显示取消托管控件
 */
const showAutoControl = computed(() => {
  if (gameStore.mode === GameMode.OFFLINE) {
    return gameStore.getPlayerAuto(viewPlayerIndex.value)
  }
  return viewPlayerIndex.value === gameStore.playerIndex
    && gameStore.getPlayerAuto(gameStore.playerIndex)
})

/**
 * 切换玩家列表视图
 */
const togglePlayerListView = () => {
  if (currentView.value == GameView.MAIN || currentView.value == GameView.PLAYER_LIST) {
    currentView.value = currentView.value == GameView.MAIN ? GameView.PLAYER_LIST : GameView.MAIN
  }
}

/**
 * 切换主视图查看的玩家
 * @param {number} index 玩家数据索引
 */
const switchPlayerView = index => {
  currentView.value = GameView.MAIN
  viewPlayerIndex.value = index
}

/**
 * 锁定指定骰子
 * @param {number} index 骰子索引
 */
const lockDice = index => {
  if (!showLockControl.value) return
  let bitmap = viewPlayerData.value.diceLockedBitmap | (1 << index)
  dispatchAction({
    type: actTypes.ActionType.LOCK_DICE,
    id: viewPlayerData.value.id,
    param: bitmap
  })
}

/**
 * 释放指定骰子
 * @param {number} index 骰子索引
 */
 const freeDice = index => {
  if (!showLockControl.value) return
  let bitmap = viewPlayerData.value.diceLockedBitmap & ~(1 << index)
  dispatchAction({
    type: actTypes.ActionType.LOCK_DICE,
    id: viewPlayerData.value.id,
    param: bitmap
  })
}

/**
 * 根据游戏动作更改页面状态
 * @param {actTypes.GameAction} action 游戏动作
 */
const dispatchAction = (action) => {
  let playerIndex = -1;
  let playerDataList = gameStore.gd.getPlayerDataAll()
  for (let i = 0; i < playerDataList.length; i++) {
    if (playerDataList[i].id == action.id) {
      playerIndex = i;
      break;
    }
  }
  if (gameStore.mode === GameMode.OFFLINE) {
    switch(action.type) {
      case actTypes.ActionType.LOCK_DICE:
        gameStore.gd.setLockedBitmap(action.param, playerIndex)
        break;
    }
  }
}

const incMultiplier = () => {
  actionMultiplier.value = Math.min(actionMultiplier.value + 1, 3);
}

const decMultiplier = () => {
  actionMultiplier.value = Math.max(actionMultiplier.value - 1, 0);
}

let actionMultiplier = ref(0)

let actionMultiplierText = computed(() => {
  if (actionMultiplier.value == 0) {
    return '不加倍'
  }
  return `${actionMultiplier.value}倍`
})

useLoad(() => {
  Taro.hideHomeButton()
  updateTitle()
})

</script>