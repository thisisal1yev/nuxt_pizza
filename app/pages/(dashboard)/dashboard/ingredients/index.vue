<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminIngredient } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-ingredients', () => Api.admin.ingredients.list(), { server: false })
const rows = computed(() => data.value ?? [])

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'imgURL', label: 'Фото' },
	{ key: 'name', label: 'Название' },
	{ key: 'price', label: 'Цена' },
]

const modalOpen = ref(false)
const editing = ref<AdminIngredient | null>(null)
const form = reactive({ name: '', price: 0, imgURL: '' })

const openCreate = () => {
	editing.value = null
	Object.assign(form, { name: '', price: 0, imgURL: '' })
	modalOpen.value = true
}
const openEdit = (row: AdminIngredient) => {
	editing.value = row
	Object.assign(form, { name: row.name, price: row.price, imgURL: row.imgURL })
	modalOpen.value = true
}

const save = async () => {
	const toast = (await import('vue3-toastify')).toast
	const body = { name: form.name, price: Number(form.price), imgURL: form.imgURL }
	try {
		if (editing.value) await Api.admin.ingredients.update(editing.value.id, body)
		else await Api.admin.ingredients.create(body)
		modalOpen.value = false
		await refresh()
		toast.success('Сохранено')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}

const remove = async (row: AdminIngredient) => {
	if (!confirm(`Удалить «${row.name}»?`)) return
	const toast = (await import('vue3-toastify')).toast
	try {
		await Api.admin.ingredients.remove(row.id)
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
			<h1 class="text-3xl font-extrabold">Ингредиенты</h1>
			<Button @click="openCreate">Добавить</Button>
		</div>

		<AdminDataTable :columns="columns" :rows="rows" :loading="pending">
			<template #cell-imgURL="{ row }">
				<img :src="(row as AdminIngredient).imgURL" :alt="(row as AdminIngredient).name" class="h-10 w-10 rounded object-cover" />
			</template>
			<template #cell-price="{ row }">{{ (row as AdminIngredient).price }} ₽</template>
			<template #actions="{ row }">
				<button class="mr-3 text-gray-500 hover:text-primary" @click="openEdit(row as AdminIngredient)">
					<Icon name="lucide:pencil" size="16" />
				</button>
				<button class="text-gray-500 hover:text-red-500" @click="remove(row as AdminIngredient)">
					<Icon name="lucide:trash-2" size="16" />
				</button>
			</template>
		</AdminDataTable>

		<AdminModal
			v-if="modalOpen"
			:title="editing ? 'Редактировать ингредиент' : 'Новый ингредиент'"
			@close="modalOpen = false"
		>
			<form class="flex flex-col gap-4" @submit.prevent="save">
				<input v-model.trim="form.name" placeholder="Название" class="rounded-xl border border-border px-4 py-2 outline-none" />
				<input v-model.number="form.price" type="number" min="0" placeholder="Цена" class="rounded-xl border border-border px-4 py-2 outline-none" />
				<input v-model.trim="form.imgURL" placeholder="URL картинки" class="rounded-xl border border-border px-4 py-2 outline-none" />
				<Button type="submit" :disabled="!form.name || !form.imgURL">Сохранить</Button>
			</form>
		</AdminModal>
	</div>
</template>
