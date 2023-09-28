<template>
  <view class="page-common">
    <user-bar />
    <view class="logo">
      <image class="logo-img" src="../../images/logo.svg" mode="aspectFit" />
    </view>
    <view class="btn-area">
      <navigator class="menu-btn-border start-btn" url="/pages/home/home">开始游戏</navigator>
    </view>
  </view>
</template>

<script setup>
import userBar from '../../components/common/user-bar.vue'
import '../style/common.css'
import './index.css'

</script>
