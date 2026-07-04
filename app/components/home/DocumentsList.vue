<script setup lang="ts">
const store = useDocumentsStore()
const { documents } = storeToRefs(store)
</script>

<template>
  <section aria-labelledby="documents-title">
    <h2 id="documents-title" class="section-title documents__title">My documents</h2>

    <AppCard>
      <ul v-if="store.status === 'ready'">
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
