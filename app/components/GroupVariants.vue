<script lang="ts" setup>
export type Variant = {
	name: string
	value: string
	disabled?: boolean
}

interface Props {
	items: readonly Variant[]
	value?: Variant['value']
}

defineProps<Props>()
defineEmits(['onClick'])
</script>

<template>
	<div class="flex justify-between bg-[#f3f3f7] rounded-3xl p-1 select-none">
		<button
			v-for="item in items"
			:key="item.name"
			@click="$emit('onClick', item.value)"
			:class="[
				'flex items-center justify-center cursor-pointer h-[30px] px-5 flex-1 rounded-3xl transition-all duration-400 text-sm',
				{
					'bg-white shadow-sm': item.value === value,
					'text-gray-500 opacity-50 pointer-events-none': item.disabled,
				},
			]"
		>
			{{ item.name }}
		</button>
	</div>
</template>
