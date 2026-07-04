<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import type { MonthCell } from '~/utils/date'
import type { ScheduleRecord } from '~/types/data'
import { yiqTextColor } from '~/utils/status'

const props = defineProps<{
  cell: MonthCell
  record?: ScheduleRecord
  /** Legend label for the record's duty_type, e.g. "On Duty" */
  dutyLabel?: string
  isToday: boolean
}>()

const emit = defineEmits<{ select: [record: ScheduleRecord, event: Event] }>()

const complete = computed(() =>
  props.record ? props.record.count_logbooks === props.record.count_schedules : false,
)

const chipStyle = computed(() =>
  props.record
    ? { backgroundColor: props.record.base_color, color: yiqTextColor(props.record.base_color) }
    : undefined,
)

const ariaLabel = computed(() => {
  if (!props.record) return undefined
  const r = props.record
  const flights = (n: number) => `${n} flight${n === 1 ? '' : 's'}`
  const counts = complete.value
    ? `all ${flights(r.count_schedules)} logged`
    : `${flights(r.count_schedules)} scheduled, ${r.count_logbooks} logged`
  return `${formatDayMonth(props.cell.iso)}, ${props.dutyLabel} ${r.base_name}, ${counts}`
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
    :aria-label="ariaLabel"
    @click="record && cell.inMonth && emit('select', record, $event)"
  >
    <span class="day-cell__number" aria-hidden="true">{{ cell.day }}</span>

    <template v-if="record && cell.inMonth">
      <span v-if="complete" class="day-cell__tick" aria-hidden="true">
        <Check :size="11" :stroke-width="2.5" />
      </span>
      <span v-else class="day-cell__count" aria-hidden="true">{{ record.count_schedules }}</span>
      <span class="day-cell__chip" :style="chipStyle" aria-hidden="true">{{ record.base_name }}</span>
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
    color: #C3C9D4;
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
    @include type('micro');
    font-weight: 700;
    text-align: center;
    border-radius: var(--radius-xs);
  }
}
</style>
