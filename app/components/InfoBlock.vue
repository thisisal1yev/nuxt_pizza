<script lang="ts" setup>
interface Props {
	title: string
	text: string
	class?: string
	imageUrl?: string
}

defineProps<Props>()
</script>

<template>
	<div class="flex flex-col lg:flex-row items-center justify-between w-full max-w-[840px] px-4 gap-6" :class>
		<div class="flex flex-col">
			<div class="w-full lg:w-[445px] space-y-5">
				<h2 class="font-extrabold">{{ title }}</h2>

				<p class="text-gray-400 text-lg">{{ text }}</p>
			</div>

			<div class="flex gap-5 mt-11">
				<NuxtLink href="/">
					<Button variant="outline" class="gap-2">
						<Icon name="lucide:arrow-left" />

						На главную
					</Button>
				</NuxtLink>

				<a href="">
					<Button
						variant="outline"
						class="text-gray-500! border-gray-400! hover:bg-gray-50!"
					>
						Обновить
					</Button>
				</a>
			</div>
		</div>

		<img :src="imageUrl" :alt="title" width="300" height="500" />
	</div>
</template>
