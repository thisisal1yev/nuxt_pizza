<script lang="ts" setup>
defineEmits(['onClick'])
</script>

<template>
	<button
		@click="$emit('onClick')"
		class="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer"
	>
		<Icon name="lucide:x" size="20" class="w-5 h-5" />
	</button>
</template>
