<template>
  <view class="game-info">
    <view class="return-avatar-group">
      <image class="return-btn" src="../../images/game-control/return-btn.svg" @tap="emit('tapExit')" />
      <image class="game-avatar" :src="props.avatar" @tap="emit('toggleView')" />
    </view>
    <text class="multiplier-text">当前倍率 : {{ props.multiplier }}</text>
    <view class="games-group">
      <text class="games-text">局数</text>
      <text class="games-text">{{ props.currentGame }}/{{ props.games }}</text>
    </view>
  </view>
</template>

<script setup>
import '../style/game-info.css'

const emit = defineEmits(['toggleView', 'tapExit'])

const props = defineProps({
  avatar: {
    type: String,
    required: true
  },
  multiplier: {
    type: Number,
    default: 1
  },
  currentGame: {
    type: Number,
    default: 1
  },
  games: {
    type: Number,
    default: 1
  }
})
</script>