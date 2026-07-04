<template>
  <div class="app-layout">
    <main class="app-layout__page">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.app-layout {
  min-height: 100dvh;
  padding-bottom: var(--space-24);
}
</style>
