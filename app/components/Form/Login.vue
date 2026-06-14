<script lang="ts" setup>
import type { User } from '@prisma/client'
import { loginFormSchema } from './schema'

const { handleSubmit, isSubmitting } = useForm({
	validationSchema: loginFormSchema,
	initialValues: {
		email: '',
		password: '',
	},
})

const onSubmit = handleSubmit(async data => {
	try {
		const toast = (await import('vue3-toastify')).toast

		const resp = await $fetch<{ user: User }>('/api/auth', {
			method: 'POST',
			body: data,
		})

		if (!resp.user) {
			return toast.error('Не удалось войти в аккаунт', {
				icon: '❌',
				position: 'top-center',
				pauseOnHover: false,
				bodyClassName: 'font-nunito',
			})
		}

		toast.success('Вы успешно вошли в аккаунт', {
			icon: '✅',
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})

		setTimeout(() => {
			location.href = '/'
		}, 500)
	} catch (e) {
		const toast = (await import('vue3-toastify')).toast

		console.error('Error [LOGIN]', e)

		toast.error('Не удалось войти в аккаунт', {
			icon: '❌',
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	}
})
</script>

<template>
	<form class="flex flex-col gap-5" @submit="onSubmit">
		<div class="flex justify-between items-center">
			<div class="mr-2 space-y-1">
				<h3 class="font-bold">Вход в аккаунт</h3>

				<p class="text-gray-400">
					Введите свою почту, чтобы войти в свой аккаунт
				</p>
			</div>

			<img
				src="/assets/images/phone-icon.png"
				alt="phone-icon"
				width="60"
				height="60"
			/>
		</div>

		<FormInput name="email" label="E-Mail" type="email" required />
		<FormInput name="password" label="Пароль" type="password" required />

		<Button :disabled="isSubmitting" class="h-12 text-base" type="submit">
			{{ isSubmitting ? 'Вход...' : 'Войти' }}
		</Button>
	</form>
</template>
