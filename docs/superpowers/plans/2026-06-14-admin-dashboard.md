# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a role-gated admin dashboard at `/dashboard` with full CRUD over Orders, Products, Categories, Ingredients and Users.

**Architecture:** A dedicated `server/api/admin/**` route namespace, every handler guarded by a shared `requireAdmin(event)` server util (403 on non-admin). The UI lives under `/dashboard/*` sub-routes inside the existing `dashboard-layout`, which gains a left sidebar. Pages fetch admin JSON via `$fetch`, render a reusable `Admin/DataTable.vue`, and mutate through per-entity modal forms (VeeValidate + Zod 4). Page access is already gated by `middleware/dashboard.ts`.

**Tech Stack:** Nuxt 4 (app/ srcDir), Prisma 7 (`@prisma/adapter-pg`), Pinia, VeeValidate + Zod 4, Tailwind v4, `@nuxt/icon`.

---

## Testing note (no formal test harness)

This project has no test runner or test database. Per-task verification therefore uses:
- **Build gate:** `bun run build` must finish with `✨ Build complete!` and no errors.
- **Runtime gate:** a throwaway `_check.ts` run with `bun _check.ts` (bun auto-loads `.env`) that calls the handler logic / Prisma directly, or `curl` against `bun dev` with an admin session cookie.
- Delete throwaway scripts after use (`rm _check.ts`).

Admin endpoints require an ADMIN session. To create one for manual checks: set a user's role to ADMIN in the DB (`UPDATE "User" SET role='ADMIN' WHERE email='<you>';`) and log in.

---

## File Structure

**Server (root `server/`, stays outside `app/`):**
- `server/utils/require-admin.ts` — admin guard (auto-imported in server)
- `server/utils/admin-schemas.ts` — Zod payload schemas for admin mutations
- `server/api/admin/stats.get.ts`
- `server/api/admin/categories/index.get.ts` · `index.post.ts` · `[id]/index.patch.ts` · `[id]/index.delete.ts`
- `server/api/admin/ingredients/index.get.ts` · `index.post.ts` · `[id]/index.patch.ts` · `[id]/index.delete.ts`
- `server/api/admin/orders/index.get.ts` · `[id]/index.patch.ts` · `[id]/index.delete.ts`
- `server/api/admin/products/index.get.ts` · `index.post.ts` · `[id]/index.patch.ts` · `[id]/index.delete.ts`
- `server/api/admin/users/index.get.ts` · `[id]/index.patch.ts` · `[id]/index.delete.ts`

**Client (`app/`):**
- `app/layouts/dashboardLayout.vue` — add sidebar (modify)
- `app/components/Admin/Sidebar.vue` — nav
- `app/components/Admin/DataTable.vue` — reusable table (columns + rows + `#actions`/`#cell-<key>` slots)
- `app/components/Admin/Modal.vue` — reusable modal shell
- `app/services/admin.ts` — typed admin API client + `app/services/dto/admin.dto.ts`
- `app/pages/(dashboard)/dashboard/index.vue` — overview (modify)
- `app/pages/(dashboard)/dashboard/categories/index.vue`
- `app/pages/(dashboard)/dashboard/ingredients/index.vue`
- `app/pages/(dashboard)/dashboard/orders/index.vue`
- `app/pages/(dashboard)/dashboard/products/index.vue`
- `app/pages/(dashboard)/dashboard/users/index.vue`

Build order: guard+schemas → shell (sidebar + stats + overview) → categories → ingredients → orders → products → users.

---

## Task 1: Admin guard util

**Files:**
- Create: `server/utils/require-admin.ts`

- [ ] **Step 1: Write the guard**

```ts
import type { H3Event } from 'h3'

/**
 * Throws 403 unless the current session user is an ADMIN.
 * Returns the session user on success.
 */
export async function requireAdmin(event: H3Event) {
	const { user } = await getUserSession(event)

	if (!user || (user as { role?: string }).role !== 'ADMIN') {
		throw createError({ statusCode: 403, message: 'Доступ запрещён' })
	}

	return user as { id: number | string; role: string; email: string; fullName: string }
}
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`, no errors.

