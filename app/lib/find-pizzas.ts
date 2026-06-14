import prisma from './prisma'

export interface GetSearchParams {
	query?: string
	sortBy?: string
	sizes?: string
	pizzaTypes?: string
	ingredients?: string
	priceFrom?: string
	priceTo?: string
}

const DEFAULT_MIN_PRICE = 0
const DEFAULT_MAX_PRICE = 1000

export const findPizzas = async (params: GetSearchParams) => {
	const toIdArray = (value?: string) =>
		value
			?.split(',')
			.map(Number)
			.filter((n) => !isNaN(n))

	const sizes = toIdArray(params.sizes)
	const pizzaTypes = toIdArray(params.pizzaTypes)
	const ingredientsIdArr = toIdArray(params.ingredients)

	const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE
	const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE

	const categories = await prisma.category.findMany({
		include: {
			products: {
				orderBy: {
					id: 'desc',
				},
				where: {
					ingredients: ingredientsIdArr
						? {
							some: {
								id: {
									in: ingredientsIdArr,
								},
							},
						}
						: undefined,
					items: {
						some: {
							size: {
								in: sizes,
							},
							pizzaType: {
								in: pizzaTypes,
							},
							price: {
								gte: minPrice, // >=
								lte: maxPrice, // <=
							},
						},
					},
				},
				include: {
					ingredients: true,
					items: {
						where: {
							price: {
								gte: minPrice,
								lte: maxPrice,
							},
						},
						orderBy: {
							price: 'asc',
						},
					},
				},
			},
		},
	})

	return categories.filter(category => category.products.length > 0)
}