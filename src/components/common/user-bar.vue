<template>
  <view class="user-bar" :style="statusBarMargin">
    <image class="user-avatar" :style="avatarSize" :src="globalStore.userAvatar"></image>
    <text class="user-nickname">你好！{{ globalStore.userNickname }}</text>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGlobalStore } from '../../stores/global'
import Taro from '@tarojs/taro'
import '../style/user-bar.css'

const globalStore = useGlobalStore()

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

onMounted(() => {
  globalStore.fetchUserInfo()
})

</script>