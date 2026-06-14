<script lang="ts" setup>
interface Props {
	totalAmount: number
	loading?: boolean
}
const props = defineProps<Props>()

const VAT = ref<number>(15)
const DELIVERY_PRICE = ref<number>(250)

const vatPrice = ref<number>(0)
const totalPrice = ref<number>(0)

watchEffect(() => {
	vatPrice.value = (props.totalAmount * VAT.value) / 100
	totalPrice.value = props.totalAmount + DELIVERY_PRICE.value + vatPrice.value
})
</script>

<template>
	<WhiteBlock class="p-6 sticky top-4">
		<template #upper>
			<div class="flex flex-col gap-1">
				<span class="text-xl">Итого:</span>
				<Skeleton v-if="loading" class="h-11 w-48" />
				<span v-else class="text-4xl font-extrabold"
					>{{ totalPrice }} &#8381;</span
				>
			</div>
		</template>

		<template #lower>
			<CheckoutItemDetails
				title="Стоимость корзины:"
				:value="`${props.totalAmount} &#8381;`"
				:loading
			>
				<template #icon>
					<Icon name="lucide:package" size="18" class="mr-2 text-gray-300" />
				</template>
			</CheckoutItemDetails>

			<CheckoutItemDetails
				title="Налоги:"
				:value="`${vatPrice} &#8381;`"
				:loading
			>
				<template #icon>
					<Icon name="lucide:percent" size="18" class="mr-2 text-gray-300" />
				</template>
			</CheckoutItemDetails>

			<CheckoutItemDetails
				title="Доставка:"
				:value="`${DELIVERY_PRICE} &#8381;`"
				:loading
			>
				<template #icon>
					<Icon name="lucide:truck" size="18" class="mr-2 text-gray-300" />
				</template>
			</CheckoutItemDetails>

			<Button
				:disabled="loading"
				type="submit"
				class="w-full h-14 rounded-2xl mt-6 text-base font-bold"
			>
				Перейти к оплате

				<Icon name="lucide:arrow-right" size="18" class="ml-2" />
			</Button>
		</template>
	</WhiteBlock>
</template>
