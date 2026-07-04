<script setup lang="ts">
import type { LimitCardData } from '~/utils/rollingHours'

const props = defineProps<{ card: LimitCardData }>()

const LABELS: Record<LimitCardData['key'], { title: string, window: string }> = {
  daily: { title: 'Daily', window: 'today' },
  weekly: { title: 'Weekly', window: 'rolling 7 days' },
  monthly: { title: 'Monthly', window: 'rolling 30 days' },
  annual: { title: 'Annual', window: 'rolling 365 days' },
}

const meta = computed(() => LABELS[props.card.key])
const remaining = computed(() => props.card.limit - props.card.hours)
const over = computed(() => remaining.value < 0)
</script>

<template>
  <AppCard class="limit-card">
    <div class="limit-card__info">
      <p class="limit-card__label">{{ meta.title }}</p>
      <p class="limit-card__hours"><CountUp :value="card.hours" :format="formatHours" /></p>
      <p class="limit-card__limit">of {{ card.limit }} h</p>
      <p class="limit-card__footer" :class="{ 'limit-card__footer--over': over }">
        {{ over ? `${formatHours(-remaining)} h over` : `${formatHours(remaining)} h left` }}
      </p>
    </div>
    <ProgressRing class="limit-card__ring" :ratio="card.utilisation" />
    <span class="visually-hidden">{{ meta.title }} hours, {{ meta.window }}: {{ formatHours(card.hours) }} of {{ card.limit }} hour limit</span>
  </AppCard>
</template>

<style lang="scss" scoped>
.limit-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);

  &__info {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    min-width: 0;
  }

  &__label {
    @include type('label');
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  &__hours {
    @include type('metric');
    @include numeric;
    color: var(--color-primary);
    white-space: nowrap;
  }

  &__limit {
    @include type('label');
    @include numeric;
    color: var(--color-text-secondary);
    white-space: nowrap;
  }

  &__footer {
    @include type('micro');
    @include numeric;
    color: var(--color-text-secondary);

    &--over {
      color: var(--color-danger-ink);
      font-weight: 700;
    }
  }

  &__ring {
    flex-shrink: 0;
  }
}
</style>
