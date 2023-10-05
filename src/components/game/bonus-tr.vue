<template>
  <view class="flex">
    <text class="bonus-name">{{ name }}</text>
    <text class="bonus-score" :class="achievedClass">{{ score }}分</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import '../style/bonus-tr.css'
import '../../style/common.css'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  },
  achieved: {
    type: Boolean,
    default: false
  }
})

const achievedClass = computed(() => {
  return {
    'bonus-achieved': props.achieved
  }
})
</script>