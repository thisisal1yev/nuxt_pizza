import prisma from '~/lib/prisma'
import { updateCartTotalAmount } from '~/lib/update-cart-total-amount'
import { findOrCreateCart } from '~/lib/find-or-create-cart'
import type { CreateCartItemValues } from '~/services/dto/cart.dto'

export default defineEventHandler(async (event) => {
	try {
		let token = getCookie(event, 'cartToken')

		if (!token) {
			token = crypto.randomUUID()
		}

		const userCart = await findOrCreateCart(token)

		const data = await readBody<CreateCartItemValues>(event)

		// Exact ingredient-set match: `every` alone also matches empty/superset sets,
		// so compare the sorted ingredient ids in JS instead.
		const wantedIds = [...(data.ingredients ?? [])].sort((a, b) => a - b)

		const candidates = await prisma.cartItem.findMany({
			where: {
				cartId: userCart.id,
				productItemId: data.productItemId,
			},
			include: {
				ingredients: { select: { id: true } },
			},
		})

		const findCartItem = candidates.find((item) => {
			const ids = item.ingredients.map((i) => i.id).sort((a, b) => a - b)
			return (
				ids.length === wantedIds.length &&
				ids.every((id, i) => id === wantedIds[i])
			)
		})

		if (findCartItem) {
			await prisma.cartItem.update({
				where: {
					id: findCartItem.id,
				},
				data: {
					quantity: findCartItem.quantity + 1,
				},
			})
		} else {
			await prisma.cartItem.create({
				data: {
					cartId: userCart.id,
					productItemId: data.productItemId,
					quantity: 1,
					ingredients: { connect: data.ingredients?.map((id) => ({ id })) },
				},
			})
		}

		const updatedUserCart = await updateCartTotalAmount(token)

		setCookie(event, 'cartToken', token, {
			httpOnly: true,
			path: '/',
		})

		return updatedUserCart
	} catch (e) {
		console.error('[CART_POST] Server error', e)
		return {
			statusCode: 500,
			body: { message: 'Не удалось создать корзину' },
		}
	}
})