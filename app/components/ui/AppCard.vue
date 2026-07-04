<script setup lang="ts">
defineProps<{ pressable?: boolean }>()
</script>

<template>
  <div class="app-card" :class="{ 'app-card--pressable': pressable }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.app-card {
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);

  &--pressable {
    @include pressable;
  }
}
</style>
