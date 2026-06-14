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
		class="flex w-full bg-white gap-6 py-3 px-5"
		:class="disabled ? 'opacity-50 pointer-events-none select-none' : ''"
	>
		<CartItemDetailsImage :src="imgURL" />

		<div class="flex-1">
			<CartItemDetailsInfo :details :name />

			<hr class="my-3" />

			<div class="flex items-center justify-between">
				<CountButton
					@onClick="(type:string) => $emit('onClickCountButton', id, quantity, type)"
					:quantity
					size="sm"
				/>

				<div class="flex items-center gap-3">
					<CartItemDetailsPrice :price />

					<button type="button" @click="$emit('onClickRemove', id, name)">
						<Icon
							name="lucide:trash-2"
							class="text-gray-400 cursor-pointer hover:text-gray-600"
						/>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
