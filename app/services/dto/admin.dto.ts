export interface AdminStats {
	orders: number
	products: number
	users: number
	ingredients: number
	revenue: number
}

export interface AdminCategory { id: number; name: string }

export interface AdminIngredient { id: number; name: string; price: number; imgURL: string }

export interface AdminOrder {
	id: number
	fullName: string
	email: string
	phone: string
	address: string
	totalAmount: number
	status: 'PENDING' | 'SUCCEEDED' | 'CANCELLED'
	createdAt: string
}

export interface AdminProductItem { id?: number; price: number; size: number | null; pizzaType: number | null }

export interface AdminProduct {
	id: number
	name: string
	imgURL: string
	categoryId: number
	category?: { name: string }
	items: AdminProductItem[]
	ingredients: { id: number; name: string }[]
}

export interface AdminUser {
	id: number
	fullName: string
	email: string
	verified: string | null
	createdAt: string
}
