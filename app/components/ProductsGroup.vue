<script lang="ts" setup>
import type { ProductWithRelations } from './Product/Form.vue'

interface Props {
	title: string
	categoryId: number
	products: ProductWithRelations[]
}

const { categoryId } = defineProps<Props>()
const target = ref<HTMLElement | null>(null)
const store = useCategoryStore()
const cartStore = useCartStore()

const intersection = useIntersectionObserver(
	target,
	(
		entry: IntersectionObserverEntry[],
		observer: IntersectionObserver
	): void => {
		if (entry[0].isIntersecting) {
			watchEffect(() => {
				if (intersection?.isActive) {
					store.setActiveId(categoryId)
				}
			})
		}
	},
	{
		rootMargin: '0px',
		threshold: 0.4,
	}
)

const onSubmit = async (
	product: ProductWithRelations,
	productItemId?: number,
	ingredients?: number[]
) => {
	const firstItem = product.items[0]

	try {
		const itemId = productItemId ?? firstItem.id
		const toast = (await import('vue3-toastify')).toast

		await cartStore.addCartItem({
			productItemId: itemId,
			ingredients,
		})

		toast.success(`${product.name} добавлена в корзину`, {
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	} catch (e) {
		console.error(e)
		const toast = (await import('vue3-toastify')).toast

		toast.error('Не удалось добавить товар в корзину', {
			position: 'top-center',
			pauseOnHover: false,
			bodyClassName: 'font-nunito',
		})
	}
}
</script>

<template>
	<section ref="target" :id="title">
		<h2 class="font-extrabold mb-5">{{ title }}</h2>

		<div class="grid grid-cols-3 gap-[50px]">
			<ProductCard
				v-for="product in products"
				:key="product.id"
				:id="product.id"
				:name="product.name"
				:imgURL="product.imgURL"
				:price="product.items[0].price"
				:loading="cartStore.loading"
				:ingredients="product.ingredients"
				@addOnCart="onSubmit(product)"
			/>
		</div>
	</section>
</template>
