<script lang="ts" setup>
interface Props {
	hasSearch?: boolean
	hasCart?: boolean
}

defineProps<Props>()

const isOpen = ref<boolean>(false)
const toggle = () => (isOpen.value = !isOpen.value)

const router = useRouter()
const route = useRoute()

const colorMode = useColorMode()
const toggleTheme = () => {
	colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

onMounted(async () => {
	const toast = (await import('vue3-toastify')).toast
	let toastMessage = ''

	if (route.query.paid) {
		toastMessage = 'Заказ успешно оплачен! Информация отправлена на почту.'
	}

	if (route.query.verified) {
		toastMessage = 'Почта успешно подтверждена!'
	}

	if (toastMessage) {
		setTimeout(() => {
			router.replace('/')
			toast.success(toastMessage, {
				position: 'top-center',
				pauseOnHover: false,
				bodyClassName: 'font-nunito',
				delay: 3000,
			})
		}, 1000)
	}
})
</script>

<template>
	<header class="py-10 border-b-2">
		<div class="container flex items-center justify-between gap-3 lg:gap-10">
			<NuxtLink class="inline-flex items-center justify-center gap-4" to="/">
				<img
					class="w-9 h-9"
					width="35"
					height="35"
					src="/logo.png"
					alt="logo"
				/>

				<div class="flex flex-col">
					<span class="uppercase font-black text-lg lg:text-2xl whitespace-nowrap">Nuxt pizza</span>

					<span class="text-sm leading-3 text-gray-400"
						>вкусней уже некуда</span
					>
				</div>
			</NuxtLink>

			<div v-if="!hasSearch" class="hidden lg:block lg:flex-1 lg:mx-10">
				<SearchInput />
			</div>

			<div class="flex items-center justify-center space-x-4">
				<Teleport to="body">
					<ModalAuth v-if="isOpen" @openOrCloseModal="toggle" />
				</Teleport>

				<ClientOnly>
					<button
						type="button"
						@click="toggleTheme"
						aria-label="Сменить тему"
						class="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
					>
						<Icon
							:name="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
							size="20"
						/>
					</button>
					<template #fallback>
						<div class="h-10 w-10" />
					</template>
				</ClientOnly>

				<ProfileButton @onClickSignIn="toggle" />

				<CartButton v-if="!hasCart" />
			</div>
		</div>
	</header>
</template>
