import schedulesJson from '~/assets/data/mock-schedules.json'
import type { ISODate, ScheduleRecord, SchedulesFile } from '~/types/data'

export const useScheduleStore = defineStore('schedule', () => {
  const data = ref<SchedulesFile | null>(null)
  const status = ref<'idle' | 'loading' | 'ready'>('idle')

  async function load() {
    if (status.value !== 'idle') return
    status.value = 'loading'
    await delay(400)
    data.value = schedulesJson as SchedulesFile
    status.value = 'ready'
  }

  const legend = computed(() => data.value?.legend ?? [])

  /** One record per duty_date (dataset invariant, unit-tested). Statuses render verbatim. */
  const byDate = computed(() => {
    const map = new Map<ISODate, ScheduleRecord>()
    for (const s of data.value?.schedules ?? []) map.set(s.duty_date, s)
    return map
  })

  const legendByCode = computed(() => new Map(legend.value.map(l => [l.code, l])))

  return { data, status, load, legend, byDate, legendByCode }
})
