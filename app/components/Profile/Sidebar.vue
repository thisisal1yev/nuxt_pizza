<script lang="ts" setup>
const activeCls = 'bg-card text-primary shadow-sm'

const links = [
	{ to: '/profile', label: 'Личные данные', icon: 'lucide:user', exact: true },
	{ to: '/profile/orders', label: 'Мои заказы', icon: 'lucide:receipt' },
]
</script>

<template>
	<aside class="w-full lg:w-56 lg:shrink-0">
		<nav class="flex flex-row overflow-x-auto lg:flex-col gap-1 pb-2 lg:pb-0">
			<NuxtLink
				v-for="link in links"
				:key="link.to"
				:to="link.to"
				class="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-card"
				:active-class="link.exact ? '' : activeCls"
				:exact-active-class="activeCls"
			>
				<Icon :name="link.icon" size="18" />
				{{ link.label }}
			</NuxtLink>
		</nav>
	</aside>
</template>
