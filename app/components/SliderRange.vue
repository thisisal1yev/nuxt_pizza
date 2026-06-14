<script lang="ts" setup>
interface Props {
	min?: number
	max?: number
	step?: number
	value?: number[]
	onValueChange?: (value: number[]) => void
}

defineProps<Props>()
defineEmits(['onValueChange'])

const InputRef = ref<HTMLInputElement | null>(null)
</script>

<template>
	<input
		ref="InputRef"
		type="range"
		:min
		:max
		:step
		:value="String(value)"
		@input="$emit('onValueChange', [0, InputRef?.valueAsNumber])"
	/>
</template>

<style scoped>
input {
	width: 100%;
}
</style>
