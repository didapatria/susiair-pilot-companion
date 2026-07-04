<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: string
  label: string
  type?: 'text' | 'password'
  error?: string
  name?: string
  autocomplete?: string
}>(), {
  type: 'text',
  error: '',
  name: undefined,
  autocomplete: undefined,
})

defineEmits<{ 'update:modelValue': [value: string] }>()

const revealed = ref(false)
const inputType = computed(() =>
  props.type === 'password' && !revealed.value ? 'password' : 'text',
)
const id = useId()
</script>

<template>
  <div class="text-field">
    <label class="text-field__label" :for="id">{{ label }}</label>
    <div class="text-field__control" :class="{ 'text-field__control--error': error }">
      <input
        :id="id"
        class="text-field__input"
        :type="inputType"
        :value="modelValue"
        :name="name"
        :autocomplete="autocomplete"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="error ? `${id}-error` : undefined"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      >
      <button
        v-if="type === 'password'"
        class="text-field__reveal"
        type="button"
        :aria-pressed="revealed"
        :aria-label="revealed ? 'Hide password' : 'Show password'"
        @click="revealed = !revealed"
      >
        <component :is="revealed ? EyeOff : Eye" :size="20" :stroke-width="1.75" />
      </button>
    </div>
    <p v-if="error" :id="`${id}-error`" class="text-field__error">{{ error }}</p>
  </div>
</template>

<style lang="scss" scoped>
.text-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);

  &__label {
    @include type('body-sm');
    font-weight: 500;
    color: var(--color-primary);
  }

  &__control {
    display: flex;
    align-items: center;
    min-height: 48px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: border-color var(--motion-fast), box-shadow var(--motion-fast);

    &:focus-within {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(14, 33, 56, 0.15);
    }

    &--error {
      border-color: var(--color-danger);
    }
  }

  &__input {
    flex: 1;
    min-width: 0;
    padding-inline: var(--space-4);
    border: 0;
    background: none;
    @include type('body');
    color: var(--color-text);

    &:focus {
      outline: none; // focus ring lives on the control wrapper (focus-within)
    }
  }

  &__reveal {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    color: var(--color-text-secondary);
  }

  &__error {
    @include type('body-sm');
    color: var(--color-danger-ink);
  }
}
</style>
