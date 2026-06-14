<script lang="ts" setup>
useSeoMeta({
	title: 'Nuxt Pizza | Панель управления',
	description: 'Nuxt Pizza | Панель управления',
})
</script>

<template>
	<main class="flex flex-col w-full min-h-screen bg-[#f4f1ee] dark:bg-background">
		<Header
			:hasSearch="true"
			:hasCart="true"
			class="border-b-border container"
		/>

		<div class="grow h-auto container my-6 lg:my-10 flex flex-col lg:flex-row gap-4 lg:gap-8">
			<AdminSidebar />
			<div class="grow">
				<slot />
			</div>
		</div>
	</main>
</template>
