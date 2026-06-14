import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, { message: "Введите корректный пароль" });

export const formLoginSchema = z.object({
  email: z.string().email({ message: "Введите корректную почту" }),
  password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema
  .merge(
    z.object({
      fullName: z.string().min(2, { message: "Введите имя и фамилию" }),
      confirmPassword: passwordSchema,
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

// Profile edit: name/email required, password optional (blank = keep current).
export const formProfileSchema = z
  .object({
    fullName: z.string().min(2, { message: "Введите имя и фамилию" }),
    email: z.string().email({ message: "Введите корректную почту" }),
    password: z
      .string()
      .min(6, { message: "Введите корректный пароль" })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export const regisFormSchema = toTypedSchema(formRegisterSchema);
export const loginFormSchema = toTypedSchema(formLoginSchema);
export const profileFormSchema = toTypedSchema(formProfileSchema);

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
export type TFormProfileValues = z.infer<typeof formProfileSchema>;
