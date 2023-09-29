<template>
  <view class="page-common">
    <user-bar />
    <menu-item-text class="page-title" icon-src="../../images/menu-dices/about-dice.svg" btn-color="#FFFFFF">关于</menu-item-text>
    <text class="rule-text">
      暂无
    </text>
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
import './about.css'
</script>