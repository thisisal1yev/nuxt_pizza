interface PriceProps {
	priceFrom?: number
	priceTo?: number
}

interface QueryFilters extends PriceProps {
	pizzaTypes: string
	sizes: string
	ingredients: string
}

export interface Filters {
	sizes: Set<string>
	pizzaTypes: Set<string>
	ingredients: Set<string>
	price: Ref<PriceProps>
}

interface ReturnProps extends Filters {
	setPrice: (name: keyof PriceProps, value: number) => void
	setPizzaTypes: (value: string) => void
	setSizes: (value: string) => void
	setSelectedIngredients: (value: string) => void
}

export const useFilter = (): ReturnProps => {
	const { query } = useRoute() as unknown as { query: QueryFilters }
	const filters = ref()

	const { set: selectedIngredients, toggle: toggleIngredients } = useSet<string>(query.ingredients?.split(','))

	const { set: sizes, toggle: toggleSizes } = useSet<string>(
		query.sizes ? query.sizes.split(',') : []
	)
	const { set: pizzaTypes, toggle: togglePizzaTypes } = useSet<string>(
		query.pizzaTypes ? query.pizzaTypes.split(',') : []
	)

	const price = ref<PriceProps>({
		priceFrom: Number(query.priceFrom) || 0,
		priceTo: Number(query.priceTo) || 1000,
	})

	const updatePrice = (name: keyof PriceProps, value: number) => {
		price.value = {
			...price.value,
			[name]: value,
		}
	}

	watch(
		[price, pizzaTypes, sizes, selectedIngredients],
		([newPrices, newPizzaTypes, newSizes, newSelectedIngredients]) => {
			filters.value = {
				...newPrices,
				pizzaTypes: Array.from(newPizzaTypes),
				sizes: Array.from(newSizes),
				ingredients: Array.from(newSelectedIngredients),
			}

		}
	)

	return {
		ingredients: selectedIngredients,
		price,
		pizzaTypes,
		sizes,
		setSelectedIngredients: toggleIngredients,
		setSizes: toggleSizes,
		setPizzaTypes: togglePizzaTypes,
		setPrice: updatePrice,
	}
}