import type { User } from '@prisma/client'
import { createError } from 'h3'
import prisma from './prisma'

interface OAuthUserInput {
	email: string
	/** Whether the OAuth provider asserts this email is verified. */
	emailVerified: boolean
	fullName: string
	provider: string
	providerId: string
}

/**
 * Resolve an OAuth login to a real DB user, guarding against account-takeover
 * via email linking:
 *
 * 1. Reject logins whose email the provider has not verified.
 * 2. Match on the provider identity (provider + providerId) first.
 * 3. Only auto-link to an existing email account when that account has no
 *    provider bound yet AND was itself email-verified locally. Otherwise the
 *    user must sign in with their password and link explicitly — we never let
 *    an OAuth login silently take over an existing credentials account.
 * 4. `role`/`verified` are never overwritten, so linking can't escalate or
 *    reset an existing account.
 */
export const findOrCreateOAuthUser = async (
	input: OAuthUserInput
): Promise<User> => {
	if (!input.emailVerified) {
		throw createError({
			statusCode: 403,
			message: 'OAuth email is not verified',
		})
	}

	// Same provider identity → trusted, return as-is.
	const byProvider = await prisma.user.findFirst({
		where: { provider: input.provider, providerId: input.providerId },
	})
	if (byProvider) return byProvider

	const byEmail = await prisma.user.findUnique({
		where: { email: input.email },
	})

	if (byEmail) {
		const safeToLink = !byEmail.provider && byEmail.verified !== null
		if (!safeToLink) {
			throw createError({
				statusCode: 409,
				message:
					'An account with this email already exists. Sign in with your password to link your Google account.',
			})
		}

		return await prisma.user.update({
			where: { id: byEmail.id },
			data: {
				provider: input.provider,
				providerId: input.providerId,
			},
		})
	}

	return await prisma.user.create({
		data: {
			email: input.email,
			fullName: input.fullName || input.email,
			password: '', // OAuth users have no local password
			provider: input.provider,
			providerId: input.providerId,
			verified: new Date(), // email verified by the provider
		},
	})
}
