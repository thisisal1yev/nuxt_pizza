<script lang="ts" setup>
useSeoMeta({
	title: 'Nuxt Pizza | Профиль',
	description: 'Nuxt Pizza | Профиль',
})
</script>

<template>
	<main class="flex flex-col w-full min-h-screen bg-[#f4f1ee] dark:bg-background">
		<Header
			:hasSearch="true"
			:hasCart="true"
			class="border-b-border container"
		/>

		<div class="grow h-auto container my-10">
			<slot />
		</div>
	</main>
</template>
