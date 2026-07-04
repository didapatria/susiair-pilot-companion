<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
  height?: string
  radius?: string
  /** Lighter variant for use on the navy header canvas */
  inverse?: boolean
}>(), {
  width: '100%',
  height: '16px',
  radius: 'var(--radius-md)',
})
</script>

<template>
  <div
    class="skeleton"
    :class="{ 'skeleton--inverse': inverse }"
    :style="{ width, height, borderRadius: radius }"
    aria-hidden="true"
  />
</template>

<style lang="scss" scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background: #EEF1F5;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, #F7F9FB 50%, transparent);
    transform: translateX(-100%);
    animation: skeleton-shimmer 1.4s linear infinite;
  }

  &--inverse {
    background: var(--color-white-soft);

    &::after {
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18) 50%, transparent);
    }
  }
}

@keyframes skeleton-shimmer {
  to {
    transform: translateX(100%);
  }
}
</style>
