<script setup lang="ts">
import { WEEKDAYS_MON_FIRST, monthGrid } from '~/utils/date'
import type { ScheduleRecord } from '~/types/data'

const props = defineProps<{ year: number, month: number }>()
const emit = defineEmits<{ select: [record: ScheduleRecord, event: Event] }>()

const store = useScheduleStore()

const cells = computed(() => monthGrid(props.year, props.month))

function dutyLabel(record: ScheduleRecord): string {
  return store.legendByCode.get(record.duty_type)?.label ?? record.duty_type
}
</script>

<template>
  <AppCard class="calendar-grid">
    <div class="calendar-grid__weekdays" aria-hidden="true">
      <span v-for="day in WEEKDAYS_MON_FIRST" :key="day">{{ day }}</span>
    </div>
    <div class="calendar-grid__cells">
      <CalendarDayCell
        v-for="cell in cells"
        :key="cell.iso"
        :cell="cell"
        :record="store.byDate.get(cell.iso)"
        :duty-label="store.byDate.get(cell.iso) ? dutyLabel(store.byDate.get(cell.iso)!) : undefined"
        :is-today="cell.iso === APP_TODAY"
        @select="(record, event) => emit('select', record, event)"
      />
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
    }
  }

  &__cells {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }
}
</style>
