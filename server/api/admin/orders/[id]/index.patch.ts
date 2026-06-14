import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const { status } = await readAdminBody(event, orderStatusInput)
	return prisma.order.update({ where: { id }, data: { status } })
})
