import type { Cart } from '@prisma/client'
import prisma from './prisma'

export const findOrCreateCart = async (token: string): Promise<Cart> => {
	// upsert is atomic on the unique `token` column, so concurrent POSTs
	// can't create duplicate carts for the same token.
	return await prisma.cart.upsert({
		where: { token },
		update: {},
		create: { token },
	})
}