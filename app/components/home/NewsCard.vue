<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  category: string
  title: string
  date: string
  icon: Component
}>()
</script>

<template>
  <article class="news-card">
    <div class="news-card__thumb" aria-hidden="true">
      <component :is="icon" :size="32" :stroke-width="1.75" />
    </div>
    <div class="news-card__body">
      <span class="news-card__category">{{ category }}</span>
      <h3 class="news-card__title">{{ title }}</h3>
      <p class="news-card__date">{{ formatMediumDate(date) }}</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.news-card {
  flex: 0 0 240px;
  scroll-snap-align: start;
  overflow: hidden;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);

  &__thumb {
    display: grid;
    place-items: center;
    height: 112px;
    background: var(--color-surface-navy);
    color: rgba(255, 255, 255, 0.6);
  }

  &__body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-2);
    padding: var(--space-4);
  }

  &__category {
    padding: 2px 10px;
    @include type('micro');
    font-weight: 600;
    color: var(--color-primary);
    background: var(--color-navy-soft);
    border-radius: var(--radius-full);
  }

  &__title {
    @include type('body');
    font-weight: 600;
    color: var(--color-primary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__date {
    @include type('label');
    color: var(--color-text-secondary);
  }
}
</style>
