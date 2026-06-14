<script lang="ts" setup>
useSeoMeta({
	title: 'Nuxt Pizza | Корзина',
	description: 'Nuxt Pizza | Корзина',
})
</script>

<template>
	<main class="flex flex-col w-full min-h-screen bg-[#f4f1ee]">
		<Header
			:hasSearch="true"
			:hasCart="true"
			class="border-b-gray-200 container"
		/>

		<div class="grow h-auto container mt-5">
			<slot />
		</div>
	</main>
</template>
