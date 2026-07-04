<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  loading?: boolean
  disabled?: boolean
}>(), {
  variant: 'primary',
  type: 'button',
})
</script>

<template>
  <button
    class="app-button"
    :class="`app-button--${variant}`"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
    <span class="app-button__label" :class="{ 'app-button__label--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding-inline: var(--space-6);
  border-radius: var(--radius-pill);
  @include type('body');
  font-weight: 600;
  @include pressable;

  &:disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  &--primary {
    width: 100%;
    background: var(--color-accent-strong);
    color: var(--color-text-inverse);

    &:active {
      background: color-mix(in srgb, var(--color-accent-strong) 94%, black);
    }
  }

  &--secondary {
    width: 100%;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    color: var(--color-primary);
  }

  &--ghost {
    min-height: 44px;
    background: none;
    color: var(--color-primary);
    @include type('body-sm');
    font-weight: 600;
  }

  &__label--hidden {
    visibility: hidden;
  }

  &__spinner {
    position: absolute;
    width: 18px;
    height: 18px;
    border: 2px solid currentcolor;
    border-right-color: transparent;
    border-radius: var(--radius-full);
    animation: button-spin 700ms linear infinite;
  }
}

@keyframes button-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
