<script setup lang="ts">
import { Bell } from 'lucide-vue-next'

const flightStore = useFlightHoursStore()
const documentsStore = useDocumentsStore()
const { pilot } = storeToRefs(flightStore)
const { alertCount } = storeToRefs(documentsStore)

const initials = computed(() =>
  pilot.value?.name
    .split(/\s+/)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '',
)

const showBadge = computed(() => documentsStore.status === 'ready' && alertCount.value > 0)
const bellLabel = computed(() =>
  showBadge.value ? `Notifications, ${alertCount.value} alerts` : 'Notifications',
)
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner page">
      <div class="app-header__identity">
        <template v-if="flightStore.status === 'ready' && pilot">
          <p class="app-header__welcome">Welcome back,</p>
          <h1 class="app-header__name">{{ pilot.name }}</h1>
          <p class="app-header__hours">
            <span class="visually-hidden">Total flight hours: </span>
            {{ formatHoursLabel(pilot.totalFlightHours) }}
          </p>
        </template>
        <template v-else>
          <SkeletonBlock inverse width="96px" height="14px" />
          <SkeletonBlock inverse width="168px" height="24px" />
          <SkeletonBlock inverse width="92px" height="28px" radius="var(--radius-full)" />
        </template>
      </div>

      <div class="app-header__actions">
        <button class="app-header__bell" type="button" :aria-label="bellLabel">
          <Bell :size="24" :stroke-width="1.75" />
          <span v-if="showBadge" class="app-header__badge" aria-hidden="true">{{ alertCount }}</span>
        </button>
        <div class="app-header__avatar" aria-hidden="true">
          <span v-if="initials">{{ initials }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.app-header {
  background: var(--color-surface-navy);
  padding-top: max(env(safe-area-inset-top), var(--space-4));
  // Extra bottom room so the first content card can overlap the canvas.
  padding-bottom: calc(var(--space-6) + 24px);

  &__inner {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    padding-top: var(--space-4);
  }

  &__identity {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
  }

  &__welcome {
    @include type('label');
    color: rgba(255, 255, 255, 0.7);
  }

  &__name {
    @include type('headline');
    color: var(--color-text-inverse);
  }

  &__hours {
    @include type('body-sm');
    @include numeric;
    margin-top: var(--space-1);
    padding: 4px 12px;
    font-weight: 700;
    color: var(--color-text-inverse);
    background: var(--color-white-soft);
    border-radius: var(--radius-full);
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__bell {
    position: relative;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    color: var(--color-text-inverse);
    border-radius: var(--radius-full);
    @include pressable;

    &:focus-visible {
      outline-color: var(--color-text-inverse);
    }
  }

  &__badge {
    position: absolute;
    top: 4px;
    right: 2px;
    display: grid;
    place-items: center;
    min-width: 18px;
    height: 18px;
    padding-inline: 5px;
    @include type('micro');
    @include numeric;
    font-weight: 700;
    color: var(--color-text-inverse);
    background: var(--color-danger);
    border-radius: var(--radius-full);
  }

  &__avatar {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    @include type('body-sm');
    font-weight: 700;
    color: var(--color-text-inverse);
    background: var(--color-white-soft);
    border-radius: var(--radius-full);
  }
}
</style>
