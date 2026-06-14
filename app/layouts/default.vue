<script lang="ts" setup>
useSeoMeta({
	title: 'Nuxt Pizza - вкусней уже некуда',
	description: 'Nuxt Pizza - вкусней уже некуда',
})
</script>

<template>
	<Header />

	<main class="flex flex-col w-full min-h-screen mt-10">
		<div class="grow h-auto">
			<slot />
		</div>
	</main>
</template>
