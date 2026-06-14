import axios from 'axios'

// On the server axios needs an absolute URL; in the browser a relative one works.
const baseURL = import.meta.server
	? `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api`
	: '/api'

export const axiosInstance = axios.create({
	baseURL,
})
