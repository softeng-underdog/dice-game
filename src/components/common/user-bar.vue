<template>
    <view class="user-bar" :style="statusBarMargin">
        <image class="user-avatar" :style="avatarSize" src="../../images/user.png"></image>
        <text class="user-nickname">Hello! Loser</text>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import '../style/user-bar.css'

const menuButtonInfo = Taro.getMenuButtonBoundingClientRect()
const barHeight = menuButtonInfo.height + 21;

const statusBarMargin = ref({
  marginTop: `${menuButtonInfo.top}px`,
  height: `${barHeight}px`
})
const avatarSize = ref({
    width: `${barHeight}px`,
    height: `${barHeight}px`
})
</script>