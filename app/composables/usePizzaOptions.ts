import type { ProductItem } from '@prisma/client'
import type { Variant } from '~/components/GroupVariants.vue'
import { computed, ref, watchEffect } from 'vue'
import type { PizzaSize, PizzaType } from '~/constants/pizza'
import { getAvailablePizzaSizes } from '~/lib/get-available-pizza-sizes'

interface ReturnProps {
	size: Ref<PizzaSize>
	type: Ref<PizzaType>
	selectedIngredients: Set<number>
	availableSizes: ComputedRef<Variant[]>
	currentItemId: ComputedRef<number | undefined>
	setSize: (size: PizzaSize) => void
	setType: (type: PizzaType) => void
	addIngredient: (id: number) => void
}

export const usePizzaOptions = (items: ProductItem[]): ReturnProps => {
	const size = ref<PizzaSize>(20)
	const type = ref<PizzaType>(1)
	const { set: selectedIngredients, toggle: addIngredient } = useSet<number>()

	const availableSizes = computed(() => getAvailablePizzaSizes(type.value, items))

	const currentItemId = computed(() => {
		return items.find((item) => item.pizzaType === type.value && item.size === size.value)?.id
	})

	const setSize = (newSize: PizzaSize) => {
		size.value = newSize
	}

	const setType = (newType: PizzaType) => {
		type.value = newType
	}

	watchEffect(() => {
		const isAvailableSize = availableSizes.value?.find(
			(item) => Number(item.value) === size.value && !item.disabled
		)
		const availableSize = availableSizes.value?.find((item) => !item.disabled)

		if (!isAvailableSize && availableSize) {
			size.value = Number(availableSize.value) as PizzaSize
		}
	})

	return {
		size,
		type,
		selectedIngredients,
		availableSizes,
		currentItemId,
		setSize,
		setType,
		addIngredient,
	}
}