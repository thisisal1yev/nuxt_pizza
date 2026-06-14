export default defineNuxtRouteMiddleware(async () => {
	const { loggedIn, user } = useUserSession()

	if (!loggedIn.value || user.value?.role !== 'ADMIN') {
		return navigateTo('/not-auth')
	}
})