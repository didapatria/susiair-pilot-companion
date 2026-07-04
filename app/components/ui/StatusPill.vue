<script setup lang="ts">
import type { Tone } from '~/utils/status'

defineProps<{ tone: Tone | 'neutral' }>()
</script>

<template>
  <span class="status-pill" :class="`status-pill--${tone}`">
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  @include type('label');
  font-weight: 600;
  white-space: nowrap;

  &--success {
    background: var(--color-success-soft);
    color: var(--color-success-ink);
  }

  &--warning {
    background: var(--color-warning-soft);
    color: var(--color-warning-ink);
  }

  &--danger {
    background: var(--color-danger-soft);
    color: var(--color-danger-ink);
  }

  &--neutral {
    background: var(--color-navy-soft);
    color: var(--color-primary);
  }
}
</style>
