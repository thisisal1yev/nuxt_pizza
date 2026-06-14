<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminProduct } from '~/services/dto/admin.dto'
import type { ProductPayload } from '~/services/admin'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const [{ data: productsData, refresh, pending }, { data: cats }, { data: ings }] = await Promise.all([
	useAsyncData('admin-products', () => Api.admin.products.list(), { server: false }),
	useAsyncData('admin-products-cats', () => Api.admin.categories.list(), { server: false }),
	useAsyncData('admin-products-ings', () => Api.admin.ingredients.list(), { server: false }),
])
const rows = computed(() => productsData.value ?? [])

const columns = [
	{ key: 'imgURL', label: 'Фото' },
	{ key: 'name', label: 'Название' },
	{ key: 'category', label: 'Категория' },
	{ key: 'items', label: 'Варианты' },
]

const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive<ProductPayload>({ name: '', imgURL: '', categoryId: 0, ingredientIds: [], items: [] })

const blankItem = () => ({ price: 0, size: null as number | null, pizzaType: null as number | null })

const openCreate = () => {
	editingId.value = null
	Object.assign(form, { name: '', imgURL: '', categoryId: cats.value?.[0]?.id ?? 0, ingredientIds: [], items: [blankItem()] })
	modalOpen.value = true
}
const openEdit = (row: AdminProduct) => {
	editingId.value = row.id
	Object.assign(form, {
		name: row.name,
		imgURL: row.imgURL,
		categoryId: row.categoryId,
		ingredientIds: row.ingredients.map((i) => i.id),
		items: row.items.map((i) => ({ price: i.price, size: i.size, pizzaType: i.pizzaType })),
	})
	modalOpen.value = true
}

const addItem = () => form.items.push(blankItem())
const removeItem = (idx: number) => form.items.splice(idx, 1)
const toggleIngredient = (id: number) => {
	const i = form.ingredientIds.indexOf(id)
	if (i === -1) form.ingredientIds.push(id)
	else form.ingredientIds.splice(i, 1)
}

const save = async () => {
	const toast = (await import('vue3-toastify')).toast
	const payload: ProductPayload = {
		name: form.name,
		imgURL: form.imgURL,
		categoryId: Number(form.categoryId),
		ingredientIds: form.ingredientIds,
		items: form.items.map((i) => ({
			price: Number(i.price),
			size: i.size === null || i.size === undefined ? null : Number(i.size),
			pizzaType: i.pizzaType === null || i.pizzaType === undefined ? null : Number(i.pizzaType),
		})),
	}
	try {
		if (editingId.value) await Api.admin.products.update(editingId.value, payload)
		else await Api.admin.products.create(payload)
		modalOpen.value = false
		await refresh()
		toast.success('Сохранено')
	} catch (e: any) {
		toast.error(e?.response?.data?.message ?? 'Ошибка')
	}
}

const remove = async (row: AdminProduct) => {
	if (!confirm(`Удалить «${row.name}»?`)) return
	const toast = (await import('vue3-toastify')).toast
	try {
		await Api.admin.products.remove(row.id)
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
			<h1 class="text-3xl font-extrabold">Продукты</h1>
			<Button @click="openCreate">Добавить</Button>
		</div>

		<AdminDataTable :columns="columns" :rows="rows" :loading="pending">
			<template #cell-imgURL="{ row }">
				<img :src="(row as AdminProduct).imgURL" :alt="(row as AdminProduct).name" class="h-10 w-10 rounded object-cover" />
			</template>
			<template #cell-category="{ row }">{{ (row as AdminProduct).category?.name ?? '—' }}</template>
			<template #cell-items="{ row }">{{ (row as AdminProduct).items.length }}</template>
			<template #actions="{ row }">
				<button class="mr-3 text-gray-500 hover:text-primary" @click="openEdit(row as AdminProduct)">
					<Icon name="lucide:pencil" size="16" />
				</button>
				<button class="text-gray-500 hover:text-red-500" @click="remove(row as AdminProduct)">
					<Icon name="lucide:trash-2" size="16" />
				</button>
			</template>
		</AdminDataTable>

		<AdminModal
			v-if="modalOpen"
			:title="editingId ? 'Редактировать продукт' : 'Новый продукт'"
			@close="modalOpen = false"
		>
			<form class="flex max-h-[70vh] flex-col gap-4 overflow-y-auto" @submit.prevent="save">
				<input v-model.trim="form.name" placeholder="Название" class="rounded-xl border border-gray-200 px-4 py-2 outline-none" />
				<input v-model.trim="form.imgURL" placeholder="URL картинки" class="rounded-xl border border-gray-200 px-4 py-2 outline-none" />

				<select v-model.number="form.categoryId" class="rounded-xl border border-gray-200 px-4 py-2 outline-none">
					<option v-for="c in cats ?? []" :key="c.id" :value="c.id">{{ c.name }}</option>
				</select>

				<div>
					<p class="mb-2 text-sm font-medium text-gray-600">Ингредиенты</p>
					<div class="flex flex-wrap gap-2">
						<button
							v-for="ing in ings ?? []"
							:key="ing.id"
							type="button"
							class="rounded-full border px-3 py-1 text-sm"
							:class="form.ingredientIds.includes(ing.id) ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-600'"
							@click="toggleIngredient(ing.id)"
						>
							{{ ing.name }}
						</button>
					</div>
				</div>

				<div>
					<div class="mb-2 flex items-center justify-between">
						<p class="text-sm font-medium text-gray-600">Варианты (цена / размер / тип)</p>
						<button type="button" class="text-sm text-primary" @click="addItem">+ вариант</button>
					</div>
					<div v-for="(item, idx) in form.items" :key="idx" class="mb-2 flex flex-col sm:flex-row sm:items-center gap-2">
						<input v-model.number="item.price" type="number" min="0" placeholder="Цена" class="w-full sm:w-24 rounded-lg border border-gray-200 px-2 py-1" />
						<input v-model.number="item.size" type="number" placeholder="Размер" class="w-full sm:w-24 rounded-lg border border-gray-200 px-2 py-1" />
						<input v-model.number="item.pizzaType" type="number" placeholder="Тип" class="w-full sm:w-24 rounded-lg border border-gray-200 px-2 py-1" />
						<button type="button" class="text-gray-400 hover:text-red-500" @click="removeItem(idx)">
							<Icon name="lucide:x" size="16" />
						</button>
					</div>
				</div>

				<Button type="submit" :disabled="!form.name || !form.imgURL || !form.categoryId || form.items.length === 0">
					Сохранить
				</Button>
			</form>
		</AdminModal>
	</div>
</template>
