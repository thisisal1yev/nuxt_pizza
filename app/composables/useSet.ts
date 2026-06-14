interface ReturnProps<T> {
	set: Set<T>
	toggle: (value: T) => void
	add: (value: T) => void
	remove: (value: T) => void
	has: (value: T) => void
	clear: (value: T) => void
}

export function useSet<T>(initialValues: T[] = []): ReturnProps<T> {
	const set = shallowReactive(new Set<T>(initialValues))
	const add = (value: T) => set.add(value)
	const remove = (value: T) => set.delete(value)
	const has = (value: T) => set.has(value)
	const toggle = (value: T) => {
		if (set.has(value)) {
			set.delete(value)
		} else {
			set.add(value)
		}
	}
	const clear = () => set.clear()

	return {
		set,
		toggle,
		add,
		remove,
		has,
		clear,
	}
}
