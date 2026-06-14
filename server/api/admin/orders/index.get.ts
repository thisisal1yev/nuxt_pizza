import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
})
