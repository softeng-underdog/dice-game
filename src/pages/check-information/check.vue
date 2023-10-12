<template>
    <view class="page-common">
      <user-bar />
      <menu-item-text class="page-title" icon-src="../../images/menu-dices/information-dice.svg" btn-color="#FFFFFF">查看资料</menu-item-text>
      <view class="menu-btns">
        <menu-item-navigator url="/pages/personal-info/personal-info" class="menu-btn" icon-src="../../images/menu-dices/personal-info-dice.svg" btn-color="#FCECDD">个人资料</menu-item-navigator>
        <menu-item-navigator url="/pages/rank/rank" class="menu-btn" icon-src="../../images/menu-dices/rank-dice.svg" btn-color="#F7EBC3">排行榜</menu-item-navigator>
        <menu-item-navigator url="/pages/achievement/achievement" class="menu-btn" icon-src="../../images/menu-dices/achievement-dice.svg" btn-color="#7952B3">成就</menu-item-navigator>
      </view>
    <view class="navigator-area">
      <navigator open-type="navigateBack">
        <image class="navigator-back" src="../../images/navigator-btn/back-btn.svg" />
      </navigator>
    </view>
  </view>
</template>

<script setup>
import userBar from '../../components/common/user-bar.vue'
import menuItemNavigator from '../../components/common/menu-item-navigator.vue'
import MenuItemText from '../../components/common/menu-item-text.vue'
import '../../style/common.css'
import './check.css'
import '../../images/menu-dices/information-dice.svg'
import '../../images/menu-dices/personal-info-dice.svg'
import '../../images/menu-dices/rank-dice.svg'
import '../../images/menu-dices/achievement-dice.svg'
import { View } from '@tarojs/components'


</script>
  