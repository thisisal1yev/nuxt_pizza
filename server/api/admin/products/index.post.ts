import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const data = await readAdminBody(event, productInput)

	return prisma.product.create({
		data: {
			name: data.name,
			imgURL: data.imgURL,
			categoryId: data.categoryId,
			ingredients: { connect: data.ingredientIds.map((id) => ({ id })) },
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
