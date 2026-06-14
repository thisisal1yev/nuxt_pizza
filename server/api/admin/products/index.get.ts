import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.product.findMany({
		orderBy: { id: 'asc' },
		include: {
			category: { select: { name: true } },
			items: true,
			ingredients: { select: { id: true, name: true } },
		},
	})
})
