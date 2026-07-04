<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
import type { DocumentView } from '~/stores/documents'

defineProps<{ doc: DocumentView }>()
</script>

<template>
  <li class="document-item">
    <div class="document-item__icon" aria-hidden="true">
      <FileText :size="18" :stroke-width="1.75" />
    </div>
    <div class="document-item__text">
      <p class="document-item__label">{{ doc.label }}</p>
      <p class="document-item__expiry">Expires {{ formatMediumDate(doc.expiryDate) }}</p>
    </div>
    <StatusPill :tone="doc.tone">{{ documentStatusCopy(doc.daysRemaining) }}</StatusPill>
  </li>
</template>

<style lang="scss" scoped>
.document-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 56px;
  padding-block: var(--space-2);

  & + & {
    border-top: 1px solid var(--color-border);
  }

  &__icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: var(--color-navy-soft);
    border-radius: var(--radius-full);
    color: var(--color-primary);
  }

  &__text {
    flex: 1;
    min-width: 0;
  }

  &__label {
    @include type('body');
    font-weight: 500;
    color: var(--color-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__expiry {
    @include type('body-sm');
    @include numeric;
    color: var(--color-text-secondary);
  }
}
</style>