- [ ] **Step 3: Commit**

```bash
git add server/utils/require-admin.ts
git commit -m "feat(admin): add requireAdmin server guard"
```

---

## Task 2: Admin payload schemas

**Files:**
- Create: `server/utils/admin-schemas.ts`

- [ ] **Step 1: Write the schemas**

```ts
import { z } from 'zod'

export const categoryInput = z.object({
	name: z.string().min(1, { error: 'Название обязательно' }),
})

export const ingredientInput = z.object({
	name: z.string().min(1, { error: 'Название обязательно' }),
	price: z.number().int().nonnegative({ error: 'Цена должна быть ≥ 0' }),
	imgURL: z.url({ error: 'Некорректный URL' }),
})

export const productItemInput = z.object({
	price: z.number().int().nonnegative(),
	size: z.number().int().nullable().optional(),
	pizzaType: z.number().int().nullable().optional(),
})

export const productInput = z.object({
	name: z.string().min(1, { error: 'Название обязательно' }),
	imgURL: z.url({ error: 'Некорректный URL' }),
	categoryId: z.number().int().positive({ error: 'Выберите категорию' }),
	ingredientIds: z.array(z.number().int().positive()).default([]),
	items: z.array(productItemInput).min(1, { error: 'Нужен минимум один вариант' }),
})

export const orderStatusInput = z.object({
	status: z.enum(['PENDING', 'SUCCEEDED', 'CANCELLED']),
})

export const userRoleInput = z.object({
	role: z.enum(['USER', 'ADMIN']),
})

/** Parse a request body or throw 400 with the first Zod message. */
export async function readAdminBody<T>(event: import('h3').H3Event, schema: z.ZodType<T>): Promise<T> {
	const body = await readBody(event)
	const parsed = schema.safeParse(body)
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			message: parsed.error.issues[0]?.message ?? 'Некорректные данные',
		})
	}
	return parsed.data
}
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 3: Commit**

```bash
git add server/utils/admin-schemas.ts
git commit -m "feat(admin): add zod payload schemas + readAdminBody helper"
```

---

## Task 3: Overview stats endpoint

**Files:**
- Create: `server/api/admin/stats.get.ts`

- [ ] **Step 1: Write the handler**

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)

	const [orders, products, users, ingredients, revenue] = await Promise.all([
		prisma.order.count(),
		prisma.product.count(),
		prisma.user.count(),
		prisma.ingredient.count(),
		prisma.order.aggregate({
			_sum: { totalAmount: true },
			where: { status: 'SUCCEEDED' },
		}),
	])

	return {
		orders,
		products,
		users,
		ingredients,
		revenue: revenue._sum.totalAmount ?? 0,
	}
})
```

- [ ] **Step 2: Verify runtime**

Create `_check.ts`:

```ts
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) })
console.log('orders', await prisma.order.count(), 'products', await prisma.product.count())
await prisma.$disconnect()
```

Run: `bun _check.ts` then `rm _check.ts`
Expected: prints counts without error.

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 4: Commit**

```bash
git add server/api/admin/stats.get.ts
git commit -m "feat(admin): add overview stats endpoint"
```

---

## Task 4: Reusable DataTable + Modal components

**Files:**
- Create: `app/components/Admin/DataTable.vue`
- Create: `app/components/Admin/Modal.vue`

- [ ] **Step 1: Write `DataTable.vue`**

