<script setup lang="ts">
import type { ScheduleRecord } from '~/types/data'

const store = useScheduleStore()

useLazyAsyncData('schedule-data', async () => {
  await store.load()
  return true
}, { server: false })

const current = ref({
  year: Number(APP_TODAY.slice(0, 4)),
  month: Number(APP_TODAY.slice(5, 7)),
})

const selected = ref<ScheduleRecord | null>(null)
let lastFocus: HTMLElement | null = null

function openSheet(record: ScheduleRecord, event: Event) {
  lastFocus = event.currentTarget as HTMLElement
  selected.value = record
}

function closeSheet() {
  selected.value = null
  lastFocus?.focus()
  lastFocus = null
}

const selectedDutyLabel = computed(() =>
  selected.value
    ? store.legendByCode.get(selected.value.duty_type)?.label ?? selected.value.duty_type
    : '',
)

/** Duty counts within the displayed month, keyed by duty_type (legend "×n" suffixes). */
const monthCounts = computed(() => {
  const prefix = `${current.value.year}-${String(current.value.month).padStart(2, '0')}`
  const counts = new Map<string, number>()
  for (const [date, record] of store.byDate) {
    if (date.startsWith(prefix))
      counts.set(record.duty_type, (counts.get(record.duty_type) ?? 0) + 1)
  }
  return counts
})
</script>

<template>
  <div class="schedule page">
    <h1 class="page-title">Schedule</h1>

    <template v-if="store.status === 'ready'">
      <CalendarMonth
        class="appear"
        :year="current.year"
        :month="current.month"
        @change="(year, month) => current = { year, month }"
      />
      <section class="appear" aria-label="Duty calendar">
        <CalendarGrid
          :year="current.year"
          :month="current.month"
          @select="openSheet"
        />
      </section>
      <CalendarLegend class="appear" :counts="monthCounts" />
    </template>

    <template v-else>
      <AppCard class="schedule__skeleton" aria-hidden="true">
        <SkeletonBlock height="44px" />
        <SkeletonBlock height="320px" />
      </AppCard>
      <AppCard aria-hidden="true">
        <SkeletonBlock height="120px" />
      </AppCard>
    </template>

    <BottomSheet
      :open="selected !== null"
      :title="selected ? `Duty on ${formatFullDate(selected.duty_date)}` : 'Duty'"
      @close="closeSheet"
    >
      <template v-if="selected">
        <h2 class="schedule__sheet-title">{{ formatFullDate(selected.duty_date) }}</h2>
        <p>
          <StatusPill tone="neutral">{{ selectedDutyLabel }} · {{ selected.base_name }}</StatusPill>
        </p>
        <p class="schedule__sheet-body">Detail page coming soon.</p>
      </template>
    </BottomSheet>
  </div>
</template>

<style lang="scss" scoped>
.schedule {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  &__sheet-title {
    @include type('title');
    color: var(--color-primary);
  }

  &__sheet-body {
    @include type('body');
    color: var(--color-text-secondary);
  }
}
</style>
