import { axiosInstance } from './instance'
import type {
	AdminStats, AdminCategory, AdminIngredient, AdminOrder, AdminProduct, AdminUser,
} from './dto/admin.dto'

const get = async <T>(url: string) => (await axiosInstance.get<T>(url)).data

export const stats = () => get<AdminStats>('/admin/stats')

export const categories = {
	list: () => get<AdminCategory[]>('/admin/categories'),
	create: (body: { name: string }) => axiosInstance.post('/admin/categories', body).then(r => r.data),
	update: (id: number, body: { name: string }) => axiosInstance.patch(`/admin/categories/${id}`, body).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/categories/${id}`).then(r => r.data),
}

export const ingredients = {
	list: () => get<AdminIngredient[]>('/admin/ingredients'),
	create: (body: Omit<AdminIngredient, 'id'>) => axiosInstance.post('/admin/ingredients', body).then(r => r.data),
	update: (id: number, body: Omit<AdminIngredient, 'id'>) => axiosInstance.patch(`/admin/ingredients/${id}`, body).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/ingredients/${id}`).then(r => r.data),
}

export const orders = {
	list: () => get<AdminOrder[]>('/admin/orders'),
	setStatus: (id: number, status: AdminOrder['status']) => axiosInstance.patch(`/admin/orders/${id}`, { status }).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/orders/${id}`).then(r => r.data),
}

export interface ProductPayload {
	name: string
	imgURL: string
	categoryId: number
	ingredientIds: number[]
	items: { price: number; size: number | null; pizzaType: number | null }[]
}

export const products = {
	list: () => get<AdminProduct[]>('/admin/products'),
	create: (body: ProductPayload) => axiosInstance.post('/admin/products', body).then(r => r.data),
	update: (id: number, body: ProductPayload) => axiosInstance.patch(`/admin/products/${id}`, body).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/products/${id}`).then(r => r.data),
}

export const users = {
	list: () => get<AdminUser[]>('/admin/users'),
	remove: (id: number) => axiosInstance.delete(`/admin/users/${id}`).then(r => r.data),
}
