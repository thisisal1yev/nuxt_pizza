import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	const admin = await requireAdmin(event)
	const id = Number(event.context.params?.id)

	if (Number(admin.id) === id) {
		throw createError({ statusCode: 400, message: 'Нельзя удалить свой аккаунт' })
	}

	try {
		await prisma.user.delete({ where: { id } })
		return { ok: true }
	} catch {
		throw createError({ statusCode: 409, message: 'Нельзя удалить: есть связанные данные' })
	}
})
