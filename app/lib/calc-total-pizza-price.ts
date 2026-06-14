import type { Ingredient, ProductItem } from '@prisma/client'
import type { PizzaSize, PizzaType } from '../constants/pizza'

/**
 * Функция для подсчета общей стоимости пиццы
 *
 * @param type - тип теста выбранной пиццы
 * @param size - размер выбранной пиццы
 * @param items - список вариаций
 * @param ingredients - список ингредиентов
 * @param selectedIngredients - выбранные ингредиенты
 *
 * @returns number общую стоимость
 */

export const calcTotalPizzaPrice = (
	type: Ref<PizzaType>,
	size: Ref<PizzaSize>,
	items: ProductItem[],
	ingredients: Ingredient[],
	selectedIngredients: Set<number>,
): number => {
	const pizzaPrice =
		items.find((item) => item.pizzaType === type.value && item.size === size.value)?.price || 0

	const totalIngredientsPrice = ingredients
		.filter((ingredient) => selectedIngredients.has(ingredient.id))
		.reduce((acc, ingredient) => acc + ingredient.price, 0)

	return pizzaPrice + totalIngredientsPrice
}