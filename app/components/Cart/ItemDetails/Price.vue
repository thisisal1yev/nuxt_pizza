<script lang="ts" setup>
interface Props {
	price: number
	class?: string
}

defineProps<Props>()
</script>

<template>
	<b class="inline-block" :class>{{ price }} &#8381;</b>
</template>
