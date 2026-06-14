<script lang="ts" setup>
import type { PizzaSize, PizzaType } from '~/constants/pizza'
import type { CartStateItem } from '~/lib/get-cart-details'
import { getCartItemDetails } from '~/lib/get-cart-item-details'

interface Props {
	items: CartStateItem[]
	loading?: boolean
}

defineProps<Props>()
defineEmits(['onClickCountButton', 'removeCartItem'])
</script>

<template>
	<WhiteBlock title="1. Корзина">
		<template #lower>
			<div class="space-y-5">
				<div class="space-y-5" v-if="loading && items.length === 0">
					<SkeletonCheckoutItem
						v-for="i in items.length ? items.length : 3"
						:key="i"
					/>
				</div>

				<p
					v-else-if="items.length === 0 && !loading"
					class="text-lg font-semibold"
				>
					Корзина пуста
				</p>

				<CheckoutItem
					v-else
					v-for="item in items"
					:key="item.id"
					:id="item.id"
					:imgURL="item.imgURL"
					:name="item.name"
					:quantity="item.quantity"
					:price="item.price"
					:details="
									getCartItemDetails(
										item.ingredients,
										item.pizzaType as PizzaType,
										item.pizzaSize as PizzaSize,
									)
								"
					:disabled="loading"
					@onClickCountButton="
						(id:number, quantity:number, type:string) =>
							$emit('onClickCountButton', id, quantity, type)
					"
					@onClickRemove="id => $emit('removeCartItem', id)"
				/>
			</div>
		</template>
	</WhiteBlock>
</template>
