<template>
  <view class="field-view">
    <text class="field-label">{{ props.label }}</text>
    <view class="field-box">
      <image class="field-btn" src="../../images/config-btn/minus.svg" @tap="decValue" />
      <input v-model.number="value" class="field-input" type="number" />
      <image class="field-btn" src="../../images/config-btn/plus.svg" @tap="incValue" />
    </view>
  </view>
</template>

<script setup>
import { computed, watch } from 'vue'
import '../style/config-field.css'

const incValue = () => {
  value.value = Math.min(value.value + props.step, props.maxValue)
}

const decValue = () => {
  value.value = Math.max(value.value - props.step, props.minValue)
}

const clampValue = () => {
  let clampedVal = value.value
  clampedVal = Math.min(clampedVal, props.maxValue)
  clampedVal = Math.max(clampedVal, props.minValue)
  value.value = clampedVal
}

const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const props = defineProps({
  modelValue: Number,
  label: {
    type: String,
    required: true
  },
  minValue: {
    type: Number,
    default: 0
  },
  maxValue: {
    type: Number,
    default: Infinity
  },
  step: {
    type: Number,
    default: 1
  }
})

watch(value, clampValue)
watch(props, clampValue)

</script>