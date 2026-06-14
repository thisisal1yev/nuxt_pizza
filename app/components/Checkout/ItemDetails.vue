<script lang="ts" setup>
interface Props {
	title?: string
	value?: string
	class?: string
	loading?: boolean
}

defineProps<Props>()
</script>

<template>
	<div :class class="flex my-4">
		<span class="flex flex-1 text-lg text-neutral-500">
			<div class="flex items-center">
				<slot name="icon" />
				{{ title }}
			</div>

			<div
				class="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2"
			></div>
		</span>

		<Skeleton v-if="loading" class="h-6 w-16 rounded-[6px]" />
		<span v-else class="font-bold text-lg">{{ value }}</span>
	</div>
</template>
