<script lang="ts" setup>
import type { Category } from '@prisma/client'

defineProps<{
	categories: Category[]
}>()

const store = useCategoryStore()
const activeIndex = computed(() => store.activeId)
</script>

<template>
	<div class="flex gap-1 bg-gray-50 dark:bg-white/5 p-1 rounded-2xl overflow-x-auto min-w-0">
		<NuxtLink
			v-if="categories"
			v-for="category in categories"
			:to="`#${category.name}`"
			:key="category.id"
			:class="[
				'inline-flex shrink-0 whitespace-nowrap items-center font-bold h-11 rounded-2xl px-5 transition-colors duration-500',
				activeIndex === category.id
					? 'bg-card shadow-md shadow-gray-200 dark:shadow-none text-primary'
					: '',
			]"
		>
			{{ category.name }}
		</NuxtLink>
	</div>
</template>
