<script lang="ts" setup>
defineProps<{ title: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
	<div
		class="fixed inset-0 z-40 flex items-start justify-center bg-black/50 p-4 pt-8 sm:pt-20 lg:pt-24"
		@click.self="$emit('close')"
	>
		<div class="w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-lg">
			<div class="mb-5 flex items-center justify-between">
				<h2 class="text-xl font-bold">{{ title }}</h2>
				<button type="button" @click="$emit('close')">
					<Icon name="lucide:x" size="20" />
				</button>
			</div>
			<slot />
		</div>
	</div>
</template>
