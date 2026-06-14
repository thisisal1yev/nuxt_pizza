import { User } from '@prisma/client'
import { hashSync } from 'bcrypt'

import prisma from '~/lib/prisma'
import { sendEmail } from '~/lib/send-email'


export default defineEventHandler(async (event) => {
	try {
		const body: User = await readBody(event)

		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		})

		if (user) {
			if (!user.verified) {
				throw createError({
					statusCode: 401,
					message: "Почта не подтверждена",
				})
			}

			throw createError({
				statusCode: 401,
				message: "Пользователь существует",
			})
		}

		const createdUser = await prisma.user.create({
			data: {
				fullName: body.fullName,
				email: body.email,
				password: hashSync(body.password, 10),
			},
		})

		const code = Math.floor(100000 + Math.random() * 900000).toString()

		await prisma.verificationCode.create({
			data: {
				code,
				userId: createdUser.id,
			},
		})

		const { password, ...safeUser } = createdUser
		await setUserSession(event, { user: safeUser })

		const config = useRuntimeConfig()

		return await sendEmail(
			createdUser.email,
			`Nuxt Pizza / Подтверждения регистрации`,
			{ code, link: `${config.public.siteUrl}/api/auth/verify?code=${code}` },
			true
		)
	} catch (e) {
		console.error('Error [CREATE_USER]', e)
		throw e
	}
})