import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const data = await readAdminBody(event, ingredientInput)
	return prisma.ingredient.update({ where: { id }, data })
})
