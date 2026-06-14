import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	const { user } = await getUserSession(event)

	if (!user) {
		throw createError({
			statusCode: 401,
			message: 'Вы не авторизованы',
		})
	}

	return prisma.order.findMany({
		where: { userId: Number(user.id) },
		orderBy: { createdAt: 'desc' },
	})
})
