import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.user.findMany({
		orderBy: { id: 'asc' },
		select: { id: true, fullName: true, email: true, role: true, verified: true, createdAt: true },
	})
})
