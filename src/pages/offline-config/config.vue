<template>
  <view class="page-common">
    <user-bar />
    <menu-item-text class="page-title" icon-src="../../images/menu-dices/offline-dice.svg" btn-color="#F8DD46">本地对战</menu-item-text>
    <view class="flex-fill config-area">
      <config-field class="field-margin" v-model="playerNumber" label="玩家人数：" :min-value="2" :max-value="5" />
      <config-field class="field-margin" v-model="cpuNumber" label="AI数量：" :min-value="1" :max-value="playerNumber - 1" />
      <config-field class="field-margin" v-model="chipNumber" label="筹码数：" :min-value="100" :step="100"/>
      <config-field class="field-margin" v-model="gameNumber" label="游戏局数：" :min-value="1" />
      <text class="menu-btn-border start-btn">开始游戏</text>
    </view>
    <view class="navigator-area">
      <navigator open-type="navigateBack">
        <image class="navigator-back" src="../../images/navigator-btn/back-btn.svg" />
      </navigator>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import userBar from '../../components/common/user-bar.vue'
import menuItemText from '../../components/common/menu-item-text.vue'
import configField from '../../components/config-control/config-field.vue'
import '../../style/common.css'
import './config.css'

const playerNumber = ref(2)
const cpuNumber = ref(1)
const chipNumber = ref(100)
const gameNumber = ref(1)
</script>