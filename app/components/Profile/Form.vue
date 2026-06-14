<script lang="ts" setup>
import type { User } from '@prisma/client'
import { profileFormSchema, type TFormProfileValues } from '../Form/schema'

const { user } = defineProps<{ user: User }>()
const { clear } = useUserSession()
const { handleSubmit, isSubmitting } = useForm({
	validationSchema: profileFormSchema,
	initialValues: {
		fullName: user.fullName,
		email: user.email,
		password: '',
		confirmPassword: '',
	},
})

const onSubmit = handleSubmit(async (data: TFormProfileValues) => {
	try {
		const toast = (await import('vue3-toastify')).toast

		await $fetch('/api/user', {
			method: 'PATCH',
			body: data,
		})

		toast.success('Данные обновлены 📝', {
			icon: '✅',
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	} catch (e) {
		const toast = (await import('vue3-toastify')).toast

		console.log(e)

		toast.error('Не удалось обновить данные', {
			icon: '❌',
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	}
})

const signOut = () => {
	clear()

	setTimeout(() => {
		location.href = '/'
	}, 500)
}
</script>

<template>
	<div class="max-w-96 mx-auto md:mx-0">
		<h3 class="font-bold">{{ `Личные данные | #${user.id}` }}</h3>

		<form class="flex flex-col gap-5 w-full mt-10" @submit="onSubmit">
		<FormInput name="email" label="E-Mail" required />
		<FormInput name="fullName" label="Полное имя" required />

		<FormInput type="password" name="password" label="Новый пароль" />
		<FormInput
			type="password"
			name="confirmPassword"
			label="Повторите пароль"
		/>

		<Button :disabled="isSubmitting" class="text-base mt-10" type="submit">
			Сохранить
		</Button>

		<Button
			@click="signOut"
			variant="secondary"
			:disabled="isSubmitting"
			class="text-base"
			type="button"
		>
			Выйти из аккаунта
		</Button>
		</form>
	</div>
</template>
