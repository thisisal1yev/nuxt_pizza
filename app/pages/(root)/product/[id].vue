<script lang="ts" setup>
import type { ProductWithRelations } from '~/components/Product/Form.vue'

const {
	params: { id },
} = useRoute()

const { data: product, error } = await useAsyncData<ProductWithRelations>(
	`product-${id}`,
	() => $fetch<ProductWithRelations>(`/api/product/${id}`)
)

if (!product && !error) {
	throw createError({
		statusCode: 404,
		statusMessage: 'Product not found',
	})
}

useSeoMeta({
	title: `Nuxt Pizza | ${product.value?.name}`,
	description: `Nuxt Pizza | ${product.value?.name}`,
})
</script>

<template>
	<div class="container flex flex-col my-14">
		<ProductForm v-if="product" :product />
	</div>
</template>
