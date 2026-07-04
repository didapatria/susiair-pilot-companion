import { createRollingEngine } from '~/utils/rollingHours'

export function useRollingHours() {
  const store = useFlightHoursStore()
  // One engine per loaded file; rebuilds only when data flips null → loaded.
  const engine = computed(() => (store.data ? createRollingEngine(store.data) : null))
  const cards = computed(() => engine.value?.cards() ?? null)
  return { status: toRef(store, 'status'), engine, cards }
}
