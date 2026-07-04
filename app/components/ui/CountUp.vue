<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number
  format?: (n: number) => string
  duration?: number
}>(), {
  format: (n: number) => String(n),
  duration: 600,
})

const display = ref(props.format(props.value))
let raf = 0

function animate(from: number, to: number) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || from === to) {
    display.value = props.format(to)
    return
  }
  const start = performance.now()
  const tick = (now: number) => {
    const t = Math.min((now - start) / props.duration, 1)
    const eased = 1 - (1 - t) ** 3
    display.value = props.format(from + (to - from) * eased)
    if (t < 1) raf = requestAnimationFrame(tick)
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => animate(0, props.value))
watch(() => props.value, (to, from) => {
  cancelAnimationFrame(raf)
  animate(from ?? 0, to)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <span>{{ display }}</span>
</template>
