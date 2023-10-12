<template>
  <view class="page-common">
    <user-bar />
    <view class="info-container">
      <view class="info-avatar">
        <image class="info-avatar-img" :src="globalStore.userAvatar" />
      </view>
      <view class="flex-fill info-center">
        <view class="info-block">
          <text class="info-text">昵称：{{ globalStore.userNickname }}</text>
          <text class="info-text">胜场数：{{ globalStore.userWinCount }}</text>
          <text class="info-text">负场数：{{ globalStore.userLoseCount }}</text>
          <text class="info-text">胜率：{{ winRate }}%</text>
        </view>
      </view>
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
import '../../style/common.css'
import './personal-info.css'
import { useGlobalStore } from '../../stores/global'
import { computed } from 'vue';

const globalStore = useGlobalStore()

const winRate = computed(() => {
  let totalCount = globalStore.userWinCount + globalStore.userLoseCount
  if (totalCount === 0)
    return 0
  return (globalStore.userWinCount / totalCount) * 100
})
</script>