<script setup lang="ts">
import type { BoundsKey } from '~/types/data'

const props = defineProps<{
  modelValue: BoundsKey
  options: BoundsKey[]
}>()

const emit = defineEmits<{ 'update:modelValue': [value: BoundsKey] }>()

function onKeydown(event: KeyboardEvent) {
  const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown'
    ? 1
    : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
  if (!delta) return
  event.preventDefault()
  const index = props.options.indexOf(props.modelValue)
  const next = props.options[(index + delta + props.options.length) % props.options.length]!
  emit('update:modelValue', next)
}
</script>

<template>
  <div
    class="range-toggle"
    role="radiogroup"
    aria-label="Chart range"
    :style="{ '--idx': options.indexOf(modelValue), '--count': options.length }"
    @keydown="onKeydown"
  >
    <span class="range-toggle__thumb" aria-hidden="true" />
    <button
      v-for="option in options"
      :key="option"
      class="range-toggle__segment"
      :class="{ 'range-toggle__segment--active': option === modelValue }"
      type="button"
      role="radio"
      :aria-checked="option === modelValue"
      :tabindex="option === modelValue ? 0 : -1"
      @click="emit('update:modelValue', option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<style lang="scss" scoped>
.range-toggle {
  position: relative;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  padding: var(--space-1);
  background: var(--color-navy-soft);
  border-radius: var(--radius-pill);

  // One sliding thumb instead of per-segment fills: selection reads as movement.
  &__thumb {
    position: absolute;
    inset-block: 4px;
    left: 4px;
    width: calc((100% - 8px) / var(--count));
    background: var(--color-surface);
    border-radius: var(--radius-pill);
    box-shadow: var(--shadow-card);
    transform: translateX(calc(var(--idx) * 100%));
    transition: transform var(--motion-base) cubic-bezier(0.2, 0, 0, 1);
  }

  &__segment {
    position: relative;
    min-height: 44px;
    border-radius: var(--radius-pill);
    @include type('label');
    @include numeric;
    font-weight: 600;
    color: var(--color-text-secondary);
    @include pressable;

    &--active {
      color: var(--color-primary);
    }
  }
}
</style>
