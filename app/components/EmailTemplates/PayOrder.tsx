import { defineComponent, h } from 'vue'

export default defineComponent({
	name: 'payOrder',
	props: {
		orderId: {
			type: Number,
		},
		totalAmount: {
			type: Number,
		},
		paymentURL: {
			type: String,
		},
	},
	setup(props) {
		return () => (
			<div>
				<h1>Заказ #{props.orderId}</h1>
				<p>
					Оплатите заказ на сумму {props.totalAmount} &#8381;. Перейдите
					<a href={props.paymentURL}> по этой ссылке</a> для оплаты заказа.
				</p>
			</div>
		)
	},
})
