<script lang="ts" setup>
interface IRecept {
	text: string
	value: number
}

const items = ref<IRecept[]>([])
const filter = useFilter()
const { ingredients, loading } = useIngredients()
const minValue = ref<number>(0)
const maxValue = ref<number>(1000)

useQueryFilters(filter)

watchEffect(() => {
	items.value = ingredients.value.map(item => ({
		text: item.name,
		value: item.id,
	}))
})

const updatePrice = (prices: number[]): void => {
	filter.setPrice('priceFrom', prices[0])
	filter.setPrice('priceTo', prices[1])
}
</script>

<template>
	<div>
		<h3 class="mb-6 font-extrabold">Фильтрация</h3>

		<CheckboxFilteresGroup
			name="pizzaTypes"
			title="Тип теста:"
			@onClickCheckbox="filter.setPizzaTypes"
			:selected="filter.pizzaTypes"
			:items="[
				{ text: 'Тонкое', value: 1 },
				{ text: 'Традиционное', value: 2 },
			]"
		/>

		<CheckboxFilteresGroup
			title="Размеры:"
			name="sizes"
			:class="'mb-5'"
			@onClickCheckbox="filter.setSizes"
			:selected="filter.sizes"
			:items="[
				{ text: '20 см', value: 20 },
				{ text: '30 см', value: 30 },
				{ text: '40 см', value: 40 },
			]"
		/>

		<div class="mt-5 border-y border-y-neutral-100 py-6 pb-7">
			<p class="font-bold mb-3">Цена от и до:</p>
			<div class="flex gap-3 mb-5">
				<Input
					type="number"
					:placeholder="minValue"
					:min="minValue"
					:max="maxValue"
					@change="
						filter.setPrice(
							'priceFrom',
							Number(($event.target as HTMLInputElement)?.value)
						)
					"
					:value="String(filter.price.value.priceFrom || 0)"
				/>

				<Input
					type="number"
					:placeholder="maxValue"
					:min="minValue"
					:max="maxValue"
					@change="
						filter.setPrice(
							'priceTo',
							Number(($event.target as HTMLInputElement)?.value)
						)
					"
					:value="String(filter.price.value.priceTo || 0)"
				/>
			</div>

			<SliderRange
				:min="minValue"
				:max="maxValue"
				:step="10"
				:value="[
					filter.price.value.priceFrom || minValue,
					filter.price.value.priceTo || maxValue,
				]"
				@onValueChange="(prices:number[]) => updatePrice(prices)"
			/>
		</div>

		<CheckboxFilteresGroup
			title="Ингредиенты:"
			:name="'ingredients'"
			:limit="6"
			:defaultValue="items.slice(0, 6)"
			@onClickCheckbox="filter.setSelectedIngredients"
			:items
			:loading
			:selected="filter.ingredients"
		/>
	</div>
</template>
