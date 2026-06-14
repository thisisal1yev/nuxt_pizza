<template>
	<section class="py-5 space-y-10">
		<Skeleton class="w-1/3 h-12" />

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-[50px]">
			<SkeletonCard v-for="i in 6" :key="i" />
		</div>
	</section>
</template>
