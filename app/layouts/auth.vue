<template>
  <div class="auth-layout">
    <main class="auth-layout__main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;

  &__main {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
