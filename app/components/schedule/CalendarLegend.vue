<script setup lang="ts">
defineProps<{
  /** Optional duty counts for the displayed month, keyed by legend code */
  counts?: Map<string, number>
}>()

const store = useScheduleStore()
const { legend } = storeToRefs(store)
</script>

<template>
  <AppCard class="calendar-legend">
    <h2 class="calendar-legend__title">Legend</h2>
    <ul class="calendar-legend__items">
      <li v-for="item in legend" :key="item.code" class="calendar-legend__item">
        <span class="calendar-legend__dot" :style="{ backgroundColor: item.color }" aria-hidden="true" />
        <span class="calendar-legend__label">{{ item.label }}</span>
        <span class="calendar-legend__code">{{ item.code }}</span>
        <span v-if="counts?.get(item.code)" class="calendar-legend__count">×{{ counts.get(item.code) }}</span>
      </li>
    </ul>
  </AppCard>
</template>

<style lang="scss" scoped>
.calendar-legend {
  &__title {
    @include type('label');
    font-weight: 600;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-3);
  }

  &__items {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2) var(--space-3);
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    min-width: 0;
  }

  &__dot {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    border-radius: var(--radius-full);
  }

  &__label {
    @include type('body-sm');
    color: var(--color-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__code {
    @include type('micro');
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  &__count {
    @include type('micro');
    @include numeric;
    font-weight: 700;
    color: var(--color-primary);
  }
}
</style>
