import { mapPizzaType, type PizzaSize, type PizzaType } from '~/constants/pizza'
import type { CartStateItem } from './get-cart-details'

export const getCartItemDetails = (
	ingredients: CartStateItem['ingredients'],
	pizzaType: PizzaType,
	pizzaSize: PizzaSize,
): string => {
	const details: string[] = []

	if (pizzaSize && pizzaType) {
		details.push(`${mapPizzaType[pizzaType]} ${pizzaSize} см`)
	}

	if (ingredients) {
		details.push(...ingredients.map(ingredient => ingredient.name))
	}

	return details.join(', ')
}