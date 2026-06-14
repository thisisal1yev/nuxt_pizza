<script lang="ts" setup>
interface Props {
	name: string
	details: string
}

defineProps<Props>()
</script>

<template>
	<div class="flex flex-col">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-bold flex-1 leading-6">{{ name }}</h2>
		</div>
		<p v-if="details" class="text-xs text-gray-400">
			{{ details }}
		</p>
	</div>
</template>
