<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{ year: number, month: number }>()
const emit = defineEmits<{ change: [year: number, month: number] }>()

function step(delta: 1 | -1) {
  let { year, month } = props
  month += delta
  if (month === 0) {
    month = 12
    year -= 1
  }
  else if (month === 13) {
    month = 1
    year += 1
  }
  emit('change', year, month)
}
</script>

<template>
  <AppCard class="calendar-month">
    <button
      class="calendar-month__nav"
      type="button"
      aria-label="Previous month"
      @click="step(-1)"
    >
      <ChevronLeft :size="22" :stroke-width="1.75" />
    </button>
    <h2 class="calendar-month__label" aria-live="polite">{{ formatMonthYear(year, month) }}</h2>
    <button
      class="calendar-month__nav"
      type="button"
      aria-label="Next month"
      @click="step(1)"
    >
      <ChevronRight :size="22" :stroke-width="1.75" />
    </button>
  </AppCard>
</template>

<style lang="scss" scoped>
.calendar-month {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);

  &__nav {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: var(--radius-full);
    color: var(--color-primary);
    @include pressable;
  }

  &__label {
    @include type('title');
    @include numeric;
    font-weight: 700;
    color: var(--color-primary);
  }
}
</style>
