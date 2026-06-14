<script lang="ts" setup>
import type { Ingredient, Product, ProductItem } from '@prisma/client'

export type ProductWithRelations = Product & {
	items: ProductItem[]
	ingredients: Ingredient[]
}

interface Props {
	product: ProductWithRelations
}
const { product } = defineProps<Props>()

const cartStore = useCartStore()
const firstItem = product.items[0]
const isPizza = Boolean(firstItem.pizzaType)

const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
	try {
		const itemId = productItemId ?? firstItem.id
		const toast = (await import('vue3-toastify')).toast

		await cartStore.addCartItem({
			productItemId: itemId,
			ingredients,
		})

		toast.success(`${product.name} добавлена в корзину`, {
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	} catch (e) {
		console.error(e)
		const toast = (await import('vue3-toastify')).toast

		toast.error('Не удалось добавить товар в корзину', {
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	}
}
</script>

<template>
	<PizzaForm
		v-if="isPizza"
		:imgURL="product.imgURL"
		:name="product.name"
		:ingredients="product.ingredients"
		:items="product.items"
		:loading="cartStore.loading"
		@handleClickAdd="(currentId:number,ingredientsList:number[]) => onSubmit(currentId, ingredientsList)"
	/>

	<div v-else class="flex justify-evenly flex-1">
		<div class="flex items-center">
			<img
				:src="product.imgURL"
				:alt="product.name"
				class="relative left-2 top-2 transition-all z-10 duration-300 h-[350px]"
			/>
		</div>

		<div class="bg-[#f7f6f5] p-7 w-[450px]">
			<h3 class="font-extrabold mb-5 leading-10">{{ product.name }}</h3>

			<Button
				:disabled="cartStore.loading"
				@click="onSubmit()"
				class="px-10 text-base rounded-[18px] mt-10 w-full h-12"
			>
				Добавить в корзину за {{ firstItem.price }} &#8381;
			</Button>
		</div>
	</div>
</template>
