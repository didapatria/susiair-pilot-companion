<script setup lang="ts">
import { BookOpen } from 'lucide-vue-next'
</script>

<template>
  <div class="page">
    <h1 class="page-title">Logbook</h1>
    <AppCard>
      <EmptyState
        :icon="BookOpen"
        title="No logbook entries yet"
        body="Completed flights appear here once verified."
      />
    </AppCard>
  </div>
</template>
