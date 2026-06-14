<script lang="ts" setup>
interface Props {
	imgURL: string
	size: number
	name: string
}

const { size } = defineProps<Props>()

const computedImageClass = computed(() => {
	return [
		'relative left-2 top-2 transition-all z-10 duration-300',
		{
			'w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] lg:w-[300px] lg:h-[300px]': size === 20,
			'w-[230px] h-[230px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px]': size === 30,
			'w-[260px] h-[260px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px]': size === 40,
		},
	]
})
</script>

<template>
	<div class="flex items-center justify-center flex-1 relative w-full">
		<img :src="imgURL" :alt="name" :class="computedImageClass" />

		<div
			class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dashed border-2 rounded-full border-border w-[240px] h-[240px] sm:w-[330px] sm:h-[330px] lg:w-[450px] lg:h-[450px] max-w-full"
		/>
		<div
			class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-dotted border-2 rounded-full border-border w-[200px] h-[200px] sm:w-[270px] sm:h-[270px] lg:w-[370px] lg:h-[370px] max-w-full"
		/>
	</div>
</template>
