<script lang="ts" setup>
interface IRecept {
	text: string
	value: number
}

interface Props {
	title: string
	items?: IRecept[]
	limit?: number
	defaultValue?: IRecept[]
	loading?: boolean
	searchInputPlaceholder?: string
	selected?: Set<string>
	name?: string
}
defineEmits(['onClickCheckbox'])

const { items, defaultValue, limit } = defineProps<Props>()

const showAllIngredients = ref<boolean>(false)
const searchInput = ref<string>('')
const list = ref<IRecept[]>([])

watchEffect(() => {
	list.value = showAllIngredients.value
		? items?.filter(item =>
				item.text.toLowerCase().includes(searchInput.value.toLowerCase())
		  ) ?? []
		: (defaultValue || items)?.slice(0, limit) ?? []
})
</script>

<template>
	<div v-if="loading" class="py-2 mt-5 space-y-3">
		<p class="font-bold mb-3">{{ title }}</p>

		<SkeletonCheckbox v-for="i in limit" :key="i" />
	</div>
	<div v-else class="py-2 mt-5">
		<p class="font-bold mb-3">{{ title }}</p>

		<div
			v-if="
				showAllIngredients &&
				items &&
				limit !== undefined &&
				items?.length > limit
			"
			class="mb-3"
		>
			<input
				type="search"
				v-model.trim="searchInput"
				:placeholder="searchInputPlaceholder ?? 'Поиск...'"
				class="bg-gray-50 border-none px-5 py-3 w-full outline-hidden rounded-md"
			/>
		</div>

		<div class="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
			<FilterCheckbox
				v-if="list.length > 0"
				v-for="item in list"
				:key="item.text"
				:value="Number(item.value)"
				:checked="selected?.has(String(item?.value))"
				@onCheckedChange="() => $emit('onClickCheckbox', String(item?.value))"
				:name
			>
				{{ item.text }}
			</FilterCheckbox>
			<div v-else class="py-1">
				<p class="text-base">Ничего не найдено</p>
			</div>
		</div>

		<div
			v-if="items && limit !== undefined && items?.length > limit"
			:class="[showAllIngredients ? 'border-t border-t-neutral-100 mt-4' : '']"
		>
			<button
				@click="showAllIngredients = !showAllIngredients"
				class="text-primary mt-3"
			>
				{{ showAllIngredients ? 'Скрыть' : '+ Показать все' }}
			</button>
		</div>
	</div>
</template>
