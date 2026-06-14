<script lang="ts" setup>
interface Props {
	title?: string
	class?: string
	contentClass?: string
}

defineProps<Props>()
</script>

<template>
	<div class="bg-white rounded-3xl" :class>
		<div class="flex items-center justify-between p-5 border-b border-gray-100">
			<h4 v-if="title" class="font-bold">{{ title }}</h4>

			<slot name="upper" />
		</div>

		<div class="px-5 py-4" :class="contentClass">
			<slot name="lower" />
		</div>
	</div>
</template>
