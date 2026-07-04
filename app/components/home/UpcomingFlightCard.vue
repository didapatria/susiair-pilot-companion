<script setup lang="ts">
import { Plane } from 'lucide-vue-next'
import { MONTH_SHORT } from '~/utils/date'

// One mock upcoming flight, per the brief ("Upcoming Flights card showing one mock flight").
const flight = {
  number: 'SI-105',
  date: '2026-06-01',
  std: '07:30',
  timezone: 'WIB',
  from: { code: 'HLP', city: 'Jakarta' },
  to: { code: 'CJN', city: 'Pangandaran' },
  aircraft: 'Cessna 208B Grand Caravan',
} as const

const day = flight.date.slice(8, 10)
const month = MONTH_SHORT[Number(flight.date.slice(5, 7)) - 1]!.toUpperCase()
</script>

<template>
  <AppCard class="flight-card">
    <p class="flight-card__eyebrow">Upcoming flight</p>

    <div class="flight-card__top">
      <div class="flight-card__date" aria-label="Departure date 1 June 2026">
        <span class="flight-card__date-day">{{ day }}</span>
        <span class="flight-card__date-month">{{ month }}</span>
      </div>
      <div class="flight-card__meta">
        <span class="flight-card__number">{{ flight.number }}</span>
        <p class="flight-card__std">
          {{ flight.std }}
          <span class="flight-card__tz">{{ flight.timezone }} · STD</span>
        </p>
      </div>
    </div>

    <div class="flight-card__route">
      <div class="flight-card__stop">
        <span class="flight-card__code">{{ flight.from.code }}</span>
        <span class="flight-card__city">{{ flight.from.city }}</span>
      </div>
      <div class="flight-card__path" aria-hidden="true">
        <Plane :size="16" :stroke-width="1.75" />
      </div>
      <div class="flight-card__stop flight-card__stop--end">
        <span class="flight-card__code">{{ flight.to.code }}</span>
        <span class="flight-card__city">{{ flight.to.city }}</span>
      </div>
    </div>

    <p class="flight-card__aircraft">{{ flight.aircraft }}</p>
  </AppCard>
</template>

<style lang="scss" scoped>
.flight-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  box-shadow: var(--shadow-raised);

  &__eyebrow {
    @include type('label');
    font-weight: 600;
    color: var(--color-text-secondary);
  }

  &__top {
    display: flex;
    align-items: center;
    gap: var(--space-4);
  }

  &__date {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: var(--color-navy-soft);
    border-radius: var(--radius-md);
  }

  &__date-day {
    @include type('title-lg');
    @include numeric;
    font-weight: 800;
    color: var(--color-primary);
  }

  &__date-month {
    @include type('micro');
    font-weight: 600;
    color: var(--color-text-secondary);
    letter-spacing: 0.06em;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  &__number {
    padding: 2px 10px;
    @include type('micro');
    @include numeric;
    font-weight: 700;
    color: var(--color-primary);
    background: var(--color-navy-soft);
    border-radius: var(--radius-full);
  }

  &__std {
    @include type('title-lg');
    @include numeric;
    font-weight: 800;
    color: var(--color-primary);
  }

  &__tz {
    @include type('label');
    font-weight: 500;
    color: var(--color-text-secondary);
  }

  &__route {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  &__stop {
    display: flex;
    flex-direction: column;

    &--end {
      align-items: flex-end;
      text-align: right;
    }
  }

  &__code {
    @include type('title');
    font-weight: 700;
    color: var(--color-primary);
  }

  &__city {
    @include type('body-sm');
    color: var(--color-text-secondary);
  }

  &__path {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--space-2);
    color: var(--color-primary);

    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-border);
    }
  }

  &__aircraft {
    @include type('body-sm');
    color: var(--color-text-secondary);
  }
}
</style>
