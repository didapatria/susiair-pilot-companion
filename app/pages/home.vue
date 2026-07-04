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
      <UpcomingFlightCard class="home__overlap home__rise" style="--i: 0" />

      <section class="home__rise" style="--i: 1" aria-labelledby="news-title">
        <h2 id="news-title" class="section-title home__section-title">Latest news</h2>
        <NewsCarousel />
      </section>

      <HoursToLimitSection class="home__rise" style="--i: 2" />

      <DocumentsList class="home__rise" style="--i: 3" />
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

  // Staggered section reveal on first paint
  &__rise {
    animation: home-rise 300ms cubic-bezier(0.2, 0, 0, 1) both;
    animation-delay: calc(var(--i) * 40ms);
  }
}

@keyframes home-rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
</style>
