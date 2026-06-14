import type { H3Event } from 'h3'
import { z } from 'zod'

export const categoryInput = z.object({
	name: z.string().min(1, { error: 'Название обязательно' }),
})

export const ingredientInput = z.object({
	name: z.string().min(1, { error: 'Название обязательно' }),
	price: z.number().int().nonnegative({ error: 'Цена должна быть ≥ 0' }),
	imgURL: z.url({ error: 'Некорректный URL' }),
})

export const productItemInput = z.object({
	price: z.number().int().nonnegative(),
	size: z.number().int().nullable().optional(),
	pizzaType: z.number().int().nullable().optional(),
})

export const productInput = z.object({
	name: z.string().min(1, { error: 'Название обязательно' }),
	imgURL: z.url({ error: 'Некорректный URL' }),
	categoryId: z.number().int().positive({ error: 'Выберите категорию' }),
	ingredientIds: z.array(z.number().int().positive()).default([]),
	items: z.array(productItemInput).min(1, { error: 'Нужен минимум один вариант' }),
})

export const orderStatusInput = z.object({
	status: z.enum(['PENDING', 'SUCCEEDED', 'CANCELLED']),
})

/** Parse a request body or throw 400 with the first Zod message. */
export async function readAdminBody<T>(event: H3Event, schema: z.ZodType<T>): Promise<T> {
	const body = await readBody(event)
	const parsed = schema.safeParse(body)
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			message: parsed.error.issues[0]?.message ?? 'Некорректные данные',
		})
	}
	return parsed.data
}
