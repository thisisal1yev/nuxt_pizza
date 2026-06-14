<script lang="ts" setup>
import type { Category } from '@prisma/client'
import type { ProductWithRelations } from '~/components/Product/Form.vue'

export interface CategoryProps extends Category {
	products: ProductWithRelations[]
}

const route = useRoute()

const {
	data: categories,
	refresh,
	status,
} = useAsyncData<CategoryProps[]>('filteredPizzas', () =>
	$fetch<CategoryProps[]>('/api/filteredPizzas', { query: route.query })
)

watch(
	() => route.query,
	() => {
		refresh()
	},
	{ deep: true }
)
</script>

<template>
	<div class="container">
		<h3 class="font-extrabold">Все пиццы</h3>
	</div>

	<TopBar
		v-if="categories"
		:categories="categories.filter(category => category.products.length > 0)"
	/>

	<Stories />

	<div class="container mt-10 pb-14">
		<div class="flex gap-[80px]">
			<div class="w-[250px]">
				<Filters />
			</div>

			<div class="flex-1">
				<div class="flex flex-col gap-16">
					<SkeletonProductGroup
						v-if="categories.length === 0 && status === 'pending'"
						v-for="i in 3"
						:key="i"
					/>

					<ProductsGroup
						v-if="categories.length > 0"
						v-for="category in categories"
						:categoryId="category.id"
						:title="category.name"
						:key="category.id"
						:products="category.products"
					/>

					<h3 v-else class="font-bold">Ничего не найдено</h3>
				</div>
			</div>
		</div>
	</div>
</template>
