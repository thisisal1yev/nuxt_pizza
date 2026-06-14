import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const data = await readAdminBody(event, productInput)

	return prisma.$transaction(async (tx) => {
		await tx.productItem.deleteMany({ where: { productId: id } })
		return tx.product.update({
			where: { id },
			data: {
				name: data.name,
				imgURL: data.imgURL,
				categoryId: data.categoryId,
				ingredients: { set: data.ingredientIds.map((iid) => ({ id: iid })) },
				items: {
					create: data.items.map((i) => ({
						price: i.price,
						size: i.size ?? null,
						pizzaType: i.pizzaType ?? null,
					})),
				},
			},
			include: { items: true, ingredients: true },
		})
	})
})
