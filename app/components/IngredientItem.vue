<script setup lang="ts">
interface Props {
	imgURL: string
	name: string
	price: number
	active?: boolean
}

defineProps<Props>()
</script>

<template>
	<div
		:class="[
			'flex items-center flex-col p-1 rounded-xl w-32 text-center relative cursor-pointer shadow-md bg-white',
			{ 'border border-primary': active },
		]"
	>
		<template v-if="active">
			<Icon
				name="lucide:circle-check"
				size="24"
				class="absolute top-2 right-2 text-primary!"
			/>
		</template>
		<img :width="110" :height="110" :src="imgURL" />
		<span class="text-xs mb-1">{{ name }}</span>
		<span class="font-bold">{{ price }} &#8381;</span>
	</div>
</template>
