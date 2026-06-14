import { Resend } from 'resend'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'

import payOrder from '~/components/EmailTemplates/PayOrder'
import verificationUser from '~/components/EmailTemplates/verificationUser'

interface Props {
	orderId?: number
	totalAmount?: number
	paymentURL?: string
	code?: string
	link?: string
}

export const sendEmail = async (
	to: string,
	subject: string,
	props: Props,
	isVerification: boolean
) => {
	const resend = new Resend(process.env.RESEND_API_KEY)

	const app = createSSRApp({
		render: () => h(isVerification ? verificationUser : payOrder, props),
	})

	const html = await renderToString(app)

	const text = isVerification
		? `Your verification code is: ${props.code}`
		: `Your order (ID: ${props.orderId}) has been paid. Total amount: ${props.totalAmount}`

	const { data, error } = await resend.emails.send({
		from: 'onboarding@resend.dev',
		to,
		subject,
		text,
		html,
	})

	if (error) {
		console.error('Email sending failed:', error)
		throw new Error('Email sending failed')
	}

	return data
}