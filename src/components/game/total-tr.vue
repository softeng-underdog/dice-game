<template>
  <view class="flex">
    <text class="total-name">{{ name }}</text>
    <text class="total-score">{{ score }}</text>
  </view>
</template>
  
<script setup>
import '../../style/common.css'
import '../style/total-tr.css'
  
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    default: 0
  }
})
</script>