<script lang="ts" setup>
import type { PizzaSize, PizzaType } from '~/constants/pizza'
import { getCartItemDetails } from '~/lib/get-cart-item-details'

defineProps<{
	isVisible: boolean
}>()
defineEmits(['close'])

const cartStore = useCart()

const onClickCountButton = (
	id: number,
	quantity: number,
	type: 'plus' | 'minus'
) => {
	const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1
	cartStore.updateItemQuantity(id, newQuantity)
}

async function removeCartItem(id: number, name: string) {
	try {
		const toast = (await import('vue3-toastify')).toast
		cartStore.removeCartItem(id)

		toast.success(`${name} удалена из корзины`, {
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	} catch (e) {
		console.error(e)
		const toast = (await import('vue3-toastify')).toast

		toast.error('Не удалось удалить товар из корзины', {
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	}
}
</script>

<template>
	<div
		v-if="isVisible"
		@click="$emit('close')"
		class="opacity-50 z-40 fixed bg-black top-0 left-0 w-full h-full"
	></div>

	<div
		v-motion
		:initial="{
			x: 250,
			transition: {
				duration: 250,
				delay: 0,
			},
		}"
		:enter="{
			x: 1,
			transition: {
				duration: 100,
				delay: 0,
			},
		}"
		:leave="{
			x: 250,
			transition: {
				duration: 250,
				delay: 0,
			},
		}"
		v-if="isVisible"
		class="fixed top-0 right-0 outline-hidden w-1/4 z-50 bg-[#f1f4ee] overscroll-none transform duration-500 h-screen"
	>
		<div
			v-if="cartStore.items.length > 0"
			class="flex flex-col h-full justify-between"
		>
			<div class="flex flex-col items-start p-10">
				<div class="flex items-center justify-between w-full">
					<h4>
						<span
							>В корзине <b>{{ cartStore.items.length }} товара</b></span
						>
					</h4>
					<button type="button" @click="$emit('close')">
						<Icon name="lucide:x" size="24" />
					</button>
				</div>
			</div>

			<div class="overflow-auto flex-1 grow space-y-5">
				<CartDrawerItem
					v-for="item in cartStore.items"
					@onClickCountButton="
						(id, quantity, type) => onClickCountButton(id, quantity, type)
					"
					@onClickRemove="(id, name) => removeCartItem(id, name)"
					:key="item.id"
					:id="item.id"
					:imgURL="item.imgURL"
					:name="item.name"
					:details="
						item.pizzaType && item.pizzaSize
							? getCartItemDetails(item.ingredients, item.pizzaType as PizzaType, item.pizzaSize as PizzaSize)
							: ''
					"
					:quantity="item.quantity"
					:price="item.price"
					:disabled="cartStore.loading"
				/>
			</div>

			<div class="py-8 px-10 bg-white">
				<div class="w-full space-y-5">
					<div class="flex mb-4">
						<div class="flex flex-1 text-lg text-neutral-500">
							Итого
							<span
								class="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2"
							></span>
						</div>
						<b class="text-lg"
							>{{
								!cartStore.loading
									? cartStore.totalAmount + '&nbsp;&#8381;'
									: '...'
							}}
						</b>
					</div>

					<NuxtLink to="/checkout" class="inline-block w-full">
						<Button type="submit" class="w-full h-12 text-base">
							Оформить заказ

							<Icon name="lucide:arrow-right" size="18" class="ml-4" />
						</Button>
					</NuxtLink>
				</div>
			</div>
		</div>

		<div v-else class="flex flex-col h-full justify-between">
			<div class="grow flex-1 flex flex-col items-center justify-center">
				<img
					width="120"
					height="120"
					src="/assets/images/empty-box.png"
					alt="empty box"
				/>

				<div class="flex flex-col items-center space-y-4">
					<h4 class="text-center font-bold">Корзина пустая</h4>

					<p className="text-center text-neutral-500">
						Добавьте хотя бы одну пиццу, чтобы совершить заказ
					</p>

					<Button
						@click="$emit('close')"
						class="w-56 h-12 text-base rounded-xl"
						size="lg"
					>
						<Icon name="lucide:arrow-left" size="18" class="mr-2" />

						Вернуться назад
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>
