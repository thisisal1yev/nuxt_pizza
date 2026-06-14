<script lang="ts" setup>
defineProps<{ class?: string }>()
</script>

<template>
	<WhiteBlock title="2. Персональные данные" :class>
		<template #lower>
			<div class="grid grid-cols-2 gap-5 pt-2 pb-4">
				<FormInput name="firstName" type="text" label="Имя" required />
				<FormInput name="lastName" type="text" label="Фамилия" required />
				<FormInput name="email" type="email" label="E-Mail" required />
				<FormInput name="phone" type="tel" label="Телефон" required />
			</div>
		</template>
	</WhiteBlock>
</template>
