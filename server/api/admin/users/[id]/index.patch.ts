import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	const admin = await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const { role } = await readAdminBody(event, userRoleInput)

	if (Number(admin.id) === id && role !== 'ADMIN') {
		throw createError({ statusCode: 400, message: 'Нельзя снять с себя роль ADMIN' })
	}

	return prisma.user.update({
		where: { id },
		data: { role },
		select: { id: true, fullName: true, email: true, role: true, verified: true, createdAt: true },
	})
})
