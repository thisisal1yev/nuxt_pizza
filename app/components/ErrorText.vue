<script lang="ts" setup>
interface Props {
	text: string
}

defineProps<Props>()
</script>

<template>
	<p class="text-red-500 text-sm">{{ text }}</p>
</template>
