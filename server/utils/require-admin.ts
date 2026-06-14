import type { H3Event } from 'h3'

/**
 * Throws 403 unless the current session user is an ADMIN.
 * Returns the session user on success.
 */
export async function requireAdmin(event: H3Event) {
	const { user } = await getUserSession(event)

	if (!user || (user as { role?: string }).role !== 'ADMIN') {
		throw createError({ statusCode: 403, message: 'Доступ запрещён' })
	}

	return user as { id: number | string; role: string; email: string; fullName: string }
}
