<script lang="ts" setup generic="T extends { id: number }">
defineProps<{
	columns: { key: string; label: string }[]
	rows: T[]
	loading?: boolean
}>()
</script>

<template>
	<div class="overflow-x-auto rounded-xl bg-card shadow-sm">
		<table class="w-full text-left text-sm">
			<thead class="border-b border-border text-gray-500">
				<tr>
					<th v-for="c in columns" :key="c.key" class="px-3 py-2 lg:px-4 lg:py-3 font-medium">
						{{ c.label }}
					</th>
					<th class="px-3 py-2 lg:px-4 lg:py-3 font-medium text-right">Действия</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="loading">
					<td :colspan="columns.length + 1" class="px-4 py-6 text-center text-gray-400">
						Загрузка...
					</td>
				</tr>
				<tr v-else-if="rows.length === 0">
					<td :colspan="columns.length + 1" class="px-4 py-6 text-center text-gray-400">
						Нет данных
					</td>
				</tr>
				<tr
					v-for="row in rows"
					:key="row.id"
					class="border-b border-border last:border-0 hover:bg-gray-50 dark:hover:bg-white/10"
				>
					<td v-for="c in columns" :key="c.key" class="px-3 py-2 lg:px-4 lg:py-3">
						<slot :name="`cell-${c.key}`" :row="row">
							{{ (row as Record<string, unknown>)[c.key] }}
						</slot>
					</td>
					<td class="px-3 py-2 lg:px-4 lg:py-3 text-right">
						<slot name="actions" :row="row" />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
