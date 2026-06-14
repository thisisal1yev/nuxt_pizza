import { findOrCreateOAuthUser } from '~/lib/find-or-create-oauth-user'

export default defineOAuthGoogleEventHandler({
	async onSuccess(event, { user }) {
		// user is the user object returned by Google
		const dbUser = await findOrCreateOAuthUser({
			email: user.email,
			emailVerified: Boolean(user.email_verified ?? user.verified_email),
			fullName: user.name,
			provider: 'google',
			providerId: String(user.sub ?? user.email),
		})

		const { password, ...safeUser } = dbUser

		await setUserSession(event, { user: safeUser })

		return sendRedirect(event, '/')
	},

	async onError(event, error) {
		// error is the error returned by Google
		console.error(error)

		return sendRedirect(event, '/')
	},
})
