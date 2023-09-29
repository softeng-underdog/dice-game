<template>
  <view class="page-common">
    <user-bar />
    <menu-item-text class="page-title" icon-src="../../images/menu-dices/rule-dice.svg" btn-color="#62C848">游戏规则</menu-item-text>
    <text class="rule-text">
      三连：10分
    </text>
    <image class="dice-pattern" src="../../images/bonus-pattern/triple.svg" />
    <text class="rule-text">
      双对：10分
    </text>
    <image class="dice-pattern" src="../../images/bonus-pattern/double-pair.svg" />
    <text class="rule-text">
      葫芦：20分
    </text>
    <image class="dice-pattern" src="../../images/bonus-pattern/gourd.svg" />
    <text class="rule-text">
      小顺子：30分
    </text>
    <image class="dice-pattern" src="../../images/bonus-pattern/small-straight.svg" />
    <view class="flex-fill" />
    <view class="navigator-area">
      <navigator open-type="navigateBack">
        <image class="navigator-back" src="../../images/navigator-btn/back-btn.svg" />
      </navigator>
      <navigator url="/pages/rule-p3/rule-p3">
        <image class="navigator-next-page" src="../../images/navigator-btn/next-page-btn.svg" />
      </navigator>
    </view>
  </view>
</template>

<script setup>
import userBar from '../../components/common/user-bar.vue'
import menuItemText from '../../components/common/menu-item-text.vue'
import '../../style/common.css'
import './rule-p2.css'
</script>