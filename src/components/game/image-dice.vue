<template>
    <image :src="globalStore.diceSvgTable[dice]" @tap="emit('tapDice')" />
</template>

<script setup>
import { useGlobalStore } from '../../stores/global'

const emit = defineEmits(['tapDice'])

const globalStore = useGlobalStore()
const props = defineProps({
    dice: {
        type: Number,
        default: 1
    }
})
</script>