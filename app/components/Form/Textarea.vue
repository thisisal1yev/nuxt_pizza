<script lang="ts" setup>
import Textarea from '../Textarea.vue'

interface Props {
	name: string
	rows?: number
	label?: string
	required?: boolean
	placeholder?: string
}
const props = defineProps<Props>()

const { value, errorMessage, setValue, handleChange, handleBlur } =
	useField<string>(props.name)

const errorText = computed(() => errorMessage.value)

const onClickClear = () => {
	setValue('', true)
}
</script>

<template>
	<div>
		<p class="font-medium mb-2">
			{{ label }} <RequiredSymbol v-if="required" />
		</p>

		<div class="relative">
			<Textarea
				:name
				:rows
				:value
				:placeholder
				v-model="value"
				@onInput="handleChange"
				@blur="handleBlur"
				class="h-12 text-base border-2 transition-colors duration-300 focus:border-primary"
			/>

			<ClearButton class="z-50" v-if="value" @onClick="onClickClear" />
		</div>

		<ErrorText v-if="errorText" :text="errorText" class="mt-2" />
	</div>
</template>
