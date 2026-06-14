import { calcTotalPizzaPrice } from './calc-total-pizza-price'
import type { Ingredient, ProductItem } from '@prisma/client'
import { mapPizzaType, type PizzaSize, type PizzaType } from '../constants/pizza'

interface ReturnProps {
	totalPrice: Ref<number | undefined>
	textDetails: Ref<string>
}

export const getPizzaDetails = (
	type: Ref<PizzaType>,
	size: Ref<PizzaSize>,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>,
): ReturnProps => {
	const totalPrice = ref<number>()
	watchEffect(() => {
		totalPrice.value = calcTotalPizzaPrice(type, size, items, ingredients, selectedIngredients)
	})

	const textDetails = ref<string>('')
	watchEffect(() => {
		textDetails.value = `${size.value} см, ${mapPizzaType[type.value]} пицца`
	})

	return { totalPrice, textDetails }
}