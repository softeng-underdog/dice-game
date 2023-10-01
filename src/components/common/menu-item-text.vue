<template>
  <view class="menu-item-view">
    <image class="menu-item-icon" :src="props.iconSrc" mode="aspectFit" />
    <text class="menu-btn-border" :style="btnColorStyle">
      <slot></slot>
    </text>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import '../../style/common.css'
import '../style/menu-item.css'

const props = defineProps({
  iconSrc: {
    type: String,
    required: true
  },
  btnColor: {
    type: String,
    required: true
  }
})

const btnColorStyle = computed(() => {
  return {
    backgroundColor: props.btnColor
  }
})

</script>