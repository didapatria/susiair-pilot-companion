<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const username = ref('')
const password = ref('')
const errors = reactive({ username: '', password: '' })
const submitting = ref(false)

async function onSubmit() {
  errors.username = username.value.trim() ? '' : 'Enter your username'
  errors.password = password.value.trim() ? '' : 'Enter your password'
  if (errors.username || errors.password) return

  submitting.value = true
  await delay(600) // fake authentication round-trip
  await navigateTo('/home')
}
</script>

<template>
  <div class="signin page">
    <header class="signin__brand">
      <!-- Logo source: https://susiair.com/images/susiair-logo.png -->
      <img
        class="signin__logo"
        src="/images/susi-air-logo.png"
        alt="Susi Air"
        width="180"
        height="45"
      >
      <h1 class="signin__title">Pilot Companion</h1>
      <p class="signin__subtitle">Susi Air operations</p>
    </header>

    <AppCard class="signin__card">
      <!-- The inline onsubmit ships in the SSR HTML, so a submit fired before
           hydration can never fall back to a native GET (credentials in the URL). -->
      <form class="signin__form" novalidate onsubmit="return false" @submit.prevent="onSubmit">
        <AppTextField
          v-model="username"
          label="Username"
          name="username"
          autocomplete="username"
          :error="errors.username"
        />
        <AppTextField
          v-model="password"
          label="Password"
          type="password"
          name="password"
          autocomplete="current-password"
          :error="errors.password"
        />
        <AppButton type="submit" :loading="submitting">Sign in</AppButton>
      </form>
    </AppCard>

    <a class="signin__help" href="tel:+628112129909">Need help? Contact CRD</a>

    <footer class="signin__brandline">
      <span class="signin__stripe" aria-hidden="true" />
      <p class="signin__tagline">Reaching the unreachable</p>
      <p class="signin__tagsub">Pioneer flight operations across Indonesia</p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.signin {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  max-width: 480px;
  padding-block: var(--space-16) var(--space-8);

  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-1);
    margin-bottom: var(--space-10);
    text-align: center;
  }

  &__logo {
    width: 180px;
    height: auto;
    margin-bottom: var(--space-6);
  }

  &__title {
    @include type('display');
    color: var(--color-primary);
  }

  &__subtitle {
    @include type('body-sm');
    color: var(--color-text-secondary);
  }

  &__card {
    width: 100%;
    padding: var(--space-5);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);

    > .app-button {
      margin-top: var(--space-2);
    }
  }

  &__help {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    margin-top: var(--space-4);
    @include type('body-sm');
    font-weight: 600;
    color: var(--color-primary);
  }

  &__brandline {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    margin-top: auto;
    padding-top: var(--space-10);
    padding-bottom: max(env(safe-area-inset-bottom), var(--space-6));
    text-align: center;
  }

  &__stripe {
    @include stripe(44px);
    margin-bottom: var(--space-1);
  }

  &__tagline {
    @include type('micro');
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }

  &__tagsub {
    @include type('label');
    color: var(--color-text-secondary);
  }
}
</style>
