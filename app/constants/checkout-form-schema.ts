import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

const schema = z.object({
	firstName: z.string().min(2, { error: 'Имя должно содержать не менее 2-х символов' }),
	lastName: z.string().min(2, { error: 'Фамилия должна содержать не менее 2-х символов' }),
	email: z.email({ error: 'Введите корректную почту' }),
	phone: z.string().min(10, { error: 'Введите корректный номер телефона' }),
	address: z.string().min(5, { error: 'Введите корректный адрес' }),
	comment: z.string().optional(),
})

export const checkoutFormSchema = toTypedSchema(schema)

export type CheckoutFormValues = z.infer<typeof schema>
