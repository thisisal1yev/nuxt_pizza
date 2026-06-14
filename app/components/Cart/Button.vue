<script lang="ts" setup>
const isVisible = ref<boolean>(false)
const cartStore = useCartStore()

function toggle() {
	isVisible.value = !isVisible.value
}
</script>

<template>
	<Teleport to="body">
		<CartDrawer :isVisible @close="toggle" />
	</Teleport>

	<Button
		:disabled="cartStore.loading"
		@click="isVisible = !isVisible"
		variant="default"
		size="default"
		class="relative group w-[105px]"
	>
		<b v-if="!cartStore.loading">{{ cartStore.totalAmount }} &#8381;</b>

		<div v-else class="flex items-center space-x-2">
			<span
				class="animate-pulse inline-block h-3 bg-primary-foreground rounded-sm w-5"
			></span>

			<span>&#8381;</span>
		</div>
		<span class="h-full w-[1px] bg-white/30 mx-3"></span>

		<div
			class="flex items-center gap-1 transition duration-300 group-hover:opacity-0"
		>
			<Icon name="lucide:shopping-basket" class="relative" />

			<b v-if="!cartStore.loading">{{ cartStore.items.length }}</b>

			<span
				v-else
				class="animate-pulse h-3 inline-block bg-primary-foreground rounded-sm w-2"
			></span>
		</div>

		<Icon
			name="lucide:arrow-right"
			size="20"
			class="absolute right-5 transition duration-300 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
		/>
	</Button>
</template>
