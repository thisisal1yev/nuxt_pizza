import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	await prisma.order.delete({ where: { id } })
	return { ok: true }
})
