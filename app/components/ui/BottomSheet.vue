<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const closeButton = ref<ComponentPublicInstance | null>(null)
const titleId = useId()

watch(() => props.open, async (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) return
  await nextTick()
  ;(closeButton.value?.$el as HTMLElement | undefined)?.focus()
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
})

/** Keep Tab cycling inside the dialog while it is open. */
function trapTab(event: KeyboardEvent) {
  if (event.key !== 'Tab' || !panel.value) return
  const nodes = panel.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  if (!nodes.length) return
  const first = nodes[0]!
  const last = nodes[nodes.length - 1]!
  const active = document.activeElement
  if (event.shiftKey && (active === first || active === panel.value)) {
    event.preventDefault()
    last.focus()
  }
  else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}
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
          :aria-labelledby="titleId"
          tabindex="-1"
          @keydown.esc="emit('close')"
          @keydown="trapTab"
        >
          <div class="bottom-sheet__grab" aria-hidden="true" />
          <h2 :id="titleId" class="bottom-sheet__title">{{ title }}</h2>
          <slot />
          <AppButton ref="closeButton" variant="secondary" @click="emit('close')">Close</AppButton>
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

  &__title {
    @include type('title');
    color: var(--color-primary);
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
