<template>
    <image :src="globalStore.diceSvgTable[dice]" />
</template>

<script setup>
import { useGlobalStore } from '../../stores/global'

const globalStore = useGlobalStore()
const props = defineProps({
    dice: {
        type: Number,
        default: 1
    }
})
</script>