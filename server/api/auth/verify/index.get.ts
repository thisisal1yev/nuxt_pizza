import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	try {
		const code = getQuery(event).code as string
		const config = useRuntimeConfig()
		const url = new URL('/?verified', config.public.siteUrl)

		if (!code) {
			throw createError({
				statusCode: 400,
				message: "Неверный код"
			})
		}

		const verificationCode = await prisma.verificationCode.findFirst({
			where: {
				code,
			},
		})

		if (!verificationCode) {
			throw createError({
				statusCode: 400,
				message: "Неверный код"
			})
		}

		await prisma.user.update({
			where: {
				id: verificationCode.userId,
			},
			data: {
				verified: new Date(),
			},
		})

		await prisma.verificationCode.delete({
			where: {
				id: verificationCode.id,
			},
		})

		return sendRedirect(event, url.toString())
	} catch (e) {
		console.error('[VERIFY_GET] Server error', e)
		throw e
	}
})