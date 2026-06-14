import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const data = await readAdminBody(event, categoryInput)
	return prisma.category.update({ where: { id }, data })
})
