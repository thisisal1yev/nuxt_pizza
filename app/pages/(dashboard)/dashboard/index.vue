<script lang="ts" setup>
import { Api } from '~/services/apiClient'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data } = await useAsyncData('admin-stats', () => Api.admin.stats(), { server: false })

const cards = computed(() => [
	{ label: 'Заказы', value: data.value?.orders ?? 0, icon: 'lucide:receipt' },
	{ label: 'Продукты', value: data.value?.products ?? 0, icon: 'lucide:pizza' },
	{ label: 'Ингредиенты', value: data.value?.ingredients ?? 0, icon: 'lucide:carrot' },
	{ label: 'Пользователи', value: data.value?.users ?? 0, icon: 'lucide:users' },
	{ label: 'Выручка (₽)', value: data.value?.revenue ?? 0, icon: 'lucide:banknote' },
])
</script>

<template>
	<div>
		<h1 class="mb-8 text-3xl font-extrabold">Обзор</h1>
		<div class="grid grid-cols-2 gap-5 md:grid-cols-3">
			<div
				v-for="card in cards"
				:key="card.label"
				class="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
					<Icon :name="card.icon" size="22" />
				</div>
				<div>
					<p class="text-sm text-gray-500">{{ card.label }}</p>
					<p class="text-2xl font-bold">{{ card.value }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
