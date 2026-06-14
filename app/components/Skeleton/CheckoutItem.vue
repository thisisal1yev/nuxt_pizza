<script lang="ts" setup>
interface Props {
	class?: string
}

defineProps<Props>()
</script>

<template>
	<div class="flex items-center justify-between space-x-5" :class>
		<div class="flex items-center gap-5 grow">
			<div class="w-20 h-[50px] bg-gray-200 rounded-full animate-pulse"></div>
			<h2 class="w-full h-5 bg-gray-200 rounded-sm animate-pulse"></h2>
		</div>
		<div class="h-5 w-1/12 rounded-sm bg-gray-200 animate-pulse"></div>
		<div class="h-5 w-1/4 rounded-sm bg-gray-200 animate-pulse"></div>
	</div>
</template>