```vue
<script lang="ts" setup generic="T extends { id: number }">
defineProps<{
	columns: { key: string; label: string }[]
	rows: T[]
	loading?: boolean
}>()
</script>

<template>
	<div class="overflow-x-auto rounded-xl bg-white shadow-sm">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-gray-100 text-gray-500">
				<tr>
					<th v-for="c in columns" :key="c.key" class="px-4 py-3 font-medium">
						{{ c.label }}
					</th>
					<th class="px-4 py-3 font-medium text-right">Действия</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="loading">
					<td :colspan="columns.length + 1" class="px-4 py-6 text-center text-gray-400">
						Загрузка...
					</td>
				</tr>
				<tr v-else-if="rows.length === 0">
					<td :colspan="columns.length + 1" class="px-4 py-6 text-center text-gray-400">
						Нет данных
					</td>
				</tr>
				<tr
					v-for="row in rows"
					:key="row.id"
					class="border-b border-gray-50 last:border-0 hover:bg-gray-50"
				>
					<td v-for="c in columns" :key="c.key" class="px-4 py-3">
						<slot :name="`cell-${c.key}`" :row="row">
							{{ (row as Record<string, unknown>)[c.key] }}
						</slot>
					</td>
					<td class="px-4 py-3 text-right">
						<slot name="actions" :row="row" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
```

- [ ] **Step 2: Write `Modal.vue`**

```vue
<script lang="ts" setup>
defineProps<{ title: string }>()
defineEmits<{ close: [] }>()
</script>

<template>
	<div
		class="fixed inset-0 z-40 flex items-start justify-center bg-black/50 p-4 pt-24"
		@click.self="$emit('close')"
	>
		<div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
			<div class="mb-5 flex items-center justify-between">
				<h2 class="text-xl font-bold">{{ title }}</h2>
				<button type="button" @click="$emit('close')">
					<Icon name="lucide:x" size="20" />
				</button>
			</div>
			<slot />
		</div>
	</div>
</template>
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 4: Commit**

```bash
git add app/components/Admin/DataTable.vue app/components/Admin/Modal.vue
git commit -m "feat(admin): add reusable DataTable and Modal components"
```

---

## Task 5: Sidebar + dashboard layout

**Files:**
- Create: `app/components/Admin/Sidebar.vue`
- Modify: `app/layouts/dashboardLayout.vue`

- [ ] **Step 1: Write `Sidebar.vue`**

```vue
<script lang="ts" setup>
const links = [
	{ to: '/dashboard', label: 'Обзор', icon: 'lucide:layout-dashboard' },
	{ to: '/dashboard/orders', label: 'Заказы', icon: 'lucide:receipt' },
	{ to: '/dashboard/products', label: 'Продукты', icon: 'lucide:pizza' },
	{ to: '/dashboard/categories', label: 'Категории', icon: 'lucide:folder' },
	{ to: '/dashboard/ingredients', label: 'Ингредиенты', icon: 'lucide:carrot' },
	{ to: '/dashboard/users', label: 'Пользователи', icon: 'lucide:users' },
]
</script>

<template>
	<aside class="w-56 shrink-0">
		<nav class="flex flex-col gap-1">
			<NuxtLink
				v-for="link in links"
				:key="link.to"
				:to="link.to"
				class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white"
				active-class="bg-white text-primary shadow-sm"
				exact-active-class="bg-white text-primary shadow-sm"
			>
				<Icon :name="link.icon" size="18" />
				{{ link.label }}
			</NuxtLink>
		</nav>
	</aside>
</template>
```

Note: `/dashboard` must match exactly (use `exact-active-class`) so it isn't highlighted on sub-routes.

- [ ] **Step 2: Modify `dashboardLayout.vue`**

Replace the file with:

```vue
<script lang="ts" setup>
useSeoMeta({
	title: 'Nuxt Pizza | Панель управления',
	description: 'Nuxt Pizza | Панель управления',
})
</script>

<template>
	<main class="flex flex-col w-full min-h-screen bg-[#f4f1ee]">
		<Header
			:hasSearch="true"
			:hasCart="true"
			class="border-b-gray-200 container"
		/>

		<div class="grow h-auto container my-10 flex gap-8">
			<AdminSidebar />
			<div class="grow">
				<slot />
			</div>
		</div>
	</main>
