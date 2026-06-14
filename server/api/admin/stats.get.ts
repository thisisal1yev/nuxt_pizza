import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)

	const [orders, products, users, ingredients, revenue] = await Promise.all([
		prisma.order.count(),
		prisma.product.count(),
		prisma.user.count(),
		prisma.ingredient.count(),
		prisma.order.aggregate({
			_sum: { totalAmount: true },
			where: { status: 'SUCCEEDED' },
		}),
	])

	return {
		orders,
		products,
		users,
		ingredients,
		revenue: revenue._sum.totalAmount ?? 0,
	}
})
