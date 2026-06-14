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
	<aside class="w-full lg:w-56 lg:shrink-0">
		<nav class="flex flex-row overflow-x-auto lg:flex-col gap-1 pb-2 lg:pb-0">
			<NuxtLink
				v-for="link in links"
				:key="link.to"
				:to="link.to"
				class="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-white"
				active-class="bg-white text-primary shadow-sm"
				exact-active-class="bg-white text-primary shadow-sm"
			>
				<Icon :name="link.icon" size="18" />
				{{ link.label }}
			</NuxtLink>
		</nav>
	</aside>
</template>
