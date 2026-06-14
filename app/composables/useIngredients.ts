import type { Ingredient } from '@prisma/client'
import { getAll } from '~/services/ingredients'

interface ReturnProps {
	ingredients: Ref<Ingredient[]>
	loading: Ref<boolean>
}

export const useIngredients = (): ReturnProps => {
	const ingredients = ref<Ingredient[]>([])
	const loading = ref<boolean>(true)

	const fetchIngredients = async () => {
		try {
			const fetchedIngredients = await getAll()
			ingredients.value = fetchedIngredients
			loading.value = false
		} catch (e) {
			console.error('Error fetching ingredients:', e)
		}
	}

	onMounted(fetchIngredients)

	return {
		ingredients,
		loading
	}
}