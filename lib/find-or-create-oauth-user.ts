import type { User } from '@prisma/client'
import prisma from './prisma'

interface OAuthUserInput {
	email: string
	fullName: string
	provider: string
	providerId: string
}

/**
 * Resolve an OAuth login to a real DB user.
 * - Matches by unique email so an existing password account (incl. ADMIN) is reused.
 * - `role` and `verified` are NOT overwritten on update, so OAuth login can't
 *   downgrade an admin or reset verification.
 */
export const findOrCreateOAuthUser = async (
	input: OAuthUserInput
): Promise<User> => {
	return await prisma.user.upsert({
		where: { email: input.email },
		update: {
			provider: input.provider,
			providerId: input.providerId,
		},
		create: {
			email: input.email,
			fullName: input.fullName || input.email,
			password: '', // OAuth users have no local password
			provider: input.provider,
			providerId: input.providerId,
			verified: new Date(), // email verified by the provider
		},
	})
}
