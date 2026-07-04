<script setup lang="ts">
import type { BoundsKey } from '~/types/data'

const store = useFlightHoursStore()
const { engine, cards } = useRollingHours()

const selected = ref<BoundsKey>('1w')
const toggles = computed<BoundsKey[]>(() =>
  store.chartBounds ? (Object.keys(store.chartBounds) as BoundsKey[]) : [],
)
const series = computed(() => engine.value?.series(selected.value) ?? null)
const ready = computed(() => store.status === 'ready')
</script>

<template>
  <section aria-labelledby="hours-title">
    <h2 id="hours-title" class="section-title hours__title">Hours to limit</h2>

    <template v-if="ready && cards && series">
      <div class="hours__grid appear">
        <LimitCard v-for="card in cards" :key="card.key" :card="card" />
      </div>

      <AppCard class="hours__chart appear">
        <div class="hours__chart-head">
          <h3 class="hours__chart-title">Flight hours</h3>
          <p class="hours__chart-sub">rolling {{ series.bounds.windowDays }} days</p>
        </div>
        <TrendChart :series="series" />
        <RangeToggle v-model="selected" :options="toggles" />
      </AppCard>
    </template>

    <template v-else>
      <div class="hours__grid" aria-hidden="true">
        <SkeletonBlock v-for="i in 4" :key="i" height="84px" radius="var(--radius-lg)" />
      </div>
      <AppCard class="hours__chart" aria-hidden="true">
        <SkeletonBlock width="140px" height="18px" />
        <SkeletonBlock height="200px" />
        <SkeletonBlock height="44px" radius="var(--radius-pill)" />
      </AppCard>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.hours {
  &__title {
    margin-bottom: var(--space-3);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-3);
    margin-bottom: var(--space-3);

    @media (min-width: 640px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__chart {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    padding: var(--space-5);
  }

  &__chart-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  &__chart-title {
    @include type('title');
    color: var(--color-primary);
  }

  &__chart-sub {
    @include type('label');
    @include numeric;
    color: var(--color-text-secondary);
  }
}
</style>
