import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	try {
		await prisma.$transaction([
			prisma.productItem.deleteMany({ where: { productId: id } }),
			prisma.product.delete({ where: { id } }),
		])
		return { ok: true }
	} catch {
		throw createError({ statusCode: 409, message: 'Нельзя удалить: продукт используется в корзинах' })
	}
})
