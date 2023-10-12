<template>
    <view class="page-common">
      <user-bar />
      <text class="rank-title">
        排行榜
      </text>
      <view class="rank-container">
        <text class="rank-category">胜场数</text>
        <view class="flex-fill rank-center">
          <view class="rank-block">
            <view class="rank-item">
              <image class="rank-trophy" src="../../images/rank/First.svg" />
              <text class="rank-nickname">昵称：</text>
            </view>
            <view class="rank-item">
              <image class="rank-trophy" src="../../images/rank/Second.svg" />
              <text class="rank-nickname">昵称：</text>
            </view>
            <view class="rank-item">
              <image class="rank-trophy" src="../../images/rank/Third.svg" />
              <text class="rank-nickname">昵称：</text>
            </view>
            <view class="rank-item">
              <image class="rank-trophy" src="../../images/rank/Loser.svg" />
              <text class="rank-nickname">昵称：</text>
            </view>
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
    import { View } from '@tarojs/components';
    import userBar from '../../components/common/user-bar.vue'
    import '../../style/common.css'
    import './rank.css'
  </script>