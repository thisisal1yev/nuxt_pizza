import type { ProductItem } from '@prisma/client'
import { pizzaSizes, type PizzaType } from '../constants/pizza'
import type { Variant } from '~/components/GroupVariants.vue'

export const getAvailablePizzaSizes = (type: PizzaType, items: ProductItem[]): Variant[] => {
	const filteredPizzasByType = items.filter((item) => item.pizzaType === type)

	return pizzaSizes.map((item) => ({
		name: item.name,
		value: item.value,
		disabled: !filteredPizzasByType.some((pizza) => Number(pizza.size) === Number(item.value)),
	}))
}