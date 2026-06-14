<script lang="ts" setup>
interface Props {
	src: string
	class?: string
}

defineProps<Props>()
</script>

<template>
	<img :src class="w-[60px] h-[60px] object-cover object-center" :class />
</template>
