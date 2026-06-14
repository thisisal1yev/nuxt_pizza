import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
	const stories = await prisma.story.findMany({
		include: {
			items: true
		}
	})

	return stories
})