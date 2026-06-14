<script lang="ts" setup>
import { regisFormSchema, type TFormRegisterValues } from "./schema";

const { handleSubmit } = useForm({
    validationSchema: regisFormSchema,
    initialValues: {
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    },
});

const emit = defineEmits(["closeModal"]);

const onSubmit = handleSubmit(async (data: TFormRegisterValues) => {
    try {
        const toast = (await import("vue3-toastify")).toast;

        await $fetch("/api/user", {
            method: "POST",
            body: {
                email: data.email,
                fullName: data.fullName,
                password: data.password,
            },
        });

        toast.success("Регистрация прошла успешна 📝. Подтвердите свою почту", {
            icon: "✅",
            position: "top-center",
            pauseOnHover: false,
            bodyClassName: "font-nunito",
        });

        emit("closeModal");
    } catch (e) {
        const toast = (await import("vue3-toastify")).toast;

        console.error("Error [REGISTRATION]", e);

        toast.error("Неверный E-Mail или пароль", {
            icon: "❌",
            position: "top-center",
            pauseOnHover: false,
            bodyClassName: "font-nunito",
        });
    }
});
</script>

<template>
    <form class="flex flex-col gap-5" @submit="onSubmit">
        <FormInput name="email" label="E-Mail" type="email" required />
        <FormInput name="fullName" label="Полное имя" type="text" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <FormInput
            name="confirmPassword"
            label="Подтвердите пароль"
            type="password"
            required
        />

        <Button variant="default" class="h-12 text-base" type="submit">
            Зарегистрироваться
        </Button>
    </form>
</template>
