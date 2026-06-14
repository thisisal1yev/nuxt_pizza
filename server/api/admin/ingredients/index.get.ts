import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.ingredient.findMany({ orderBy: { id: 'asc' } })
})
