<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminCategory } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-categories', () => Api.admin.categories.list(), { server: false })
const rows = computed(() => data.value ?? [])

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'name', label: 'Название' },
]

const modalOpen = ref(false)
const editing = ref<AdminCategory | null>(null)
const name = ref('')

const openCreate = () => { editing.value = null; name.value = ''; modalOpen.value = true }
const openEdit = (row: AdminCategory) => { editing.value = row; name.value = row.name; modalOpen.value = true }

const save = async () => {
	const toast = (await import('vue3-toastify')).toast
	try {
		if (editing.value) await Api.admin.categories.update(editing.value.id, { name: name.value })
		else await Api.admin.categories.create({ name: name.value })
		modalOpen.value = false
		await refresh()
		toast.success('Сохранено')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}

const remove = async (row: AdminCategory) => {
	if (!confirm(`Удалить «${row.name}»?`)) return
	const toast = (await import('vue3-toastify')).toast
	try {
		await Api.admin.categories.remove(row.id)
		await refresh()
		toast.success('Удалено')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}
</script>

<template>
	<div>
		<div class="mb-6 flex items-center justify-between">
			<h1 class="text-3xl font-extrabold">Категории</h1>
			<Button @click="openCreate">Добавить</Button>
		</div>

		<AdminDataTable :columns="columns" :rows="rows" :loading="pending">
			<template #actions="{ row }">
				<button class="mr-3 text-gray-500 hover:text-primary" @click="openEdit(row as AdminCategory)">
					<Icon name="lucide:pencil" size="16" />
				</button>
				<button class="text-gray-500 hover:text-red-500" @click="remove(row as AdminCategory)">
					<Icon name="lucide:trash-2" size="16" />
				</button>
			</template>
		</AdminDataTable>

		<AdminModal
			v-if="modalOpen"
			:title="editing ? 'Редактировать категорию' : 'Новая категория'"
			@close="modalOpen = false"
		>
			<form class="flex flex-col gap-4" @submit.prevent="save">
				<input
					v-model.trim="name"
					placeholder="Название"
					class="rounded-xl border border-border px-4 py-2 outline-none"
				/>
				<Button type="submit" :disabled="!name">Сохранить</Button>
			</form>
		</AdminModal>
	</div>
</template>
