<template>
  <view class="page-common">
    <user-bar />
    <menu-item-text class="page-title" icon-src="../../images/menu-dices/rule-dice.svg" btn-color="#62C848">游戏规则</menu-item-text>
    <text class="rule-text">
      ·  进入游戏，选择游戏模式后，设置游戏局数和玩家个人筹码数
    </text>
    <text class="rule-text">
      ·  每一局游戏内有三轮投掷机会，玩家一人一次轮流投掷骰子，每个玩家有5个骰子
    </text>
    <text class="rule-text">
      ·  前两次投掷骰子之后可以选择锁定0~5个骰子，锁定的骰子位于选定区域不再改变
    </text>
    <text class="rule-text">
      ·  前两轮每轮投掷结束并在所有玩家锁定骰子后，每位玩家可以选择增加倍率：0，1，2，3。选择完成后进入下一轮
    </text>
    <text class="rule-text">
      ·  第三轮投掷结束后，所有玩家的全部骰子自动锁定并进行计分（得分为五个骰子的点数总和+奖励分），得出最终结果，筹码划分
    </text>
    <view class="flex-fill" />
    <view class="navigator-area">
      <navigator open-type="navigateBack">
        <image class="navigator-back" src="../../images/navigator-btn/back-btn.svg" />
      </navigator>
      <navigator url="/pages/rule/p2">
        <image class="navigator-bonus-rule" src="../../images/navigator-btn/bonus-rule-btn.svg" />
      </navigator>
    </view>
  </view>
</template>

<script setup>
import userBar from '../../components/common/user-bar.vue'
import menuItemText from '../../components/common/menu-item-text.vue'
import '../../style/common.css'
import './p1.css'
</script>