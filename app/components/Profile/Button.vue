<script lang="ts" setup>
defineEmits(['onClickSignIn'])
const { loggedIn } = useUserSession()
</script>

<template>
	<Button
		v-if="!loggedIn"
		@click="$emit('onClickSignIn')"
		variant="outline"
		class="flex items-center gap-1"
	>
		<Icon name="lucide:user" size="18" />

		<span>Войти</span>
	</Button>

	<NuxtLink v-else to="/profile">
		<Button class="flex items-center gap-3" variant="secondary">
			<Icon name="lucide:circle-user-round" size="18" />

			<span>Профиль</span>
		</Button>
	</NuxtLink>
</template>
