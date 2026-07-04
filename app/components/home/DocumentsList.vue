<script setup lang="ts">
const store = useDocumentsStore()
const { documents } = storeToRefs(store)

const expiredCount = computed(() => documents.value.filter(d => d.tone === 'danger').length)
const soonCount = computed(() => documents.value.filter(d => d.tone === 'warning').length)
const hasAlerts = computed(() => expiredCount.value + soonCount.value > 0)
</script>

<template>
  <section aria-labelledby="documents-title">
    <h2 id="documents-title" class="section-title documents__title">My documents</h2>

    <AppCard>
      <p v-if="store.status === 'ready' && hasAlerts" class="documents__summary">
        <span v-if="expiredCount" class="documents__summary-expired">{{ expiredCount }} expired</span>
        <span v-if="expiredCount && soonCount" aria-hidden="true"> · </span>
        <span v-if="soonCount" class="documents__summary-soon">{{ soonCount }} expiring soon</span>
      </p>
      <ul v-if="store.status === 'ready'" class="appear">
        <DocumentItem v-for="doc in documents" :key="doc.id" :doc="doc" />
      </ul>
      <div v-else class="documents__skeleton" aria-hidden="true">
        <div v-for="i in 5" :key="i" class="documents__skeleton-row">
          <SkeletonBlock width="36px" height="36px" radius="var(--radius-full)" />
          <div class="documents__skeleton-text">
            <SkeletonBlock width="60%" height="14px" />
            <SkeletonBlock width="40%" height="12px" />
          </div>
          <SkeletonBlock width="88px" height="24px" radius="var(--radius-full)" />
        </div>
      </div>
    </AppCard>
  </section>
</template>

<style lang="scss" scoped>
.documents {
  &__title {
    margin-bottom: var(--space-3);
  }

  &__summary {
    @include type('body-sm');
    @include numeric;
    padding-bottom: var(--space-3);
    margin-bottom: var(--space-1);
    font-weight: 600;
    border-bottom: 1px solid var(--color-border);
  }

  &__summary-expired {
    color: var(--color-danger-ink);
  }

  &__summary-soon {
    color: var(--color-warning-ink);
  }

  &__skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  &__skeleton-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-height: 48px;
  }

  &__skeleton-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
}
</style>
