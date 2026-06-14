<script lang="ts" setup>
import Input from '../Input.vue'

interface Props {
	name: string
	label?: string
	required?: boolean
	type?: string
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
		<p v-if="label" class="font-medium mb-2">
			{{ label }}
			<RequiredSymbol v-if="required" />
		</p>

		<div class="relative">
			<Input
				:name
				:type
				:value
				:required
				:placeholder="label"
				v-model="value"
				@input="handleChange"
				@blur="handleBlur"
				:class="
					'text-base border-2 outline-hidden transition-all duration-300 focus:border-primary h-12 text-md' +
					(errorText ? ' border-red-500 focus:border-red-500' : '')
				"
			/>

			<ClearButton v-if="value" @onClick="onClickClear" />
		</div>

		<ErrorText v-if="errorText" :text="errorText" class="mt-2" />
	</div>
</template>
