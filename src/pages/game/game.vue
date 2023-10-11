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
          <text class="game-btn" @tap="finishLockSelection">确认锁定</text>
        </view>
        <view v-if="showDoubleControl" class="action-common-area">
          <image class="svg-btn" src="../../images/game-control/minus-btn.svg" @tap="decMultiplier" />
          <text class="game-btn" @tap="double">{{ actionMultiplierText }}</text>
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
        :dice-data="playerData.diceData" @tap-card="switchPlayerView(index)" :top-player="index === topPlayerIndex" />
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
 * 筹码数最高的玩家数据索引
 */
const topPlayerIndex = computed(() => {
  let index = -1, topChips = 0 
  gameStore.gd.getPlayerDataAll().forEach((data, i) => {
    if (data.chips > topChips) {
      topChips = data.chips
      index = i
    }
  })
  return index
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
const currentStage = ref(GameStage.ROLL)

/**
 * 当前游戏视图
 */
let currentView = ref(GameView.MAIN)

/**
 * 固定在锁定区的骰子
 */
let fixedDiceIndices = ref([])

/**
 * 投掷区骰子索引列表
 */
const freeDiceIndices = computed(() => {
  let indices = [0, 1, 2, 3, 4]
  indices = indices.filter(i => {
    return lockedDiceIndices.value.indexOf(i) == -1
  })
  return indices
})

/**
 * 锁定区骰子索引列表
 */
const lockedDiceIndices = computed(() => {
  let indices = [...fixedDiceIndices.value]
  for (let i = 0; i < 5; i++) {
    if (gameStore.gd.getLockedByIndex(i, viewPlayerIndex.value)
      && fixedDiceIndices.value.indexOf(i) === -1)
      indices.push(i)
  }
  return indices
})

/**
 * 固定当前锁定区内所有的骰子
 */
const fixLockedDice = () => {
  let indices = []
  for (let i = 0; i < 5; i++) {
    if (gameStore.gd.getLockedByIndex(i, viewPlayerIndex.value))
      indices.push(i)
  }
  fixedDiceIndices.value = indices
}

watch(currentStage, () => updateTitle())
watch(() => gameStore.gd.getPlayerData(), () => updateTitle())
watch(currentView, () => redirectRank())

/**
 * 更新标题
 */
const updateTitle = () => {
  let playerName = gameStore.gd.getPlayerData().name
  let stageStr = stageStrTable[currentStage.value]
  Taro.setNavigationBarTitle({title: `${playerName} - ${stageStr}`})
}

/**
 * 出现游戏结束的视图时跳转到结算页面
 */
const redirectRank = () => {
  if (currentView.value == GameView.KNOCKOUT || currentView.value == GameView.GAME_OVER) {
    setTimeout(() => {
      Taro.reLaunch({
        url: '/pages/game/rank'
      })
    }, 5000)
  }
}

/**
 * 显示阶段提示框
 */
const showStageToast = () => {
  let stageStr = stageStrTable[currentStage.value]
  Taro.showToast({
    title: stageStr,
    icon: 'none'
  })
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
 * 是否是该客户端玩家的回合
 */
const isCurrentPlayerTurn = computed(() => {
  return gameGlobalInfo.value.currentPlayerIndex === gameStore.playerIndex
})

/**
 * 玩家数量
 */
const playerNumber = computed(() => {
  return gameStore.gd.getPlayerDataAll().length
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
  if (fixedDiceIndices.value.indexOf(index) !== -1) return
  let bitmap = viewPlayerData.value.diceLockedBitmap & ~(1 << index)
  dispatchAction({
    type: actTypes.ActionType.LOCK_DICE,
    id: viewPlayerData.value.id,
    param: bitmap
  })
}

/**
 * 切换当前玩家的数据索引，同时根据模式设置游戏存储的playerIndex，以及切换玩家视图
 * @param {number} index 玩家数据索引，若为-1，则循环选取下一位玩家
 */
const switchPlayer = (index = -1) => {
  let doSwitchView = viewPlayerIndex.value == gameGlobalInfo.value.currentPlayerIndex
  gameStore.gd.switchPlayer(index)
  if (doSwitchView || isCurrentPlayerTurn.value) {
    switchPlayerView(gameGlobalInfo.value.currentPlayerIndex)
  }
  if (gameStore.mode === GameMode.OFFLINE) {
    gameStore.playerIndex = gameGlobalInfo.value.currentPlayerIndex
  }
}

/**
 * 完成锁定动作
 */
const finishLockSelection = () => {
  if (gameGlobalInfo.value.currentPlayerIndex === playerNumber.value - 1) {
    //转加倍阶段
    switchPlayer()
    dispatchAction({
      type: actTypes.ActionType.DOUBLE,
      id: null
    })
  }
  else {
    switchPlayer()
    dispatchAction({
      type: actTypes.ActionType.ROLL_DICE,
      id: null
    })
  }
}

/**
 * 投递骰子投掷动作
 */
const rollDice = () => {
  dispatchAction({
    type: actTypes.ActionType.ROLL_DICE,
    id: viewPlayerData.value.id
  })
}

/**
 * 投递加倍动作
 */
const double = () => {
  //加倍并切换下一位玩家
  dispatchAction({
    type: actTypes.ActionType.DOUBLE,
    id: null,
    param: actionMultiplier.value
  })
}

/**
 * 根据游戏动作更改页面状态
 * @param {actTypes.GameAction} action 游戏动作
 */
const dispatchAction = action => {
  let playerIndex = -1;
  if (action.id !== null) {
    let playerDataList = gameStore.gd.getPlayerDataAll()
    for (let i = 0; i < playerDataList.length; i++) {
      if (playerDataList[i].id == action.id) {
        playerIndex = i;
        switchPlayer(playerIndex)
        break;
      }
    }
  }
  switch(action.type) {
    case actTypes.ActionType.ROLL_DICE:
      if (isCurrentPlayerTurn.value) {
        currentStage.value = GameStage.ROLL
        setTimeout(() => {
          let rollResult = gameStore.gd.rollDice()
          //第三轮，全部锁定
          if (gameGlobalInfo.value.currentRound == 3) {
            gameStore.gd.setLockedBitmap(0b11111)
            setTimeout(() => {
              //最后一轮投掷结束
              if (gameGlobalInfo.value.currentPlayerIndex === playerNumber.value - 1) {
                dispatchAction({
                  type: actTypes.ActionType.FINISH_GAME,
                  id: null
                })
              }
              else if (gameStore.mode == GameMode.OFFLINE) {
                //下一位进行投掷
                switchPlayer()
                dispatchAction({
                  type: actTypes.ActionType.ROLL_DICE,
                  id: null
                })
              }
            }, 1500)
          }
          else {
            //否则正常进入锁定阶段并刷新固定骰子
            fixLockedDice()
            currentStage.value = GameStage.LOCK
            showStageToast()
          }
        }, 1500)
      }
      else {
        //有投掷结果就自动切换到锁定阶段，仅限于对战模式，这里比较特殊
        if (action.param !== undefined) {
          gameStore.gd.rollDice(action.param)
          //第三轮，全部锁定
          if (gameGlobalInfo.value.currentRound == 3) {
            gameStore.gd.setLockedBitmap(0b11111)
            setTimeout(() => {
              //最后一轮投掷结束
              if (gameGlobalInfo.value.currentPlayerIndex === playerNumber.value - 1) {
                dispatchAction({
                  type: actTypes.ActionType.FINISH_GAME,
                  id: null
                })
              }
            }, 1500)
          }
          else {
            fixLockedDice()
            currentStage.value = GameStage.LOCK
            showStageToast()
          }
        }
        else {
          currentStage.value = GameStage.ROLL
        }
      }
      break;
    case actTypes.ActionType.LOCK_DICE:
      gameStore.gd.setLockedBitmap(action.param, playerIndex)
      break;
    case actTypes.ActionType.DOUBLE:
      //无倍数传入，初始化并切换加倍阶段
      if (action.param === undefined) {
        actionMultiplier.value = 0
        currentStage.value = GameStage.DOUBLE
        showStageToast()
      }
      else {
        gameStore.gd.double(action.param)
        if (gameGlobalInfo.value.currentPlayerIndex === playerNumber.value - 1) {
          dispatchAction({
            type: actTypes.ActionType.FINISH_ROUND,
            id: null
          })
        }
        else if (isCurrentPlayerTurn.value) {
          switchPlayer()
          //避免递归
          setTimeout(() => {
            dispatchAction({
              type: actTypes.ActionType.DOUBLE,
              id: null
            })
          }, 0)
        }
      }
      break
    case actTypes.ActionType.FINISH_ROUND:
      gameStore.gd.finishRound()
      Taro.showToast({
        title: `第${gameGlobalInfo.value.currentRound}/3轮`,
        icon: 'none'
      })
      if (isCurrentPlayerTurn.value) {
        if (gameStore.mode === GameMode.OFFLINE) {
          switchPlayer()
          setTimeout(() => {
            dispatchAction({
              type: actTypes.ActionType.ROLL_DICE,
              id: null
            })
          }, 0)
        }
      }
      break
    case actTypes.ActionType.FINISH_GAME:
      let lastGame = gameGlobalInfo.value.currentGame == gameGlobalInfo.value.games;
      /**
       * @type {gdTypes.AllocateInfo}
       */
      let allocateInfo = gameStore.gd.finishGame()
      let totalChips = 0
      let topPlayerNames = []
      fixedDiceIndices.value = []
      allocateInfo.chipDifference.forEach(diff => totalChips += diff)
      allocateInfo.topPlayerData.forEach(data => topPlayerNames.push(data.name))
      Taro.showToast({
        title: `本局游戏结束，胜利者是${topPlayerNames.join('，')}，每位玩家赢得${totalChips}筹码`,
        icon: 'none',
        duration: 3000
      })
      setTimeout(() => {
        if (allocateInfo.knockoutPlayerIndex.length !== 0) {
          knockoutPlayerIndex.value = allocateInfo.knockoutPlayerIndex
          currentView.value = GameView.KNOCKOUT
        }
        else if (lastGame) {
          currentView.value = GameView.GAME_OVER
        }
        else {
          switchPlayer()
          dispatchAction({
            type: actTypes.ActionType.ROLL_DICE,
            id: null
          })
        }
      } ,3000)
      break
  }
}

/**
 * 获取当前游戏阶段的CPU决策
 * @returns {number} 如果阶段为LOCK，返回决策的锁定位图；如果阶段为DOUBLE，返回决策的加倍数
 */
const genCPUDecision = () => {
  if (currentStage.value === GameStage.LOCK) {
    gameStore.gd.getPlayerScoreInfo(7)
  }
  else {

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
  switchPlayerView(gameStore.playerIndex)
  if (isCurrentPlayerTurn.value) {
    rollDice()
  }
})

</script>