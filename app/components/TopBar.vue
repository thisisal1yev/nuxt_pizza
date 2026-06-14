<script lang="ts" setup>
import type { CategoryProps } from '~/pages/(root)/index.vue'

defineProps<{
	categories: CategoryProps[]
}>()
</script>

<template>
	<div class="sticky top-0 bg-white py-5 mt-5 shadow-lg shadow-black/5 z-10">
		<div class="container flex items-center justify-between gap-3">
			<Categories :categories />
			<div class="shrink-0">
				<SortPopup />
			</div>
		</div>
	</div>
</template>
