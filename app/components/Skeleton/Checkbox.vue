<script lang="ts" setup>
interface Props {
	class?: string
}

defineProps<Props>()
</script>

<template>
	<div
		class="flex items-center justify-center my-auto w-full gap-4 space-y-1.5 animate-pulse select-none"
		:class
	>
		<div class="grid bg-gray-300 rounded-lg h-6 w-7 place-items-center"></div>
		<div class="w-full">
			<div
				class="h-3 font-sans text-5xl antialiased font-semibold leading-tight tracking-normal bg-gray-300 rounded-full text-inherit"
			>
				&nbsp;
			</div>
		</div>
	</div>
</template>
