<template>
  <view class="player-rank">
    <view class="rank-group">
      <image class="rank-trophy" :src="props.trophy" />
      <text class="rank-title">{{ props.title }}</text>
    </view>
    <view class="box-border rank-data">
      <view class="rank-group">
        <image class="rank-avatar" :src="props.playerAvatar" />
        <text class="rank-text">{{ props.playerName }}</text>
      </view>
      <text class="rank-text">筹码：{{ props.chips }}</text>
    </view>
  </view>
</template>

<script setup>
import '../style/player-rank.css'

const props = defineProps({
  trophy: {
    type: String,
    required: true
  },
  title: {
    type: String,
    requried: true
  },
  playerAvatar: {
    type: String,
    required: true
  },
  playerName: {
    type: String,
    required: true
  },
  chips: {
    type: Number,
    default: 0
  }
})
</script>