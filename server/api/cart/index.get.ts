import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	try {
		const token = getCookie(event, 'cartToken')

		if (!token) {
			return { totalAmount: 0, items: [] }
		}

		const userCart = await prisma.cart.findFirst({
			where: { token },
			include: {
				items: {
					orderBy: {
						createdAt: 'desc'
					},
					include: {
						productItem: {
							include: {
								product: true
							},
						},
						ingredients: true
					}
				}
			}
		})

		return userCart ?? { totalAmount: 0, items: [] }
	} catch (e) {
		console.log('[CART_GET] Server error', e)

		return {
			message: 'Не удалось получить корзину',
			status: 500
		}
	}
})