</template>
```

- [ ] **Step 3: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 4: Commit**

```bash
git add app/components/Admin/Sidebar.vue app/layouts/dashboardLayout.vue
git commit -m "feat(admin): add sidebar to dashboard layout"
```

---

## Task 6: Admin API client

**Files:**
- Create: `app/services/dto/admin.dto.ts`
- Create: `app/services/admin.ts`
- Modify: `app/services/apiClient.ts`

- [ ] **Step 1: Write `admin.dto.ts`**

```ts
export interface AdminStats {
	orders: number
	products: number
	users: number
	ingredients: number
	revenue: number
}

export interface AdminCategory { id: number; name: string }

export interface AdminIngredient { id: number; name: string; price: number; imgURL: string }

export interface AdminOrder {
	id: number
	fullName: string
	email: string
	phone: string
	address: string
	totalAmount: number
	status: 'PENDING' | 'SUCCEEDED' | 'CANCELLED'
	createdAt: string
}

export interface AdminProductItem { id?: number; price: number; size: number | null; pizzaType: number | null }

export interface AdminProduct {
	id: number
	name: string
	imgURL: string
	categoryId: number
	category?: { name: string }
	items: AdminProductItem[]
	ingredients: { id: number; name: string }[]
}

export interface AdminUser {
	id: number
	fullName: string
	email: string
	role: 'USER' | 'ADMIN'
	verified: string | null
	createdAt: string
}
```

- [ ] **Step 2: Write `admin.ts`**

```ts
import { axiosInstance } from './instance'
import type {
	AdminStats, AdminCategory, AdminIngredient, AdminOrder, AdminProduct, AdminUser,
} from './dto/admin.dto'

const get = async <T>(url: string) => (await axiosInstance.get<T>(url)).data

export const stats = () => get<AdminStats>('/admin/stats')

export const categories = {
	list: () => get<AdminCategory[]>('/admin/categories'),
	create: (body: { name: string }) => axiosInstance.post('/admin/categories', body).then(r => r.data),
	update: (id: number, body: { name: string }) => axiosInstance.patch(`/admin/categories/${id}`, body).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/categories/${id}`).then(r => r.data),
}

export const ingredients = {
	list: () => get<AdminIngredient[]>('/admin/ingredients'),
	create: (body: Omit<AdminIngredient, 'id'>) => axiosInstance.post('/admin/ingredients', body).then(r => r.data),
	update: (id: number, body: Omit<AdminIngredient, 'id'>) => axiosInstance.patch(`/admin/ingredients/${id}`, body).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/ingredients/${id}`).then(r => r.data),
}

export const orders = {
	list: () => get<AdminOrder[]>('/admin/orders'),
	setStatus: (id: number, status: AdminOrder['status']) => axiosInstance.patch(`/admin/orders/${id}`, { status }).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/orders/${id}`).then(r => r.data),
}

export interface ProductPayload {
	name: string
	imgURL: string
	categoryId: number
	ingredientIds: number[]
	items: { price: number; size: number | null; pizzaType: number | null }[]
}

export const products = {
	list: () => get<AdminProduct[]>('/admin/products'),
	create: (body: ProductPayload) => axiosInstance.post('/admin/products', body).then(r => r.data),
	update: (id: number, body: ProductPayload) => axiosInstance.patch(`/admin/products/${id}`, body).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/products/${id}`).then(r => r.data),
}

export const users = {
	list: () => get<AdminUser[]>('/admin/users'),
	setRole: (id: number, role: AdminUser['role']) => axiosInstance.patch(`/admin/users/${id}`, { role }).then(r => r.data),
	remove: (id: number) => axiosInstance.delete(`/admin/users/${id}`).then(r => r.data),
}
```

- [ ] **Step 3: Register in `apiClient.ts`**

Add `import * as admin from './admin'` at the top and add `admin` to the exported `Api` object.

```ts
import * as cart from './cart'
import * as ingredients from './ingredients'
import * as products from './products'
import * as auth from './auth'
import * as stories from './stories'
import * as admin from './admin'

