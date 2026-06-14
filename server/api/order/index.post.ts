import { OrderStatus } from '@prisma/client'
import { CheckoutFormValues } from '~/constants/checkout-form-schema'
import prisma from '~/lib/prisma'
import { sendEmail } from '~/lib/send-email'

export default defineEventHandler(async (event) => {
	try {
		const data = await readBody<CheckoutFormValues>(event)
		const token = getCookie(event, 'cartToken')

		if (!token) {
			throw createError({
				statusMessage: 'Cart token not found',
				statusCode: 400,
			})
		}

		const userCart = await prisma.cart.findFirst({
			include: {
				user: true,
				items: {
					include: {
						ingredients: true,
						productItem: {
							include: {
								product: true,
							},
						},
					},
				},
			},
			where: {
				token,
			},
		})

		if (!userCart) {
			throw createError({
				statusMessage: 'Cart not found',
				statusCode: 400,
			})
		}

		if (userCart?.totalAmount === 0) {
			throw createError({
				statusMessage: 'Cart is empty',
				statusCode: 400,
			})
		}

		const order = await prisma.$transaction(async (tx) => {
			const createdOrder = await tx.order.create({
				data: {
					token,
					fullName: data.firstName + ' ' + data.lastName,
					email: data.email,
					phone: data.phone,
					address: data.address,
					comment: data.comment,
					totalAmount: userCart.totalAmount,
					status: OrderStatus.PENDING,
					items: JSON.parse(JSON.stringify(userCart.items)),
				},
			})

			await tx.cart.update({
				where: {
					id: userCart.id,
				},
				data: {
					totalAmount: 0,
				},
			})

			await tx.cartItem.deleteMany({
				where: {
					cartId: userCart.id,
				},
			})

			return createdOrder
		})

		const paymentURL = 'https://github.com/thisisal1ev'

		await sendEmail(
			data.email,
			`Nuxt Pizza / Оплатите заказ #${order.id}`,
			{
				orderId: order.id,
				totalAmount: order.totalAmount,
				paymentURL,
			},
			false
		)

		return paymentURL
	} catch (e) {
		console.error('[CreateOrder] Server error', e)
		throw e
	}
})