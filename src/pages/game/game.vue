<template>
  <view class="page-game">
    <game-info :avatar="viewPlayerData.avatar" :multiplier="gameGlobalInfo.multiplier" :current-game="gameGlobalInfo.currentGame"
      :games="gameGlobalInfo.games" @toggle-view="togglePlayerListView" @tap-exit="exitGame" />
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
          <text class="game-btn" @tap="toggleAuto">取消托管</text>
        </view>
        <text v-if="!showAutoControl" class="auto-btn" @tap="toggleAuto" >托管</text>
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
 * 退出本次游戏
 */
const exitGame = () => {
  Taro.showModal({
    title: '退出游戏',
    content: '你确定要退出本次游戏？',
    confirmText: '是',
    cancelText: '否'
  }).then(result => {
    if (result.confirm) {
      Taro.reLaunch({
        url: '/pages/home/home'
      })
    }
  })
}

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
 * 异步延时
 * @param {number} time 毫秒数
 */
const sleep = async time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
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
 * 切换托管模式
 */
const toggleAuto = () => {
  gameStore.togglePlayerAuto(viewPlayerIndex.value)
}

/**
 * 根据游戏动作更改页面状态
 * @param {actTypes.GameAction} action 游戏动作
 */
const dispatchAction = async action => {
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
        await sleep(1500)
        let rollResult = gameStore.gd.rollDice()
        //第三轮，全部锁定
        if (gameGlobalInfo.value.currentRound == 3) {
          gameStore.gd.setLockedBitmap(0b11111)
          await sleep(1500)
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
        }
        else {
          //否则正常进入锁定阶段并刷新固定骰子
          fixLockedDice()
          currentStage.value = GameStage.LOCK
          showStageToast()
          
        }
      }
      else {
        //有投掷结果就自动切换到锁定阶段，仅限于对战模式，这里比较特殊
        if (action.param !== undefined) {
          gameStore.gd.rollDice(action.param)
          //第三轮，全部锁定
          if (gameGlobalInfo.value.currentRound == 3) {
            gameStore.gd.setLockedBitmap(0b11111)
            await sleep(1500)
            //最后一轮投掷结束
            if (gameGlobalInfo.value.currentPlayerIndex === playerNumber.value - 1) {
              dispatchAction({
                type: actTypes.ActionType.FINISH_GAME,
                id: null
              })
            }
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
          dispatchAction({
            type: actTypes.ActionType.DOUBLE,
            id: null
          })
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
          dispatchAction({
            type: actTypes.ActionType.ROLL_DICE,
            id: null
          })
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
      await sleep(2500)
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
      break
  }
}

/**
 * 获取当前游戏阶段的CPU决策
 * @returns {number} 如果阶段为LOCK，返回决策的锁定位图；如果阶段为DOUBLE，返回决策的加倍数
 */
const genCPUDecision = () => {
  let currentround = game.Globalinfo.currentRound;//获取当前轮数，这里不知有没有问题

    let allplayer = gameStore.gd.getPlayerDataAll();//获取所有玩家的游戏数据
    let playerdata = gameStore.gd.getPlayerData();//获取当前玩家游戏数据
    let rank = allplayer.length;//预设当前玩家排名为最后一名
    let rank1 = allplayer.length;//预设当前玩家排名为最后一名
    for(let i = 0;i < allplayer.length; i++){
        if(allplayer[i].id != playerdata.id){
            if(gameStore.gd.getPlayerScoreInfo(i).totalScore < gameStore.gd.getPlayerScoreInfo().totalScore){//若这个人总分比当前玩家高
                rank -= 1;//排名加一
            }
            else if(gameStore.gd.getPlayerScoreInfo(i).totalScore == gameStore.gd.getPlayerScoreInfo().totalScore){
                rank1 -=1;//用于判断并列第一的情况
            }
        }
    }

    if (currentStage.value === GameStage.LOCK){
        let lockedDiceIndicesValue = [...lockedDiceIndices.value];
        let freeDiceIndicesValue = [...freeDiceIndices.value];
        let num = 0;
        let flag = 0;
        for(let i = 4;i > 4 - lockedDiceIndicesValue.length;i --){
            num += lockedDiceIndicesValue[flag] * Math.pow(6,i);
            flag ++;
        }

        var result = []

        function getPlayerScoreInfo(dicedata = []) {//用于判断总分
            let bonusscore = 0;
            let dicescore = 0;
            let totalscore = 0;
            /**
             * 计算骰子点数和
             */
            for(let i = 0;i < 5;i ++){//骰子点数和
                dicescore += dicedata[i];
            }
        
            /**
             * 接下来判断奖励分
             */
            let diceTypeNum = [0,0,0,0,0,0,0];//用于记录每种骰子的数量
            for(let i = 0;i < 5;i ++){
                diceTypeNum[dicedata[i]] += 1;
            }
            let sum1 = 0;//用于判断是否大顺子
            for(let i = 1;i < 6;i ++){
                if(diceTypeNum[i] == 1){
                    sum1 ++;
                    continue;
                }
                else {
                    break;
                }
            }
            let sum2 = 0;//用于判断是否大顺子
            for(let i = 2;i < 7;i ++){
                if(diceTypeNum[i] == 1){
                    sum2 ++;
                    continue;
                }
                else {
                    break;
                }
            }
            if(sum1 == 5 || sum2 == 5){//满足其一
                bonusscore = 60;
                totalscore = bonusscore + dicescore;
                return totalscore
            }
        
            for(let i = 1;i < 7;i ++){//其他奖励分类型
                if(diceTypeNum[i] == 5){//五连
                    bonusscore = 100;
                    break;
                }
                else if(diceTypeNum[i] == 4){//四连
                    bonusscore = 40;
                    break;
                }
                else if(diceTypeNum[i] == 3){//三连或葫芦
                    let flag = false;
                    for(let j = 1;j < 7;j ++){
                        if(diceTypeNum[j] == 2){//葫芦
                            bonusscore = 20;
                            flag = true;
                        }
                    }
                    if(flag){
                        break;
                    }
                    bonusscore = 10;//三连
                    break;
                }
                else if(diceTypeNum[i] == 2){//双对
                    for(let j = i + 1;j < 7;j ++){
                        if(diceTypeNum[j] == 2){//双对
                            bonusscore = 10;
                            break;
                        }
                    }
                }
                let sum1 = 0;//小顺子1
                let sum2 = 0;//小顺子2
                let sum3 = 0;//小顺子3
                for(let k = 1;k < 5;k++){//小顺子1
                    if(diceTypeNum[k] >= 1){
                        sum1 ++;
                    }
                };
                for(let k = 2;k < 6;k++){//小顺子2
                    if(diceTypeNum[k] >= 1){
                        sum2 ++;
                    }
                };
                for(let k = 3;k < 7;k++){//小顺子3
                    if(diceTypeNum[k] >= 1){
                        sum3 ++;
                    }
                };
                if(sum1 == 4 || sum2 == 4 || sum3 == 4){
                    bonusscore = 30;
                    break;
                }
            }
            totalscore = bonusscore + dicescore;
            return totalscore;
        }

        for(let i = 0;i <= freeDiceIndicesValue.length;i ++){ //代表从一个投到free区的个数个


            //selected数组包含已经选中的元素
            //arr数组包含未选中元素数组，size表示还需选取元素的个数
            function _combine(selected,arr,size){
                //如果size===0，则一次组合完成，存入result数组并返回
                if(size===0){
                    result.push(selected)
                    return
                }
                //遍历所有可能选中的元素，遍历的次数为数组长度减去(size-1)
                for(let j = 0;j<arr.length-(size-1);j++){
                    //复制数组，避免对selected数组数据的更改
                    let temp = selected.slice()
                    temp.push(arr[j])
                    _combine(temp,arr.slice(j+1),size-1)
                }
            }

            _combine([], freeDiceIndicesValue, i);

        }


        //console.log(result);


        let keep = num;//保留num
        let index = 0//result的下标，记录哪个期望最大
        let expect = 0;//期望值
        for(let i = 0;i < result.length; i ++){
            
            num = keep;
            let lockbitnum = lockedDiceIndicesValue.length;
            flag = 0;
            for(let j = 4 - lockbitnum; j > 4 - lockbitnum - result[i].length;j --){
                num += result[i][flag] * Math.pow(6,j);
                flag ++;
            }

            if(freeDiceIndicesValue.length - result[i].length == 0){//没有可活动的骰子了
                let concatenatedArray = lockedDiceIndicesValue.concat(result[i]);
                let total = getPlayerScoreInfo(concatenatedArray);
                if(total > expect){
                    expect = total;
                    index = i;
                }
            }
            else if(freeDiceIndicesValue.length - result[i].length == 1){//还有一个可活动的骰子
                let concatenatedArray = lockedDiceIndicesValue.concat(result[i]);
                let total = 0;
                for(let j = 1;j < 7;j ++){
                    let newarr = [...concatenatedArray];
                    newarr.push(j);
                    total += getPlayerScoreInfo(newarr);
                }
                let average = total / 6;
                if(average > expect){
                    expect = average;
                    index = i;
                }
            }
            else if(freeDiceIndicesValue.length - result[i].length == 2){//还有两个可活动的骰子
                let concatenatedArray = lockedDiceIndicesValue.concat(result[i]);
                let total = 0;
                for(let j = 1;j < 7;j ++){//倒数第二位骰子的数值
                    for(let k = 1;k < 7;k ++){//倒数第一位骰子的数值
                        let newarr = [...concatenatedArray];
                        newarr.push(j);
                        newarr.push(k);
                        total += getPlayerScoreInfo(newarr);
                    }
                }
                let average = total / 36;
                if(average > expect){
                    expect = average;
                    index = i;
                }
            }
            else if(freeDiceIndicesValue.length - result[i].length == 3){//还有三个可活动的骰子
                let concatenatedArray = lockedDiceIndicesValue.concat(result[i]);
                let total = 0;
                for(let j = 1;j < 7;j ++){//倒数第三位骰子的数值
                    for(let k = 1;k < 7;k ++){//倒数第二位骰子的数值
                        for(let l = 1;l < 7;l ++){
                            let newarr = [...concatenatedArray];
                            newarr.push(j);
                            newarr.push(k);
                            newarr.push(l);
                            total += getPlayerScoreInfo(newarr);
                        }
                    }
                }
                let average = total/216;
                if(average > expect){
                    expect = average;
                    index = i;
                }
            }
            else if(freeDiceIndicesValue.length - result[i].length == 4){//还有四个可活动的骰子
                let concatenatedArray = lockedDiceIndicesValue.concat(result[i]);
                let total = 0;
                for(let j = 1;j < 7;j ++){//倒数第四位骰子的数值
                    for(let k = 1;k < 7;k ++){//倒数第三位骰子的数值
                        for(let l = 1;l < 7;l ++){//倒数第二位骰子的数值
                            for(let m = 1;m < 7;m ++){//倒数第一位骰子的数值
                                let newarr = [...concatenatedArray];
                                newarr.push(j);
                                newarr.push(k);
                                newarr.push(l);
                                newarr.push(m);
                                total += getPlayerScoreInfo(newarr);
                            }
                        }
                    }
                }
                let average = total/1296;
                if(average > expect){
                    expect = average;
                    index = i;
                }
            }
            else{//五个全摇
                if(27.222 > expect){
                    expect = 27.222;
                    index = i;
                }
            }
        }
        // console.log(index);
        // console.log(result[index]);//输出要锁定的骰子
        let bitmap = 0;
        let diceTypeNum = [0,0,0,0,0,0,0];//用于记录每种骰子的数量
        let concatenatedArray = lockedDiceIndicesValue.concat(result[index]);
        concatenatedArray.sort();
        for(let i = 0;i < concatenatedArray.length;i ++){
            diceTypeNum[concatenatedArray[i]] ++;
        }
        for(let i = 0;i < concatenatedArray.length;i++){
            for(let k = 1;k < 7;k++){
                if(concatenatedArray[i] == k && diceTypeNum[k] > 0){
                    diceTypeNum[k] --;
                    bitmap += Math.pow(2,i);
                    break;
                }
            }
        }
        console.log(bitmap);
        return bitmap;
    }
    else {
        if(rank == 1){
          return 3;
        }
        if(currentround == 3 && rank1 == 1){
          return 3;
        }
        return 0;
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