export const Api = {
	products, ingredients, cart, auth, stories, admin
}
```

- [ ] **Step 4: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 5: Commit**

```bash
git add app/services/admin.ts app/services/dto/admin.dto.ts app/services/apiClient.ts
git commit -m "feat(admin): add admin API client"
```

---

## Task 7: Overview page

**Files:**
- Modify: `app/pages/(dashboard)/dashboard/index.vue`

- [ ] **Step 1: Write the page**

```vue
<script lang="ts" setup>
import { Api } from '~/services/apiClient'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data } = await useAsyncData('admin-stats', () => Api.admin.stats())

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
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 3: Commit**

```bash
git add "app/pages/(dashboard)/dashboard/index.vue"
git commit -m "feat(admin): add dashboard overview page"
```

---

## Task 8: Categories CRUD API

**Files:**
- Create: `server/api/admin/categories/index.get.ts`
- Create: `server/api/admin/categories/index.post.ts`
- Create: `server/api/admin/categories/[id]/index.patch.ts`
- Create: `server/api/admin/categories/[id]/index.delete.ts`

- [ ] **Step 1: List**

`server/api/admin/categories/index.get.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.category.findMany({ orderBy: { id: 'asc' } })
})
```

- [ ] **Step 2: Create**

`server/api/admin/categories/index.post.ts`:

```ts
import prisma from '~/lib/prisma'
import { categoryInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const data = await readAdminBody(event, categoryInput)
	return prisma.category.create({ data })
})
```

Note: `~/server/utils/...` — server utils are auto-imported, but importing the named schemas explicitly keeps types. If auto-import resolves them, the import line can be dropped; keep it for clarity.

- [ ] **Step 3: Update**

`server/api/admin/categories/[id]/index.patch.ts`:

```ts
import prisma from '~/lib/prisma'
import { categoryInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const data = await readAdminBody(event, categoryInput)
	return prisma.category.update({ where: { id }, data })
})
```

- [ ] **Step 4: Delete**

`server/api/admin/categories/[id]/index.delete.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	try {
		await prisma.category.delete({ where: { id } })
		return { ok: true }
	} catch {
		throw createError({ statusCode: 409, message: 'Нельзя удалить: есть связанные продукты' })
	}
})
```

- [ ] **Step 5: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 6: Commit**

```bash
git add server/api/admin/categories
git commit -m "feat(admin): categories CRUD API"
```

---

## Task 9: Categories page

**Files:**
- Create: `app/pages/(dashboard)/dashboard/categories/index.vue`

- [ ] **Step 1: Write the page**

```vue
<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminCategory } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-categories', () => Api.admin.categories.list())
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
					class="rounded-xl border border-gray-200 px-4 py-2 outline-none"
				/>
				<Button type="submit" :disabled="!name">Сохранить</Button>
			</form>
		</AdminModal>
	</div>
</template>
```

- [ ] **Step 2: Verify build**

Run: `bun run build`
Expected: `✨ Build complete!`

- [ ] **Step 3: Commit**

```bash
git add "app/pages/(dashboard)/dashboard/categories/index.vue"
git commit -m "feat(admin): categories page"
```

---

## Task 10: Ingredients CRUD API

**Files:**
- Create: `server/api/admin/ingredients/index.get.ts`
- Create: `server/api/admin/ingredients/index.post.ts`
- Create: `server/api/admin/ingredients/[id]/index.patch.ts`
- Create: `server/api/admin/ingredients/[id]/index.delete.ts`

- [ ] **Step 1: List**

`server/api/admin/ingredients/index.get.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.ingredient.findMany({ orderBy: { id: 'asc' } })
})
```

- [ ] **Step 2: Create**

`server/api/admin/ingredients/index.post.ts`:

