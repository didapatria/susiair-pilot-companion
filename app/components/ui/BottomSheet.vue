<script setup lang="ts">
const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)

watch(() => props.open, async (open) => {
  if (!open) return
  await nextTick()
  panel.value?.focus()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="bottom-sheet">
        <div class="bottom-sheet__backdrop" @click="emit('close')" />
        <div
          ref="panel"
          class="bottom-sheet__panel"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          tabindex="-1"
          @keydown.esc="emit('close')"
        >
          <div class="bottom-sheet__grab" aria-hidden="true" />
          <slot />
          <AppButton variant="secondary" @click="emit('close')">Close</AppButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.bottom-sheet {
  position: fixed;
  inset: 0;
  z-index: var(--z-sheet);

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(14, 33, 56, 0.4);
  }

  &__panel {
    position: absolute;
    inset-inline: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    max-width: 720px;
    margin-inline: auto;
    padding: var(--space-3) var(--space-5) calc(var(--space-5) + env(safe-area-inset-bottom));
    background: var(--color-surface);
    border-radius: 20px 20px 0 0;
    box-shadow: var(--shadow-sheet);
    outline: none;
  }

  &__grab {
    width: 36px;
    height: 4px;
    margin-inline: auto;
    background: var(--color-border);
    border-radius: var(--radius-full);
  }
}

// Enter: backdrop fades while the panel slides up; exit reverses faster.
.sheet-enter-active {
  transition: opacity var(--motion-slow) cubic-bezier(0.2, 0, 0, 1);

  .bottom-sheet__panel {
    transition: transform var(--motion-slow) cubic-bezier(0.2, 0, 0, 1);
  }
}

.sheet-leave-active {
  transition: opacity var(--motion-base) cubic-bezier(0.4, 0, 1, 1);

  .bottom-sheet__panel {
    transition: transform var(--motion-base) cubic-bezier(0.4, 0, 1, 1);
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .bottom-sheet__panel {
    transform: translateY(100%);
  }
}
</style>
