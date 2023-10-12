<template>
  <view class="page-common">
    <user-bar />
    <view class="logo">
      <image class="logo-img" src="../../images/menu-logo.svg" mode="aspectFit" />
    </view>
    <view class="menu-btns">
      <menu-item-navigator url="/pages/offline-config/config" class="menu-btn" icon-src="../../images/menu-dices/offline-dice.svg" btn-color="#F8DD46">本地对战</menu-item-navigator>
      <menu-item-navigator url="/pages/loading/loading" class="menu-btn" icon-src="../../images/menu-dices/online-dice.svg" btn-color="#CE3F3F">在线匹配</menu-item-navigator>
      <menu-item-navigator url="/pages/rule/p1" class="menu-btn" icon-src="../../images/menu-dices/rule-dice.svg" btn-color="#62C848">游戏规则</menu-item-navigator>
      <menu-item-navigator url="/pages/check-information/check" class="menu-btn" icon-src="../../images/menu-dices/information-dice.svg" btn-color="#FFFFFF">查看资料</menu-item-navigator>
      <menu-item-navigator url="/pages/about/about" class="menu-btn" icon-src="../../images/menu-dices/about-dice.svg" btn-color="#3676F2">关于</menu-item-navigator>
    </view>
  </view>
</template>

<script setup>
import userBar from '../../components/common/user-bar.vue'
import menuItemNavigator from '../../components/common/menu-item-navigator.vue'
import '../../style/common.css'
import './home.css'
import '../../images/menu-dices/offline-dice.svg'
import '../../images/menu-dices/online-dice.svg'
import '../../images/menu-dices/rule-dice.svg'
import '../../images/menu-dices/about-dice.svg'
import '../../images/menu-dices/information-dice.svg'
import { View } from '@tarojs/components'

</script>
