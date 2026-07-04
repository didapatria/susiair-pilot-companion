<script setup lang="ts">
import { utilisationTone } from '~/utils/status'

const props = withDefaults(defineProps<{
  /** Raw utilisation ratio; the arc caps at 100%, the label shows the rounded % */
  ratio: number
  size?: number
}>(), { size: 44 })

const STROKE = 5

const radius = computed(() => (props.size - STROKE) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const offset = computed(() => circumference.value * (1 - Math.min(props.ratio, 1)))
const tone = computed(() => utilisationTone(props.ratio))
const percent = computed(() => Math.round(props.ratio * 100))
</script>

<template>
  <svg
    class="progress-ring"
    :class="`progress-ring--${tone}`"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    aria-hidden="true"
  >
    <circle
      class="progress-ring__track"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="STROKE"
    />
    <circle
      class="progress-ring__value"
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="STROKE"
      :stroke-dasharray="circumference"
      :stroke-dashoffset="offset"
      :transform="`rotate(-90 ${size / 2} ${size / 2})`"
    />
    <text
      class="progress-ring__label"
      :x="size / 2"
      :y="size / 2"
      text-anchor="middle"
      dominant-baseline="central"
    >{{ percent }}%</text>
  </svg>
</template>

<style lang="scss" scoped>
.progress-ring {
  circle {
    fill: none;
  }

  &__track {
    stroke: #EEF1F5;
  }

  &__value {
    stroke-linecap: round;
    transition: stroke-dashoffset var(--motion-draw) cubic-bezier(0.2, 0, 0, 1);
  }

  &--success &__value {
    stroke: var(--color-success);
  }

  &--warning &__value {
    stroke: var(--color-warning);
  }

  &--danger &__value {
    stroke: var(--color-danger);
  }

  &__label {
    font-size: 10px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    fill: var(--color-primary);
  }
}
</style>
