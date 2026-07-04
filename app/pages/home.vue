<script setup lang="ts">
const flightHoursStore = useFlightHoursStore()
const documentsStore = useDocumentsStore()

useLazyAsyncData('home-data', async () => {
  await Promise.all([flightHoursStore.load(), documentsStore.load()])
  return true
}, { server: false })
</script>

<template>
  <div class="home">
    <AppHeader />

    <div class="home__content page">
      <UpcomingFlightCard class="home__overlap" />

      <section aria-labelledby="news-title">
        <h2 id="news-title" class="section-title home__section-title">Latest news</h2>
        <NewsCarousel />
      </section>

      <HoursToLimitSection />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--space-7);
  }

  &__overlap {
    margin-top: -24px;
  }

  &__section-title {
    margin-bottom: var(--space-3);
  }
}
</style>
