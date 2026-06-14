<script lang="ts" setup>
interface Props {
	value: number
	checked?: boolean
	name?: string
}

defineProps<Props>()
defineEmits(['onCheckedChange'])
</script>

<template>
	<div class="flex items-center space-x-4">
		<label
			class="gap-2 flex items-center"
			:for="`checkbox-${String(name)}-${String(value)}`"
		>
			<div class="inline-flex items-center relative rounded-lg bg-slate-200">
				<Input
					:checked="checked ?? false"
					@change="() => $emit('onCheckedChange', checked || Boolean(value))"
					:value="String(value)"
					:id="`checkbox-${String(name)}-${String(value)}`"
					type="checkbox"
					class="peer h-6 w-6 cursor-pointer transition-all appearance-none rounded-lg !border-none checked:bg-primary outline-hidden"
				/>

				<span
					class="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
				>
					<Icon name="lucide:check" size="12" />
				</span>
			</div>
			<span class="cursor-pointer flex-1 leading-none select-none">
				<slot />
			</span>
		</label>
	</div>
</template>
