<script lang="ts" setup>
defineProps<{ value?: string }>()
defineEmits(['onInput'])
</script>

<template>
	<textarea
		:value
		@input="$emit('onInput', ($event.target as HTMLTextAreaElement)?.value)"
		class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
	></textarea>
</template>
