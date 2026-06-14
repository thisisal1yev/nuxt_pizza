<script lang="ts" setup>
interface Props {
	class?: string
}
defineProps<Props>()
</script>

<template>
	<div :class class="h-full flex flex-col space-y-5">
		<div
			class="flex justify-center p-6 bg-gray-100/70 animate-pulse rounded-lg h-[260px]"
		>
			<span
				class="w-[215px] h-[215px] inline-block bg-gray-200 rounded-full animate-pulse"
			></span>
		</div>

		<div class="space-y-5">
			<Skeleton class="w-1/2 h-10" />

			<div class="space-y-3">
				<Skeleton class="h-5 w-full" />
				<Skeleton class="h-5 w-full" />
				<Skeleton class="h-5 w-1/3" />
			</div>
		</div>

		<div class="flex justify-between">
			<Skeleton class="w-1/3 h-9" />

			<Skeleton class="w-1/2 h-9" />
		</div>
	</div>
</template>
