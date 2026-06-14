<script lang="ts" setup>
import { Api } from '~/services/apiClient'
import type { IStory } from '~/services/stories'

const open = ref(false)
const stories = ref<IStory[]>([])
const selectedStory = ref<IStory>()

const onClickStory = (story: IStory) => {
	selectedStory.value = story

	if (story.items.length > 0) {
		open.value = true
	}
}

onMounted(async () => {
	async function fetchStories() {
		const data = await Api.stories.getStories()

		stories.value = data
	}

	await fetchStories()
})
</script>

<template>
	<div class="container flex items-center justify-between gap-2 my-10">
		<div
			v-if="stories.length === 0"
			v-for="i in 6"
			:key="i"
			class="w-[200px] h-[250px] bg-gray-200 rounded-xl animate-pulse"
		></div>

		<img
			v-else
			v-for="story in stories.slice(0, 6)"
			:key="story.id"
			:src="story.previewImgURL"
			@click="() => (onClickStory(story), (open = true))"
			class="rounded-xl cursor-pointer"
			width="200"
			height="250"
		/>

		<div
			v-if="open"
			class="absolute left-0 top-0 w-full h-full bg-black/80 flex items-center justify-center z-30"
			@click="open = false"
		>
			<div class="relative" style="width: 520px">
				<button class="absolute -right-10 -top-5 z-30" @click="open = false">
					<Icon
						name="lucide:x"
						class="absolute top-0 right-0 w-8 h-8 text-white/50"
					/>
				</button>
			</div>
		</div>
	</div>
</template>
