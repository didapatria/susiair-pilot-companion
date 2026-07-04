import flightHoursJson from '~/assets/data/mock-flight-hours.json'
import type { FlightHoursFile } from '~/types/data'

export const useFlightHoursStore = defineStore('flightHours', () => {
  const data = ref<FlightHoursFile | null>(null)
  const status = ref<'idle' | 'loading' | 'ready'>('idle')

  async function load() {
    if (status.value !== 'idle') return
    status.value = 'loading'
    await delay(400) // simulated latency so loading states are demonstrable
    data.value = flightHoursJson as FlightHoursFile
    status.value = 'ready'
  }

  const pilot = computed(() => data.value?.pilot ?? null)
  const chartBounds = computed(() => data.value?.chartBounds ?? null)

  return { data, status, load, pilot, chartBounds }
})
