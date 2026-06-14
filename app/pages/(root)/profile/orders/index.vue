<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { OrderItemDTO } from '~/services/dto/order.dto'

definePageMeta({
	middleware: 'auth',
	layout: 'profile-layout',
})

useSeoMeta({
	title: 'Nuxt Pizza | Мои заказы',
	description: 'Nuxt Pizza | Мои заказы',
})

const { data, pending } = await useAsyncData('my-orders', () => Api.order.mine(), {
	server: false,
})
const orders = computed(() => data.value ?? [])

const statusMap = {
	PENDING: { label: 'Ожидает оплаты', class: 'text-amber-600 bg-amber-500/10' },
	SUCCEEDED: { label: 'Оплачен', class: 'text-green-600 bg-green-500/10' },
	CANCELLED: { label: 'Отменён', class: 'text-red-600 bg-red-500/10' },
} as const

const formatDate = (d: string) =>
	new Date(d).toLocaleString('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})

const itemTitle = (i: OrderItemDTO) => {
	const parts: string[] = []
	if (i.productItem.size) parts.push(`${i.productItem.size} см`)
	if (i.productItem.pizzaType)
		parts.push(i.productItem.pizzaType === 1 ? 'традиционное' : 'тонкое')
	const suffix = parts.length ? ` (${parts.join(', ')})` : ''
	return `${i.productItem.product.name}${suffix}`
}
</script>

<template>
	<div>
		<h3 class="font-bold text-xl mb-6">Мои заказы</h3>

		<div v-if="pending" class="text-gray-400">Загрузка...</div>

		<div
			v-else-if="orders.length === 0"
			class="flex flex-col items-center gap-4 rounded-2xl bg-card py-16 text-center"
		>
			<Icon name="lucide:receipt" size="48" class="text-gray-300" />
			<p class="text-gray-500">У вас пока нет заказов</p>
			<NuxtLink
				to="/"
				class="rounded-2xl bg-primary px-6 py-3 font-bold text-white transition-colors hover:bg-primary/90"
			>
				За пиццей →
			</NuxtLink>
		</div>

		<div v-else class="flex flex-col gap-4">
			<article
				v-for="order in orders"
				:key="order.id"
				class="rounded-2xl bg-card p-5 shadow-sm"
			>
				<header class="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
					<div>
						<p class="font-bold">Заказ #{{ order.id }}</p>
						<p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
					</div>
					<span
						class="rounded-full px-3 py-1 text-sm font-bold"
						:class="statusMap[order.status].class"
					>
						{{ statusMap[order.status].label }}
					</span>
				</header>

				<ul class="flex flex-col gap-2 py-4">
					<li
						v-for="item in order.items"
						:key="item.id"
						class="flex items-start justify-between gap-3 text-sm"
					>
						<span class="text-gray-700 dark:text-gray-300">
							{{ itemTitle(item) }}
							<span class="text-gray-400">× {{ item.quantity }}</span>
							<span
								v-if="item.ingredients.length"
								class="block text-xs text-gray-400"
							>
								+ {{ item.ingredients.map((ing) => ing.name).join(', ') }}
							</span>
						</span>
						<span class="shrink-0 font-medium">{{ item.productItem.price }} ₽</span>
					</li>
				</ul>

				<footer class="flex items-center justify-between border-t border-border pt-4">
					<span class="text-sm text-gray-500">{{ order.address }}</span>
					<span class="font-bold">{{ order.totalAmount }} ₽</span>
				</footer>
			</article>
		</div>
	</div>
</template>