```ts
import prisma from '~/lib/prisma'
import { ingredientInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const data = await readAdminBody(event, ingredientInput)
	return prisma.ingredient.create({ data })
})
```

- [ ] **Step 3: Update**

`server/api/admin/ingredients/[id]/index.patch.ts`:

```ts
import prisma from '~/lib/prisma'
import { ingredientInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const data = await readAdminBody(event, ingredientInput)
	return prisma.ingredient.update({ where: { id }, data })
})
```

- [ ] **Step 4: Delete**

`server/api/admin/ingredients/[id]/index.delete.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	try {
		await prisma.ingredient.delete({ where: { id } })
		return { ok: true }
	} catch {
		throw createError({ statusCode: 409, message: 'Нельзя удалить: ингредиент используется' })
	}
})
```

- [ ] **Step 5: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add server/api/admin/ingredients
git commit -m "feat(admin): ingredients CRUD API"
```

---

## Task 11: Ingredients page

**Files:**
- Create: `app/pages/(dashboard)/dashboard/ingredients/index.vue`

- [ ] **Step 1: Write the page**

```vue
<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminIngredient } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-ingredients', () => Api.admin.ingredients.list())
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
				<input v-model.trim="form.name" placeholder="Название" class="rounded-xl border border-gray-200 px-4 py-2 outline-none" />
				<input v-model.number="form.price" type="number" min="0" placeholder="Цена" class="rounded-xl border border-gray-200 px-4 py-2 outline-none" />
				<input v-model.trim="form.imgURL" placeholder="URL картинки" class="rounded-xl border border-gray-200 px-4 py-2 outline-none" />
				<Button type="submit" :disabled="!form.name || !form.imgURL">Сохранить</Button>
			</form>
		</AdminModal>
	</div>
</template>
```

- [ ] **Step 2: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add "app/pages/(dashboard)/dashboard/ingredients/index.vue"
git commit -m "feat(admin): ingredients page"
```

---

## Task 12: Orders CRUD API

**Files:**
- Create: `server/api/admin/orders/index.get.ts`
- Create: `server/api/admin/orders/[id]/index.patch.ts`
- Create: `server/api/admin/orders/[id]/index.delete.ts`

- [ ] **Step 1: List**

`server/api/admin/orders/index.get.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.order.findMany({ orderBy: { createdAt: 'desc' } })
})
```

- [ ] **Step 2: Update status**

`server/api/admin/orders/[id]/index.patch.ts`:

```ts
import prisma from '~/lib/prisma'
import { orderStatusInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const { status } = await readAdminBody(event, orderStatusInput)
	return prisma.order.update({ where: { id }, data: { status } })
})
```

- [ ] **Step 3: Delete**

`server/api/admin/orders/[id]/index.delete.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	await prisma.order.delete({ where: { id } })
	return { ok: true }
})
```

- [ ] **Step 4: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add server/api/admin/orders
git commit -m "feat(admin): orders API (list, status, delete)"
```

---

## Task 13: Orders page

**Files:**
- Create: `app/pages/(dashboard)/dashboard/orders/index.vue`

- [ ] **Step 1: Write the page**

```vue
<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminOrder } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-orders', () => Api.admin.orders.list())
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
```

- [ ] **Step 2: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add "app/pages/(dashboard)/dashboard/orders/index.vue"
git commit -m "feat(admin): orders page"
```

---

## Task 14: Products CRUD API

**Files:**
- Create: `server/api/admin/products/index.get.ts`
- Create: `server/api/admin/products/index.post.ts`
- Create: `server/api/admin/products/[id]/index.patch.ts`
- Create: `server/api/admin/products/[id]/index.delete.ts`

- [ ] **Step 1: List**

`server/api/admin/products/index.get.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.product.findMany({
		orderBy: { id: 'asc' },
		include: {
			category: { select: { name: true } },
			items: true,
			ingredients: { select: { id: true, name: true } },
		},
	})
})
```

