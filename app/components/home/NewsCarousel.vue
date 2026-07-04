<script setup lang="ts">
import { Map as MapIcon, Plane, ShieldCheck } from 'lucide-vue-next'

const items = [
  {
    id: 'fleet',
    category: 'Fleet',
    icon: Plane,
    title: 'Two more Grand Caravans join the eastern fleet',
    date: '2026-05-28',
  },
  {
    id: 'route',
    category: 'Route',
    icon: MapIcon,
    title: 'New scheduled service: Manokwari–Kebar twice weekly',
    date: '2026-05-26',
  },
  {
    id: 'safety',
    category: 'Safety',
    icon: ShieldCheck,
    title: 'Wet-season SOP refresher due before June rotations',
    date: '2026-05-24',
  },
] as const
</script>

<template>
  <div class="news-carousel">
    <NewsCard
      v-for="item in items"
      :key="item.id"
      :category="item.category"
      :title="item.title"
      :date="item.date"
      :icon="item.icon"
    />
  </div>
</template>

<style lang="scss" scoped>
.news-carousel {
  display: flex;
  gap: var(--space-3);
  // Full-bleed scroll area: cards peek past the page padding.
  margin-inline: calc(var(--page-pad) * -1);
  padding-inline: var(--page-pad);
  padding-bottom: var(--space-2);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
