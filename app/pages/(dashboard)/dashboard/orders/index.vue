<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminOrder } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-orders', () => Api.admin.orders.list(), { server: false })
const rows = computed(() => data.value ?? [])

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'fullName', label: 'Клиент' },
	{ key: 'phone', label: 'Телефон' },
	{ key: 'totalAmount', label: 'Сумма' },
	{ key: 'status', label: 'Статус' },
]

const statuses: AdminOrder['status'][] = ['PENDING', 'SUCCEEDED', 'CANCELLED']

const setStatus = async (row: AdminOrder, status: AdminOrder['status']) => {
	const toast = (await import('vue3-toastify')).toast
	try {
		await Api.admin.orders.setStatus(row.id, status)
		await refresh()
		toast.success('Статус обновлён')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}

const remove = async (row: AdminOrder) => {
	if (!confirm(`Удалить заказ #${row.id}?`)) return
	const toast = (await import('vue3-toastify')).toast
	try {
		await Api.admin.orders.remove(row.id)
		await refresh()
		toast.success('Удалено')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}
</script>

<template>
	<div>
		<h1 class="mb-6 text-3xl font-extrabold">Заказы</h1>

		<AdminDataTable :columns="columns" :rows="rows" :loading="pending">
			<template #cell-totalAmount="{ row }">{{ (row as AdminOrder).totalAmount }} ₽</template>
			<template #cell-status="{ row }">
				<select
					:value="(row as AdminOrder).status"
					class="rounded-lg border border-gray-200 px-2 py-1 text-sm"
					@change="setStatus(row as AdminOrder, ($event.target as HTMLSelectElement).value as AdminOrder['status'])"
				>
					<option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
				</select>
			</template>
			<template #actions="{ row }">
				<button class="text-gray-500 hover:text-red-500" @click="remove(row as AdminOrder)">
					<Icon name="lucide:trash-2" size="16" />
				</button>
			</template>
		</AdminDataTable>
	</div>
</template>
