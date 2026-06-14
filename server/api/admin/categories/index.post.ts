import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const data = await readAdminBody(event, categoryInput)
	return prisma.category.create({ data })
})
