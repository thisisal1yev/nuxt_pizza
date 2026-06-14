<script lang="ts" setup>
import type { Ingredient } from '@prisma/client'

interface Props {
	id: number
	name: string
	price: number
	imgURL: string
	loading?: boolean
	ingredients: Ingredient[]
}

defineEmits(['addOnCart'])
const { ingredients } = defineProps<Props>()
const productDetails = ingredients.map(ingredient => ingredient.name).join(', ')
</script>

<template>
	<div class="flex flex-col h-full">
		<NuxtLink
			class="flex justify-center p-6 bg-secondary rounded-lg h-[260px]"
			:to="`/product/${id}`"
		>
			<img class="w-[215px] h-[215px]" :src="imgURL" :alt="name" />
		</NuxtLink>

		<div class="flex flex-col grow h-auto">
			<div class="grow h-auto">
				<h4 class="mt-3 mb-1 font-bold leading-8">{{ name }}</h4>

				<p v-if="productDetails" class="text-sm text-gray-400">
					{{ productDetails }}
				</p>
			</div>

			<div class="flex justify-between items-center mt-4">
				<span class="text-xl">
					от <b>{{ price }} &#8381;</b>
				</span>

				<Button
					:disabled="loading"
					variant="secondary"
					size="default"
					@click="$emit('addOnCart', id, name)"
					class="text-base font-bold w-[100px]"
				>
					<Icon name="lucide:plus" size="20" class="mr-1" />

					Добавить
				</Button>
			</div>
		</div>
	</div>
</template>
