<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminUser } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-users', () => Api.admin.users.list(), { server: false })
const rows = computed(() => data.value ?? [])

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'fullName', label: 'Имя' },
	{ key: 'email', label: 'E-Mail' },
	{ key: 'verified', label: 'Подтверждён' },
	{ key: 'role', label: 'Роль' },
]

const setRole = async (row: AdminUser, role: AdminUser['role']) => {
	const toast = (await import('vue3-toastify')).toast
	try {
		await Api.admin.users.setRole(row.id, role)
		await refresh()
		toast.success('Роль обновлена')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}

const remove = async (row: AdminUser) => {
	if (!confirm(`Удалить «${row.email}»?`)) return
	const toast = (await import('vue3-toastify')).toast
	try {
		await Api.admin.users.remove(row.id)
		await refresh()
		toast.success('Удалено')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}
</script>

<template>
	<div>
		<h1 class="mb-6 text-3xl font-extrabold">Пользователи</h1>

		<AdminDataTable :columns="columns" :rows="rows" :loading="pending">
			<template #cell-verified="{ row }">
				<span :class="(row as AdminUser).verified ? 'text-green-600' : 'text-gray-400'">
					{{ (row as AdminUser).verified ? 'да' : 'нет' }}
				</span>
			</template>
			<template #cell-role="{ row }">
				<select
					:value="(row as AdminUser).role"
					class="rounded-lg border border-gray-200 px-2 py-1 text-sm"
					@change="setRole(row as AdminUser, ($event.target as HTMLSelectElement).value as AdminUser['role'])"
				>
					<option value="USER">USER</option>
					<option value="ADMIN">ADMIN</option>
				</select>
			</template>
			<template #actions="{ row }">
				<button class="text-gray-500 hover:text-red-500" @click="remove(row as AdminUser)">
					<Icon name="lucide:trash-2" size="16" />
				</button>
			</template>
		</AdminDataTable>
	</div>
</template>
