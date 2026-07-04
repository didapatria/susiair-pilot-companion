<script setup lang="ts">
import { BookOpen, CalendarDays, Ellipsis, House } from 'lucide-vue-next'

const items = [
  { to: '/home', label: 'Home', icon: House },
  { to: '/schedule', label: 'Schedule', icon: CalendarDays },
  { to: '/logbook', label: 'Logbook', icon: BookOpen },
  { to: '/more', label: 'More', icon: Ellipsis },
]

const route = useRoute()
</script>

<template>
  <nav class="bottom-nav" aria-label="Main">
    <NuxtLink
      v-for="item in items"
      :key="item.to"
      class="bottom-nav__item"
      :class="{ 'bottom-nav__item--active': route.path === item.to }"
      :to="item.to"
      :aria-current="route.path === item.to ? 'page' : undefined"
    >
      <component :is="item.icon" :size="24" :stroke-width="1.75" />
      <span class="bottom-nav__label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<style lang="scss" scoped>
.bottom-nav {
  position: fixed;
  inset-inline: 0;
  bottom: 0;
  z-index: var(--z-nav);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: calc(64px + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    color: var(--color-text-secondary);
    @include pressable;

    &--active {
      color: var(--color-primary);

      .bottom-nav__label {
        font-weight: 600;
      }
    }
  }

  &__label {
    @include type('label');
    line-height: 1;
  }
}
</style>
