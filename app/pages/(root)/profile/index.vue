<script lang="ts" setup>
definePageMeta({
	middleware: 'auth',
	layout: 'profile-layout',
})

const { user } = useUserSession()
</script>

<template>
	<ProfileForm :user />
</template>
