<template>
  <view class="menu-item-view">
    <image class="menu-item-icon" :src="props.iconSrc" mode="aspectFit" />
    <navigator class="menu-btn-border" :url="props.url" :style="btnColorStyle">
        <slot></slot>
    </navigator>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import '../../style/common.css'
import '../style/menu-item.css'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
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