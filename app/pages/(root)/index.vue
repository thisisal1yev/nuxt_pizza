<script lang="ts" setup>
import type { Category } from "@prisma/client";
import type { ProductWithRelations } from "~/components/Product/Form.vue";

export interface CategoryProps extends Category {
    products: ProductWithRelations[];
}

const route = useRoute();

const {
    data: categories,
    refresh,
    status,
} = useAsyncData<CategoryProps[]>("filteredPizzas", () =>
    $fetch<CategoryProps[]>("/api/filteredPizzas", { query: route.query }),
);

watch(
    () => route.query,
    () => {
        refresh();
    },
    { deep: true },
);

const showFilters = ref(false);
</script>

<template>
    <div class="container">
        <h3 class="font-extrabold">Все пиццы</h3>
    </div>

    <TopBar
        v-if="categories"
        :categories="
            categories.filter((category) => category.products.length > 0)
        "
    />

    <div class="container mt-10 pb-14">
        <button
            type="button"
            class="lg:hidden mb-6 flex items-center gap-2 rounded-2xl bg-gray-50 dark:bg-white/5 pr-5 py-3 font-bold"
            @click="showFilters = !showFilters"
        >
            <Icon name="lucide:sliders-horizontal" size="18" />
            Фильтры

            <Icon
                :name="
                    showFilters ? 'lucide:chevron-up' : 'lucide:chevron-down'
                "
                size="16"
            />
        </button>

        <div class="flex flex-col lg:flex-row gap-8 lg:gap-20">
            <div
                :class="[
                    'w-full lg:w-62.5',
                    showFilters ? 'block' : 'hidden lg:block',
                ]"
            >
                <Filters />
            </div>

            <div class="flex-1">
                <div class="flex flex-col gap-16">
                    <SkeletonProductGroup
                        v-if="categories?.length === 0 && status === 'pending'"
                        v-for="i in 3"
                        :key="i"
                    />

                    <ProductsGroup
                        v-if="categories && categories.length > 0"
                        v-for="category in categories"
                        :categoryId="category.id"
                        :title="category.name"
                        :key="category.id"
                        :products="category.products"
                    />

                    <h3 v-else class="font-bold">Ничего не найдено</h3>
                </div>
            </div>
        </div>
    </div>
</template>
