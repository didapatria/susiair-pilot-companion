<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { MonthCell } from '~/utils/date'
import type { ScheduleRecord } from '~/types/data'
import { contrastInk } from '~/utils/status'

const props = defineProps<{
  cell: MonthCell
  record?: ScheduleRecord
  /** Legend label for the record's duty_type, e.g. "On Duty" */
  dutyLabel?: string
  isToday: boolean
  /** Roving-tabindex owner: the one in-month cell reachable with Tab */
  tabbable?: boolean
}>()

const emit = defineEmits<{ select: [record: ScheduleRecord, event: Event] }>()

const complete = computed(() =>
  props.record ? props.record.count_logbooks === props.record.count_schedules : false,
)

const chipStyle = computed(() =>
  props.record
    ? { backgroundColor: props.record.base_color, color: contrastInk(props.record.base_color) }
    : undefined,
)

// Screen-reader detail appended after the visible text (day, badge, chip), so the
// accessible name always contains the visible label (WCAG 2.5.3 / axe name-mismatch).
const srDetail = computed(() => {
  if (!props.record) return ''
  const r = props.record
  const flights = (n: number) => `${n} flight${n === 1 ? '' : 's'}`
  const counts = complete.value
    ? `all ${flights(r.count_schedules)} logged`
    : `${flights(r.count_schedules)} scheduled, ${r.count_logbooks} logged`
  return `, ${formatDayMonth(props.cell.iso)}, ${props.dutyLabel}, ${counts}`
})
</script>

<template>
  <component
    :is="record && cell.inMonth ? 'button' : 'div'"
    class="day-cell"
    :class="{
      'day-cell--out': !cell.inMonth,
      'day-cell--duty': record && cell.inMonth,
      'day-cell--today': isToday,
    }"
    :type="record && cell.inMonth ? 'button' : undefined"
    role="gridcell"
    :tabindex="cell.inMonth ? (tabbable ? 0 : -1) : undefined"
    :data-iso="cell.inMonth ? cell.iso : undefined"
    @click="record && cell.inMonth && emit('select', record, $event)"
  >
    <span class="day-cell__number">{{ cell.day }}</span>

    <template v-if="record && cell.inMonth">
      <span v-if="complete" class="day-cell__tick" aria-hidden="true">
        <Check :size="11" :stroke-width="2.5" />
      </span>
      <span v-else class="day-cell__count">{{ record.count_schedules }}</span>
      <span class="day-cell__chip" :style="chipStyle">{{ record.base_name }}</span>
      <span class="visually-hidden">{{ srDetail }}</span>
    </template>
  </component>
</template>

<style lang="scss" scoped>
.day-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 52px;
  padding: 4px;
  border-radius: var(--radius-md);
  text-align: left;

  @media (min-width: 640px) {
    min-height: 64px;
  }

  &--duty {
    @include pressable;
  }

  &--today {
    box-shadow: 0 0 0 2px var(--color-primary);

    .day-cell__number {
      font-weight: 700;
      color: var(--color-primary);
    }
  }

  &--out .day-cell__number {
    color: var(--color-text-secondary);
  }

  &__number {
    @include type('body-sm');
    @include numeric;
    color: var(--color-text);
    line-height: 1;
  }

  &__count {
    position: absolute;
    top: 2px;
    right: 2px;
    display: grid;
    place-items: center;
    min-width: 16px;
    height: 16px;
    padding-inline: 4px;
    @include type('micro');
    @include numeric;
    font-weight: 700;
    color: var(--color-text-inverse);
    background: var(--color-primary);
    border-radius: var(--radius-full);
  }

  &__tick {
    position: absolute;
    top: 2px;
    right: 2px;
    display: grid;
    place-items: center;
    width: 16px;
    height: 16px;
    color: var(--color-text-inverse);
    background: var(--color-success);
    border-radius: var(--radius-full);
  }

  &__chip {
    display: block;
    padding: 2px 0;
    font-size: 11px;
    line-height: 1.2;
    font-weight: 600;
    text-align: center;
    border-radius: var(--radius-xs);
  }
}
</style>
