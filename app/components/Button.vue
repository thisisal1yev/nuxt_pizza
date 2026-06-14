<script lang="ts" setup>
type Variant =
	| 'outline'
	| 'default'
	| 'ghost'
	| 'destructive'
	| 'secondary'
	| 'link'
type Size = 'default' | 'sm' | 'lg' | 'icon'

interface Props {
	variant?: Variant
	size?: Size
	disabled?: boolean
	isIcon?: boolean
}

const { size, variant } = defineProps<Props>()

const buttonClass = computed<string>(() => {
	switch (variant) {
		case 'outline':
			return 'border border-primary text-primary bg-transparent hover:bg-primary hover:text-white'
		case 'ghost':
			return 'hover:bg-secondary hover:text-secondary-foreground'
		case 'destructive':
			return 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
		case 'link':
			return 'text-primary underline-offset-4 hover:underline'
		case 'secondary':
			return 'bg-secondary text-primary hover:bg-secondary/50'
		default:
			return 'bg-primary text-primary-foreground hover:bg-primary/90'
	}
})

const sizeClass = computed<string>(() => {
	switch (size) {
		case 'sm':
			return 'h-9 rounded-md px-3'
		case 'lg':
			return 'h-11 rounded-md px-8'
		case 'icon':
			return 'h-10 w-10'
		default:
			return 'h-10 px-4 py-2'
	}
})
</script>

<template>
	<button
		:disabled
		:class="[buttonClass, sizeClass]"
		type="button"
		class="inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:bg-gray-500 active:opacity-50 hover:opacity-50"
	>
		<svg
			v-if="!isIcon && disabled"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 200 200"
			width="20"
			height="20"
		>
			<radialGradient
				id="a12"
				cx=".66"
				fx=".66"
				cy=".3125"
				fy=".3125"
				gradientTransform="scale(1.5)"
			>
				<stop offset="0" stop-color="#F9FAFB"></stop>
				<stop offset=".3" stop-color="#F9FAFB" stop-opacity=".9"></stop>
				<stop offset=".6" stop-color="#F9FAFB" stop-opacity=".6"></stop>
				<stop offset=".8" stop-color="#F9FAFB" stop-opacity=".3"></stop>
				<stop offset="1" stop-color="#F9FAFB" stop-opacity="0"></stop>
			</radialGradient>
			<circle
				transform-origin="center"
				fill="none"
				stroke="url(#a12)"
				stroke-width="15"
				stroke-linecap="round"
				stroke-dasharray="200 1000"
				stroke-dashoffset="0"
				cx="100"
				cy="100"
				r="70"
			>
				<animateTransform
					type="rotate"
					attributeName="transform"
					calcMode="spline"
					dur="2"
					values="360;0"
					keyTimes="0;1"
					keySplines="0 0 1 1"
					repeatCount="indefinite"
				></animateTransform>
			</circle>
			<circle
				transform-origin="center"
				fill="none"
				opacity=".2"
				stroke="#F9FAFB"
				stroke-width="15"
				stroke-linecap="round"
				cx="100"
				cy="100"
				r="70"
			></circle>
		</svg>
		<slot v-else />
	</button>
</template>
