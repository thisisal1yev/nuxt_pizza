import prisma from '~/lib/prisma'
import { updateCartTotalAmount } from '~/lib/update-cart-total-amount'

export default defineEventHandler(async (event) => {
	try {
		const id = Number(event.context.params?.id)
		const token = getCookie(event, 'cartToken')

		if (!token) {
			return {
				statusCode: 400,
				body: { error: 'Cart token not found' },
			}
		}

		const cartItem = await prisma.cartItem.findFirst({
			where: {
				id,
				cart: { token },
			},
		})

		if (!cartItem) {
			return {
				statusCode: 404,
				body: { error: 'Cart item not found' },
			}
		}

		await prisma.cartItem.delete({
			where: {
				id,
			},
		})

		const updatedUserCart = await updateCartTotalAmount(token)

		return {
			items: updatedUserCart?.items,
			totalAmount: updatedUserCart?.totalAmount,
		}
	} catch (e) {
		console.error('[CART_DELETE] Server error', e)
		return {
			statusCode: 500,
			body: { message: 'Не удалось удалить корзину' },
		}
	}
})
