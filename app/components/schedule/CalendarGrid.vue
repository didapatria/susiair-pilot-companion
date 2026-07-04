<script setup lang="ts">
import { WEEKDAYS_MON_FIRST, monthGrid } from '~/utils/date'
import type { ScheduleRecord } from '~/types/data'

const props = defineProps<{ year: number, month: number }>()
const emit = defineEmits<{
  select: [record: ScheduleRecord, event: Event]
  step: [delta: 1 | -1]
}>()

const store = useScheduleStore()

const cells = computed(() => monthGrid(props.year, props.month))
const rows = computed(() =>
  Array.from({ length: 6 }, (_, r) => cells.value.slice(r * 7, r * 7 + 7)),
)

function dutyLabel(record: ScheduleRecord): string {
  return store.legendByCode.get(record.duty_type)?.label ?? record.duty_type
}

// Roving tabindex: exactly one in-month cell is tabbable; arrows move day-wise,
// PageUp/Down change month keeping the same day-of-month where it exists.
const gridEl = ref<HTMLElement | null>(null)
const activeIso = ref('')
let pendingDay: number | null = null

function isoOfDay(day: number): string {
  return `${props.year}-${String(props.month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

watch(() => [props.year, props.month], () => {
  const inMonth = cells.value.filter(c => c.inMonth)
  if (pendingDay !== null) {
    const day = Math.min(pendingDay, inMonth.length)
    pendingDay = null
    activeIso.value = isoOfDay(day)
    nextTick(() => focusActive())
    return
  }
  activeIso.value = (inMonth.find(c => c.iso === APP_TODAY) ?? inMonth[0]!).iso
}, { immediate: true })

function focusActive() {
  gridEl.value?.querySelector<HTMLElement>(`[data-iso="${activeIso.value}"]`)?.focus()
}

function moveTo(target?: { iso: string, inMonth: boolean }) {
  if (!target?.inMonth) return
  activeIso.value = target.iso
  nextTick(() => focusActive())
}

function onFocusin(event: FocusEvent) {
  const iso = (event.target as HTMLElement).dataset?.iso
  if (iso) activeIso.value = iso
}

function onKeydown(event: KeyboardEvent) {
  const idx = cells.value.findIndex(c => c.iso === activeIso.value)
  if (idx === -1) return
  const row = cells.value.slice(Math.floor(idx / 7) * 7, Math.floor(idx / 7) * 7 + 7)

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      moveTo(cells.value[idx - 1])
      break
    case 'ArrowRight':
      event.preventDefault()
      moveTo(cells.value[idx + 1])
      break
    case 'ArrowUp':
      event.preventDefault()
      moveTo(cells.value[idx - 7])
      break
    case 'ArrowDown':
      event.preventDefault()
      moveTo(cells.value[idx + 7])
      break
    case 'Home':
      event.preventDefault()
      moveTo(row.find(c => c.inMonth))
      break
    case 'End':
      event.preventDefault()
      moveTo([...row].reverse().find(c => c.inMonth))
      break
    case 'PageUp':
      event.preventDefault()
      pendingDay = Number(activeIso.value.slice(8, 10))
      emit('step', -1)
      break
    case 'PageDown':
      event.preventDefault()
      pendingDay = Number(activeIso.value.slice(8, 10))
      emit('step', 1)
      break
  }
}
</script>

<template>
  <AppCard class="calendar-grid">
    <div class="calendar-grid__weekdays" aria-hidden="true">
      <span v-for="day in WEEKDAYS_MON_FIRST" :key="day">{{ day }}</span>
    </div>
    <div
      ref="gridEl"
      class="calendar-grid__cells"
      role="grid"
      :aria-label="`Duty days, ${formatMonthYear(year, month)}`"
      @keydown="onKeydown"
      @focusin="onFocusin"
    >
      <div v-for="(gridRow, r) in rows" :key="r" class="calendar-grid__row" role="row">
        <CalendarDayCell
          v-for="cell in gridRow"
          :key="cell.iso"
          :cell="cell"
          :record="store.byDate.get(cell.iso)"
          :duty-label="store.byDate.get(cell.iso) ? dutyLabel(store.byDate.get(cell.iso)!) : undefined"
          :is-today="cell.iso === APP_TODAY"
          :tabbable="cell.iso === activeIso"
          @select="(record, event) => emit('select', record, event)"
        />
      </div>
    </div>
  </AppCard>
</template>

<style lang="scss" scoped>
.calendar-grid {
  padding: var(--space-3);

  &__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: var(--space-2);

    span {
      @include type('label');
      font-weight: 600;
      color: var(--color-text-secondary);
      text-align: center;

      // Weekend headers read slightly stronger
      &:nth-child(n+6) {
        color: var(--color-text);
      }
    }
  }

  &__cells {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;

    // Subtle weekend column tint (Sat/Sun in a Monday-start grid)
    > :nth-child(6),
    > :nth-child(7) {
      background: rgba(14, 33, 56, 0.03);
    }
  }
}
</style>
