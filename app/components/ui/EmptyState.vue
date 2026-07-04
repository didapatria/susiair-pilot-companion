<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  title: string
  body: string
}>()
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__icon">
      <component :is="icon" :size="28" :stroke-width="1.75" />
    </div>
    <h2 class="empty-state__title">{{ title }}</h2>
    <p class="empty-state__body">{{ body }}</p>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-12) var(--space-5);
  text-align: center;

  &__icon {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin-bottom: var(--space-2);
    background: var(--color-navy-soft);
    border-radius: var(--radius-full);
    color: var(--color-primary);
  }

  &__title {
    @include type('title');
    color: var(--color-primary);
  }

  &__body {
    @include type('body-sm');
    max-width: 260px;
    color: var(--color-text-secondary);
  }
}
</style>
