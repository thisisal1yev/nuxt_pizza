import prisma from '~/lib/prisma'
import { updateCartTotalAmount } from '~/lib/update-cart-total-amount'

export default defineEventHandler(async (event) => {
	try {
		const id = Number(event.context.params?.id)
		const body = await readBody(event)
		const token = getCookie(event, 'cartToken')
		const quantity = Number(body.quantity)

		if (!token) {
			return {
				message: 'Cart token not found',
				status: 401,
			}
		}

		if (!Number.isInteger(quantity) || quantity < 1) {
			return {
				message: 'Invalid quantity',
				status: 400,
			}
		}

		const cartItem = await prisma.cartItem.findFirst({
			where: { id, cart: { token } },
		})

		if (!cartItem) {
			return {
				message: 'Cart item not found',
				status: 404,
			}
		}

		await prisma.cartItem.update({
			where: { id },
			data: { quantity },
		})

		const updatedUserCart = await updateCartTotalAmount(token)

		return {
			items: updatedUserCart?.items,
			totalAmount: updatedUserCart?.totalAmount,
		}
	} catch (e) {
		console.error('[CART_PATCH] Server error', e)
		return {
			message: 'Не удалось обновить корзину',
			status: 500,
		}
	}
})