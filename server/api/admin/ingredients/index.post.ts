import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const data = await readAdminBody(event, ingredientInput)
	return prisma.ingredient.create({ data })
})
