<script setup lang="ts">
import type { ChartSeries } from '~/utils/rollingHours'

const props = defineProps<{ series: ChartSeries }>()

// Fixed internal coordinate system; the SVG scales responsively via viewBox.
const W = 350
const H = 220
const PLOT = { left: 34, right: 12, top: 16, bottom: 24 } as const
const plotW = W - PLOT.left - PLOT.right
const plotH = H - PLOT.top - PLOT.bottom
const plotBottom = H - PLOT.bottom
const plotRight = W - PLOT.right

const clipId = useId()

function xAt(i: number): number {
  return PLOT.left + (i / (props.series.points.length - 1)) * plotW
}

function yAt(value: number): number {
  const clamped = Math.min(value, props.series.bounds.max)
  return plotBottom - (clamped / props.series.bounds.max) * plotH
}

const pts = computed(() => {
  const points = props.series.points
  const center = (points.length - 1) / 2
  let peakIdx = 0
  points.forEach((p, i) => {
    if (p.value > points[peakIdx]!.value) peakIdx = i
  })
  return points.map((p, i) => {
    const over = p.value > props.series.bounds.limit
    const isToday = i === center
    const isPeak = i === peakIdx
    return {
      date: p.date,
      value: p.value,
      x: xAt(i),
      y: yAt(p.value),
      over,
      isToday,
      isPeak,
      // Dots only where they carry information: endpoints, today, the window
      // peak, and every over-limit point — anything else is noise.
      showDot: i === 0 || i === points.length - 1 || isToday || isPeak || over,
      day: String(Number(p.date.slice(8, 10))),
      isMonthStart: p.date.slice(8, 10) === '01',
    }
  })
})

const dots = computed(() => pts.value.filter(p => p.showDot))

const gridlines = computed(() =>
  [0, 1, 2, 3, 4].map((i) => {
    const value = (props.series.bounds.max * i) / 4
    return { value: Math.round(value), y: yAt(value) }
  }),
)

const limitY = computed(() => yAt(props.series.bounds.limit))
const hasOver = computed(() => pts.value.some(p => p.over))
const polylinePoints = computed(() => pts.value.map(p => `${p.x},${p.y}`).join(' '))

/** Area between the series line and the limit line; the clip keeps only the part above the limit. */
const overBandPath = computed(() => {
  const line = pts.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const first = pts.value[0]!
  const last = pts.value.at(-1)!
  return `${line} L ${last.x} ${limitY.value} L ${first.x} ${limitY.value} Z`
})

const todayPoint = computed(() => pts.value[(props.series.points.length - 1) / 2]!)

/** Persistent annotation on the window peak, only when it exceeds the limit. */
const annotation = computed(() => {
  const peak = pts.value.find(p => p.isPeak)
  if (!peak || peak.value <= props.series.bounds.limit) return null
  const label = `${formatHours(peak.value)} h · ${formatDayMonth(peak.date)}`
  const w = label.length * 5.2 + 12
  const h = 16
  const x = Math.min(Math.max(peak.x - w / 2, PLOT.left), plotRight - w)
  const above = peak.y - 10 - h
  const flipped = above < 2
  const y = flipped ? peak.y + 12 : above
  return { label, w, h, x, y, flipped, px: peak.x, py: peak.y }
})

const limitChip = computed(() => {
  const label = `${props.series.bounds.limit} h limit`
  const w = label.length * 5 + 12
  // Sits just above the line so it never collides with the series around the limit.
  return { label, w, x: plotRight - w, y: limitY.value - 20 }
})

const ariaLabel = computed(() => {
  const first = props.series.points[0]!
  const last = props.series.points.at(-1)!
  return `Rolling ${props.series.bounds.windowDays}-day flight hours, `
    + `${formatDayMonth(first.date)} to ${formatDayMonth(last.date)}. `
    + `Today ${formatHours(todayPoint.value.value)} of ${props.series.bounds.limit} hour limit.`
})

// Tap-only tooltip: one at a time, cleared on toggle change or background tap.
const active = ref<number | null>(null)
watch(() => props.series.toggle, () => {
  active.value = null
})

function select(i: number) {
  active.value = active.value === i ? null : i
}

const TIP = { w: 96, h: 42 } as const
const tooltip = computed(() => {
  if (active.value === null) return null
  const p = pts.value[active.value]!
  const x = Math.min(Math.max(p.x - TIP.w / 2, PLOT.left), plotRight - TIP.w)
  const above = p.y - TIP.h - 10
  const y = above < PLOT.top ? p.y + 12 : above
  return { ...p, boxX: x, boxY: y }
})
</script>

