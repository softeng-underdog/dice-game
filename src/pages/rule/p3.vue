<template>
  <view class="page-common">
    <user-bar />
    <menu-item-text class="page-title" icon-src="../../images/menu-dices/rule-dice.svg" btn-color="#62C848">游戏规则</menu-item-text>
    <text class="rule-text">
      四连：40分
    </text>
    <image class="dice-pattern" src="../../images/bonus-pattern/quadruple.svg" />
    <text class="rule-text">
      大顺子：60分
    </text>
    <image class="dice-pattern" src="../../images/bonus-pattern/big-straight.svg" />
    <text class="rule-text">
      五连：100分
    </text>
    <image class="dice-pattern" src="../../images/bonus-pattern/quintuple.svg" />
    <view class="flex-fill" />
    <view class="navigator-area">
      <navigator open-type="navigateBack">
        <image class="navigator-back" src="../../images/navigator-btn/back-btn.svg" />
      </navigator>
    </view>
  </view>
</template>

<script setup>
import userBar from '../../components/common/user-bar.vue'
import menuItemText from '../../components/common/menu-item-text.vue'
import '../../style/common.css'
import './p3.css'
</script>