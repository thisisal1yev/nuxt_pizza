import { defineStore } from 'pinia'
import { getCartDetails, type CartStateItem } from '../lib/get-cart-details'
import { Api } from '../services/apiClient'
import type { CreateCartItemValues } from '../services/dto/cart.dto'

export interface CartState {
	loading: boolean
	error: boolean
	totalAmount: number
	items: CartStateItem[]
}

export const useCartStore = defineStore('cartStore', {
	state: (): CartState => ({
		loading: false,
		error: false,
		totalAmount: 0,
		items: [],
	}),

	actions: {
		async fetchCartItems() {
			this.loading = true
			this.error = false

			try {
				const data = await Api.cart.getCart()
				const details = getCartDetails(data)
				this.items = details.items
				this.totalAmount = details.totalAmount
			} catch (e) {
				this.error = true
				console.error(e)
			} finally {
				this.loading = false
			}
		},

		async updateItemQuantity(id: number, quantity: number) {
			this.loading = true
			this.error = false

			try {
				const data = await Api.cart.updateItemQuantity(id, quantity)
				const details = getCartDetails(data)
				this.items = details.items
				this.totalAmount = details.totalAmount
			} catch (e) {
				this.error = true
				console.error(e)
			} finally {
				this.loading = false
			}
		},

		async removeCartItem(id: number) {
			this.loading = true
			this.error = false

			try {
				const data = await Api.cart.removeCartItem(id)
				const details = getCartDetails(data)
				this.items = details.items
				this.totalAmount = details.totalAmount
			} catch (e) {
				this.error = true
				console.error(e)
			} finally {
				this.loading = false
			}
		},

		async addCartItem(values: CreateCartItemValues) {
			this.loading = true
			this.error = false

			try {
				const data = await Api.cart.addCartItem(values)
				const details = getCartDetails(data)
				this.items = details.items
				this.totalAmount = details.totalAmount
			} catch (e) {
				this.error = true
				console.error(e)
			} finally {
				this.loading = false
			}
		},
	},
})
