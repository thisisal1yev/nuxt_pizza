<script lang="ts" setup>
import type { CountButtonProps } from './Button.vue'

interface IconButtonProps {
	size?: CountButtonProps['size']
	disabled?: boolean
	type?: 'plus' | 'minus'
}

defineProps<IconButtonProps>()
defineEmits(['onClick'])
</script>

<template>
	<Button
		variant="outline"
		type="button"
		size="icon"
		@click="$emit('onClick', type === 'minus' ? 'minus' : 'plus')"
		:disabled
		:isIcon="true"
		:class="[
			size === 'sm'
				? 'w-[30px] h-[30px] rounded-[10px]'
				: 'w-[38px] h-[38px] rounded-md',
		]"
		class="p-0 hover:bg-primary hover:text-white disabled:bg-white disabled:border-gray-400 disabled:text-gray-400"
	>
		<Icon
			v-if="type === 'minus'"
			name="lucide:minus"
			size="24"
			:class="[size === 'sm' ? 'h-4' : 'h-5']"
		/>

		<Icon
			v-else
			name="lucide:plus"
			size="24"
			:class="[size === 'sm' ? 'h-4' : 'h-5']"
		/>
	</Button>
</template>