- [ ] **Step 2: Create (nested items + ingredients)**

`server/api/admin/products/index.post.ts`:

```ts
import prisma from '~/lib/prisma'
import { productInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const data = await readAdminBody(event, productInput)

	return prisma.product.create({
		data: {
			name: data.name,
			imgURL: data.imgURL,
			categoryId: data.categoryId,
			ingredients: { connect: data.ingredientIds.map((id) => ({ id })) },
			items: {
				create: data.items.map((i) => ({
					price: i.price,
					size: i.size ?? null,
					pizzaType: i.pizzaType ?? null,
				})),
			},
		},
		include: { items: true, ingredients: true },
	})
})
```

- [ ] **Step 3: Update (replace items, reset ingredients)**

`server/api/admin/products/[id]/index.patch.ts`:

```ts
import prisma from '~/lib/prisma'
import { productInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const data = await readAdminBody(event, productInput)

	return prisma.$transaction(async (tx) => {
		await tx.productItem.deleteMany({ where: { productId: id } })
		return tx.product.update({
			where: { id },
			data: {
				name: data.name,
				imgURL: data.imgURL,
				categoryId: data.categoryId,
				ingredients: { set: data.ingredientIds.map((iid) => ({ id: iid })) },
				items: {
					create: data.items.map((i) => ({
						price: i.price,
						size: i.size ?? null,
						pizzaType: i.pizzaType ?? null,
					})),
				},
			},
			include: { items: true, ingredients: true },
		})
	})
})
```

Note: deleting `ProductItem` rows that are referenced by `CartItem` will fail (FK). That is acceptable for an admin tool — the 500/409 surfaces; a hardening pass could guard active carts, out of scope here.

- [ ] **Step 4: Delete**

`server/api/admin/products/[id]/index.delete.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	const id = Number(event.context.params?.id)
	try {
		await prisma.$transaction([
			prisma.productItem.deleteMany({ where: { productId: id } }),
			prisma.product.delete({ where: { id } }),
		])
		return { ok: true }
	} catch {
		throw createError({ statusCode: 409, message: 'Нельзя удалить: продукт используется в корзинах' })
	}
})
```

