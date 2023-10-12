<template>
    <view class="page-common">
      <user-bar />
      <view class="logo">
        <image class="logo-img" src="../../images/logo.svg" />
      </view>
      <text class="loading-text">
      正在准备美食
      </text>
    </view>
  </template>
  
  <script setup>
  import userBar from '../../components/common/user-bar.vue'
  import '../../style/common.css'
  import './loading.css'
  
  </script>
  