<template>
  <div class="trend-chart">
    <svg
      class="trend-chart__svg"
      :viewBox="`0 0 ${W} ${H}`"
      role="img"
      :aria-label="ariaLabel"
      @pointerdown="active = null"
    >
      <defs>
        <clipPath :id="clipId">
          <rect
            :x="PLOT.left"
            :y="PLOT.top"
            :width="plotW"
            :height="Math.max(limitY - PLOT.top, 0)"
          />
        </clipPath>
      </defs>

      <!-- Horizontal gridlines + y labels -->
      <g v-for="line in gridlines" :key="line.value">
        <line
          class="trend-chart__grid"
          :x1="PLOT.left"
          :x2="plotRight"
          :y1="line.y"
          :y2="line.y"
        />
        <text class="trend-chart__y-label" :x="PLOT.left - 6" :y="line.y + 3" text-anchor="end">
          {{ line.value }}
        </text>
      </g>

      <!-- X labels: day numbers, month boundary gets its short month underneath -->
      <text
        v-for="p in pts"
        :key="p.date"
        class="trend-chart__x-label"
        :class="{ 'trend-chart__x-label--em': p.isToday || p.isMonthStart }"
        :x="p.x"
        :y="plotBottom + 12"
        text-anchor="middle"
      >
        {{ p.day }}
        <tspan
          v-if="p.isMonthStart"
          class="trend-chart__x-month"
          :x="p.x"
          dy="9"
        >{{ formatDayMonth(p.date).split(' ')[1] }}</tspan>
      </text>

      <!-- Today marker (promoted: the primary reference in normal ops) -->
      <line
        class="trend-chart__today"
        :x1="todayPoint.x"
        :x2="todayPoint.x"
        :y1="PLOT.top"
        :y2="plotBottom"
      />
      <text class="trend-chart__today-label" :x="todayPoint.x" :y="PLOT.top - 6" text-anchor="middle">
        TODAY
      </text>

      <!-- Red limit line + chip label on the line -->
      <line
        class="trend-chart__limit"
        :x1="PLOT.left"
        :x2="plotRight"
        :y1="limitY"
        :y2="limitY"
      />
      <g class="trend-chart__limit-chip">
        <rect :x="limitChip.x" :y="limitChip.y" :width="limitChip.w" height="16" rx="4" />
        <text :x="limitChip.x + limitChip.w / 2" :y="limitChip.y + 11.5" text-anchor="middle">
          {{ limitChip.label }}
        </text>
      </g>

      <!-- Series (keyed by toggle so the draw-in restarts on change) -->
      <g :key="series.toggle">
        <path
          v-if="hasOver"
          class="trend-chart__band"
          :d="overBandPath"
          :clip-path="`url(#${clipId})`"
        />
        <polyline
          class="trend-chart__line"
          :points="polylinePoints"
          pathLength="1"
        />
        <polyline
          v-if="hasOver"
          class="trend-chart__line trend-chart__line--over"
          :points="polylinePoints"
          pathLength="1"
          :clip-path="`url(#${clipId})`"
        />
        <circle
          v-for="p in dots"
          :key="p.date"
          class="trend-chart__dot"
          :class="{ 'trend-chart__dot--over': p.over, 'trend-chart__dot--today': p.isToday }"
          :cx="p.x"
          :cy="p.y"
          :r="p.isToday ? 5 : p.over ? 3 : 2.5"
        />

        <!-- One-time tap affordance: today dot emits a short halo after draw-in -->
        <circle
          class="trend-chart__halo"
          :cx="todayPoint.x"
          :cy="todayPoint.y"
          r="5"
        />

        <!-- Peak annotation: the window's story, shown only when the peak exceeds the limit -->
        <g v-if="annotation" class="trend-chart__anno">
          <line
            class="trend-chart__anno-leader"
            :x1="annotation.px"
            :x2="annotation.px"
            :y1="annotation.flipped ? annotation.py + 4 : annotation.y + annotation.h"
            :y2="annotation.flipped ? annotation.y : annotation.py - 4"
          />
          <rect :x="annotation.x" :y="annotation.y" :width="annotation.w" :height="annotation.h" rx="4" />
          <text :x="annotation.x + annotation.w / 2" :y="annotation.y + 11.5" text-anchor="middle">
            {{ annotation.label }}
          </text>
        </g>
      </g>

      <!-- Tap targets -->
      <rect
        v-for="(p, i) in pts"
        :key="`hit-${p.date}`"
        class="trend-chart__hit"
        :x="p.x - plotW / 15 / 2"
        :y="PLOT.top"
        :width="plotW / 15"
        :height="plotH"
        @pointerdown.stop="select(i)"
      />

      <!-- Tooltip -->
      <g v-if="tooltip" class="trend-chart__tooltip" @pointerdown.stop>
        <rect
          :x="tooltip.boxX"
          :y="tooltip.boxY"
          :width="TIP.w"
          :height="TIP.h"
          rx="8"
        />
        <text :x="tooltip.boxX + TIP.w / 2" :y="tooltip.boxY + 17" text-anchor="middle">
          {{ formatShortDate(tooltip.date) }}
        </text>
        <text
          class="trend-chart__tooltip-value"
          :x="tooltip.boxX + TIP.w / 2"
          :y="tooltip.boxY + 33"
          text-anchor="middle"
        >
          {{ formatHoursLabel(tooltip.value) }}
        </text>
      </g>
    </svg>

    <table class="visually-hidden">
      <caption>Rolling {{ series.bounds.windowDays }}-day flight hours per day</caption>
      <thead>
        <tr><th scope="col">Date</th><th scope="col">Hours</th></tr>
      </thead>
      <tbody>
        <tr v-for="p in series.points" :key="p.date">
          <td>{{ formatFullDate(p.date) }}</td>
          <td>{{ formatHoursLabel(p.value) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
.trend-chart {
  &__svg {
    display: block;
    width: 100%;
    height: auto;
    touch-action: manipulation;
  }

  &__grid {
    stroke: var(--color-chart-grid);
    stroke-width: 1;
  }

  &__y-label,
  &__x-label {
    font-size: 10px;
    font-variant-numeric: tabular-nums;
    fill: var(--color-text-secondary);
  }

  &__x-label--em {
    font-weight: 700;
    fill: var(--color-primary);
  }

  &__x-month {
    font-size: 8px;
    font-weight: 700;
  }

  &__today {
    stroke: var(--color-primary);
    stroke-width: 1.5;
    stroke-dasharray: 3 3;
  }

  &__today-label {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.06em;
    fill: var(--color-primary);
  }

  &__limit {
    stroke: var(--color-accent);
    stroke-width: 1.5;
    stroke-dasharray: 4 4;
  }

  &__limit-chip {
    rect {
      fill: var(--color-danger-soft);
    }

    text {
      font-size: 9px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      fill: var(--color-danger-ink);
    }
  }

  &__anno {
    rect {
      fill: var(--color-primary);
    }

    text {
      font-size: 9px;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      fill: var(--color-text-inverse);
    }
  }

  &__anno-leader {
    stroke: var(--color-primary);
    stroke-width: 1;
  }

  &__halo {
    fill: none;
    stroke: var(--color-primary);
    stroke-width: 2;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation: chart-halo 600ms ease-out 750ms 2;
  }

  &__band {
    fill: var(--color-danger);
    opacity: 0.12;
    animation: chart-fade 150ms 450ms both;
  }

  &__line {
    fill: none;
    stroke: var(--color-chart-accent);
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: chart-draw var(--motion-draw) cubic-bezier(0.2, 0, 0, 1) forwards;

    &--over {
      stroke: var(--color-danger);
    }
  }

  &__dot {
    fill: var(--color-chart-accent);
    stroke: var(--color-surface);
    stroke-width: 1;
    animation: chart-fade 150ms 450ms both;

    &--over {
      fill: var(--color-danger);
    }

    &--today {
      fill: var(--color-primary);
      stroke-width: 2;
    }
  }

  &__hit {
    fill: transparent;
  }

  &__tooltip {
    rect {
      fill: var(--color-primary);
      opacity: 0.96;
    }

    text {
      font-size: 10px;
      fill: var(--color-text-inverse);
    }
  }

  &__tooltip-value {
    font-size: 12px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
}

@keyframes chart-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes chart-fade {
  from {
    opacity: 0;
  }
}

@keyframes chart-halo {
  0% {
    opacity: 0.5;
    transform: scale(1);
  }

  100% {
    opacity: 0;
    transform: scale(2.4);
  }
}
</style>
