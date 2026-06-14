import type { Story, StoryItem } from '@prisma/client'
import { axiosInstance } from './instance'

export type IStory = Story & {
	items: StoryItem[]
}

export const getStories = async () => {
	const { data } = await axiosInstance.get<IStory[]>('/stories')

	return data
}