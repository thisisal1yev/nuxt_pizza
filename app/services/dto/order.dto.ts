export interface OrderItemDTO {
	id: number
	quantity: number
	ingredients: { id: number; name: string; price: number }[]
	productItem: {
		price: number
		size: number | null
		pizzaType: number | null
		product: { name: string; imgURL: string }
	}
}

export interface UserOrder {
	id: number
	totalAmount: number
	status: 'PENDING' | 'SUCCEEDED' | 'CANCELLED'
	address: string
	phone: string
	comment: string | null
	items: OrderItemDTO[]
	createdAt: string
}
