import type { CreateCartItemValues } from '~/services/dto/cart.dto'
import type { CartStateItem } from '~/lib/get-cart-details'

type ReturnProps = {
	totalAmount: number
	items: CartStateItem[]
	loading: boolean
	updateItemQuantity: (id: number, quantity: number) => void
	removeCartItem: (id: number) => void
	addCartItem: (values: CreateCartItemValues) => void
}

export const useCart = (): ReturnProps => {
	const cartStore = useCartStore()

	onMounted(async () => {
		await cartStore.fetchCartItems()
	})

	return cartStore
}