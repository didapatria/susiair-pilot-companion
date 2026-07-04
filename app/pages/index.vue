<script setup lang="ts">
definePageMeta({ layout: 'auth' })
</script>

<template>
  <div class="signin page">
    <!-- Logo source: https://susiair.com/images/susiair-logo.png -->
    <img
      class="signin__logo"
      src="/images/susi-air-logo.png"
      alt="Susi Air"
      width="160"
    >
    <h1 class="signin__title">Pilot Companion</h1>
    <p class="signin__subtitle">Susi Air operations</p>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.signin {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: var(--space-1);
  padding-block: var(--space-16);

  &__logo {
    margin-bottom: var(--space-6);
  }

  &__title {
    @include type('display');
    color: var(--color-primary);
  }

  &__subtitle {
    @include type('body-sm');
    color: var(--color-text-secondary);
  }
}
</style>
