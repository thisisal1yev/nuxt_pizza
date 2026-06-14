<script lang="ts" setup>
useSeoMeta({
	title: 'Nuxt Pizza | Профиль',
	description: 'Nuxt Pizza | Профиль',
})
</script>

<template>
	<main class="flex flex-col w-full min-h-screen bg-[#f4f1ee]">
		<Header
			:hasSearch="true"
			:hasCart="true"
			class="border-b-gray-200 container"
		/>

		<div class="grow h-auto container my-10">
			<slot />
		</div>
	</main>
</template>
