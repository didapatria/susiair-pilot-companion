<template>
  <div class="auth-layout">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}
</style>
