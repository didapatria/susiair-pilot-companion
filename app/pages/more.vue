<script setup lang="ts">
import { Ellipsis } from 'lucide-vue-next'
</script>

<template>
  <div class="page">
    <h1 class="page-title">More</h1>
    <AppCard>
      <EmptyState
        :icon="Ellipsis"
        title="Nothing here yet"
        body="Settings and tools are coming soon."
      />
    </AppCard>
  </div>
</template>
