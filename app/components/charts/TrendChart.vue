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
  const center = (props.series.points.length - 1) / 2
  return props.series.points.map((p, i) => ({
    date: p.date,
    value: p.value,
    x: xAt(i),
    y: yAt(p.value),
    over: p.value > props.series.bounds.limit,
    isToday: i === center,
    day: String(Number(p.date.slice(8, 10))),
    isMonthStart: p.date.slice(8, 10) === '01',
  }))
})

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

      <!-- Today marker -->
      <line
        class="trend-chart__today"
        :x1="todayPoint.x"
        :x2="todayPoint.x"
        :y1="PLOT.top"
        :y2="plotBottom"
      />

      <!-- Red limit line + label -->
      <line
        class="trend-chart__limit"
        :x1="PLOT.left"
        :x2="plotRight"
        :y1="limitY"
        :y2="limitY"
      />
      <text class="trend-chart__limit-label" :x="plotRight" :y="limitY - 5" text-anchor="end">
        {{ series.bounds.limit }} h limit
      </text>

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
          v-for="p in pts"
          :key="p.date"
          class="trend-chart__dot"
          :class="{ 'trend-chart__dot--over': p.over, 'trend-chart__dot--today': p.isToday }"
          :cx="p.x"
          :cy="p.y"
          :r="p.isToday ? 4.5 : p.over ? 3 : 2.5"
        />
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
    stroke-width: 1;
    stroke-dasharray: 2 3;
    opacity: 0.7;
  }

  &__limit {
    stroke: var(--color-accent);
    stroke-width: 1.5;
    stroke-dasharray: 4 4;
  }

  &__limit-label {
    font-size: 10px;
    font-weight: 700;
    fill: var(--color-accent);
    paint-order: stroke;
    stroke: var(--color-surface);
    stroke-width: 3px;
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
</style>
