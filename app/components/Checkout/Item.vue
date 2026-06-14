<script lang="ts" setup>
interface Props {
	id: number
	details: string
	imgURL: string
	name: string
	price: number
	quantity: number
	disabled?: boolean
	class?: string
}

defineProps<Props>()
defineEmits(['onClickCountButton', 'onClickRemove'])
</script>

<template>
	<div
		class="flex items-center justify-between space-x-10"
		:class="disabled ? 'opacity-50 pointer-events-none select-none' : ''"
	>
		<div class="flex items-center gap-3 flex-1">
			<CartItemDetailsImage :src="imgURL" />

			<CartItemDetailsInfo :details :name />
		</div>

		<CartItemDetailsPrice :price />

		<div class="flex items-center gap-5">
			<CountButton
				@onClick="(type:string) => $emit('onClickCountButton', id, quantity, type)"
				:quantity
				size="sm"
			/>

			<button type="button" class="group" @click="$emit('onClickRemove', id)">
				<Icon
					name="lucide:x"
					size="20"
					class="text-gray-400 cursor-pointer group-hover:text-gray-600"
				/>
			</button>
		</div>
	</div>
</template>
