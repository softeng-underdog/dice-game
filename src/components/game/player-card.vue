<template>
  <view class="box-border player-card" @tap="emit('tapCard')">
    <image v-show="props.topPlayer" class="player-trophy" src="../../images/game-control/trophy.svg" />
    <view class="flex card-row">
      <image class="player-avatar" :src="avatar" />
      <view class="flex score-group">
        <text class="card-text">筹码：{{ props.chips }}</text>
        <text class="card-text">总分：{{ props.score }}</text>
      </view>
    </view>
    <text class="card-row card-text">{{ props.name }}</text>
    <view class="flex card-row dice-row">
      <image-dice v-for="dice of props.diceData" :key="globalStore.getGlobalKey(dice)" class="card-dice" :dice="dice" />
    </view>
  </view>
</template>

<script setup>
import imageDice from './image-dice.vue';
import { useGlobalStore } from '../../stores/global'
import '../../style/common.css'
import '../style/player-card.css'

const emit = defineEmits(['tapCard'])

const globalStore = useGlobalStore()

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  chips: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  topPlayer: {
    type: Boolean,
    default: false
  },
  diceData: {
    type: Array,
    default() { return [1, 1, 1, 1, 1] }
  }
})

</script>