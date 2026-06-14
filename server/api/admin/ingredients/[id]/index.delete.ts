import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	try {
		await prisma.ingredient.delete({ where: { id } })
		return { ok: true }
	} catch {
		throw createError({ statusCode: 409, message: 'Нельзя удалить: ингредиент используется' })
	}
})
