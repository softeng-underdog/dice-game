<template>
  <view>
    <text class="title">你已经按了{{ counter.count }}次</text>
    <view class="button" @tap="onAdd">ADD</view>
  </view>
</template>

<script setup>
import { useCounterStore } from '../stores/counter'
const counter = useCounterStore()
const onAdd = () => {
      counter.count++
    }
</script>

<style>
.title {
  font-size: 32px;
}
.button {
  border: 1px solid lightgray;
  padding: 5px 10px;
}
</style>
