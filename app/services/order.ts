import { axiosInstance } from './instance'
import type { UserOrder } from './dto/order.dto'

const get = async <T>(url: string) => (await axiosInstance.get<T>(url)).data

export const mine = () => get<UserOrder[]>('/order')