- [ ] **Step 5: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add server/api/admin/products
git commit -m "feat(admin): products CRUD API"
```

---

## Task 15: Products page

**Files:**
- Create: `app/pages/(dashboard)/dashboard/products/index.vue`

- [ ] **Step 1: Write the page**

```vue
<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminProduct } from '~/services/dto/admin.dto'
import type { ProductPayload } from '~/services/admin'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const [{ data: productsData, refresh, pending }, { data: cats }, { data: ings }] = await Promise.all([
	useAsyncData('admin-products', () => Api.admin.products.list()),
	useAsyncData('admin-products-cats', () => Api.admin.categories.list()),
	useAsyncData('admin-products-ings', () => Api.admin.ingredients.list()),
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
					<div v-for="(item, idx) in form.items" :key="idx" class="mb-2 flex items-center gap-2">
						<input v-model.number="item.price" type="number" min="0" placeholder="Цена" class="w-24 rounded-lg border border-gray-200 px-2 py-1" />
						<input v-model.number="item.size" type="number" placeholder="Размер" class="w-24 rounded-lg border border-gray-200 px-2 py-1" />
						<input v-model.number="item.pizzaType" type="number" placeholder="Тип" class="w-24 rounded-lg border border-gray-200 px-2 py-1" />
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
```

- [ ] **Step 2: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add "app/pages/(dashboard)/dashboard/products/index.vue"
git commit -m "feat(admin): products page"
```

---

## Task 16: Users CRUD API

**Files:**
- Create: `server/api/admin/users/index.get.ts`
- Create: `server/api/admin/users/[id]/index.patch.ts`
- Create: `server/api/admin/users/[id]/index.delete.ts`

- [ ] **Step 1: List (no password)**

`server/api/admin/users/index.get.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	await requireAdmin(event)
	return prisma.user.findMany({
		orderBy: { id: 'asc' },
		select: { id: true, fullName: true, email: true, role: true, verified: true, createdAt: true },
	})
})
```

- [ ] **Step 2: Update role (block self-demotion)**

`server/api/admin/users/[id]/index.patch.ts`:

```ts
import prisma from '~/lib/prisma'
import { userRoleInput, readAdminBody } from '~/server/utils/admin-schemas'

export default defineEventHandler(async (event) => {
	const admin = await requireAdmin(event)
	const id = Number(event.context.params?.id)
	const { role } = await readAdminBody(event, userRoleInput)

	if (Number(admin.id) === id && role !== 'ADMIN') {
		throw createError({ statusCode: 400, message: 'Нельзя снять с себя роль ADMIN' })
	}

	return prisma.user.update({
		where: { id },
		data: { role },
		select: { id: true, fullName: true, email: true, role: true, verified: true, createdAt: true },
	})
})
```

- [ ] **Step 3: Delete (block self-delete)**

`server/api/admin/users/[id]/index.delete.ts`:

```ts
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
	const admin = await requireAdmin(event)
	const id = Number(event.context.params?.id)

	if (Number(admin.id) === id) {
		throw createError({ statusCode: 400, message: 'Нельзя удалить свой аккаунт' })
	}

	try {
		await prisma.user.delete({ where: { id } })
		return { ok: true }
	} catch {
		throw createError({ statusCode: 409, message: 'Нельзя удалить: есть связанные данные' })
	}
})
```

- [ ] **Step 4: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add server/api/admin/users
git commit -m "feat(admin): users API (list, role, delete)"
```

---

## Task 17: Users page

**Files:**
- Create: `app/pages/(dashboard)/dashboard/users/index.vue`

- [ ] **Step 1: Write the page**

```vue
<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { AdminUser } from '~/services/dto/admin.dto'

definePageMeta({ middleware: 'dashboard', layout: 'dashboard-layout' })

const { data, refresh, pending } = await useAsyncData('admin-users', () => Api.admin.users.list())
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
```

- [ ] **Step 2: Verify build + commit**

Run: `bun run build` → `✨ Build complete!`

```bash
git add "app/pages/(dashboard)/dashboard/users/index.vue"
git commit -m "feat(admin): users page"
```

---

## Task 18: End-to-end smoke check

- [ ] **Step 1: Seed + admin user**

Ensure DB seeded (`bun prisma:seed`) and one user is ADMIN:

```sql
UPDATE "User" SET role='ADMIN' WHERE email='<your-email>';
```

- [ ] **Step 2: Run dev and walk the panel**

Run: `bun dev`, log in as the admin, visit `/dashboard`.
Verify each page loads, create/edit/delete works on every entity, order/user dropdowns persist, and a non-admin (or logged-out) user is redirected to `/not-auth`.

- [ ] **Step 3: Final build**

Run: `bun run build`
Expected: `✨ Build complete!`

---

## Self-review notes (resolved)

- **Spec coverage:** Orders (list/status/delete), Products (full CRUD + nested items/ingredients), Categories (CRUD), Ingredients (CRUD), Users (list/role/delete), overview stats, sidebar, admin guard — all have tasks.
- **Guard:** every admin handler calls `requireAdmin(event)` first.
- **Type consistency:** `ProductPayload` (services/admin.ts) matches `productInput` (admin-schemas.ts) field names: `name`, `imgURL`, `categoryId`, `ingredientIds`, `items[{price,size,pizzaType}]`. DTO `AdminProduct.ingredients` is `{id,name}[]`; the page maps to `ingredientIds`.
- **Users:** no admin-create (registration handles it); self-demotion and self-delete are blocked.
- **Known limitation (documented):** deleting a `ProductItem`/`Ingredient`/`Category` still referenced by FK returns 409; not auto-cascaded by design.
