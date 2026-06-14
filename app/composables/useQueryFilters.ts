import qs from 'qs'
import type { Filters } from './useFilters'

export const useQueryFilters = (filters: Filters) => {
	const router = useRouter()

	watch([filters.price, filters.ingredients, filters.sizes, filters.pizzaTypes, () => router], ([newPrice, newIngredients, newSizes, newPizzaTypes, newRouter]) => {

		const params = ref({
			...newPrice,
			pizzaTypes: Array.from(newPizzaTypes),
			sizes: Array.from(newSizes),
			ingredients: Array.from(newIngredients),
		})

		const query = qs.stringify(params.value, { arrayFormat: 'comma' })
		query === '' ? router.push('') : newRouter.push(`?${query}`)
	})
}