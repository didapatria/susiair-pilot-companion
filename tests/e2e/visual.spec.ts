import { expect, test } from '@playwright/test'

// @visual — screenshot regression against committed baselines.
// Baselines are generated locally (same machine/fonts) and are excluded from CI:
// cross-platform font rasterization makes them flaky on other runners.
// Regenerate deliberately with: pnpm test:e2e --grep @visual --update-snapshots

const SHOT = { animations: 'disabled', maxDiffPixels: 120 } as const

async function settle(page: import('@playwright/test').Page, anchor: () => Promise<void>) {
  await anchor()
  await page.evaluate(() => document.fonts.ready)
  // Count-up (rAF, not covered by animations:'disabled') and store latency settle
  await page.waitForTimeout(1000)
}

test('sign-in visual @visual', async ({ page }) => {
  await page.goto('/')
  await settle(page, () => expect(page.getByRole('heading', { name: 'Pilot Companion' })).toBeVisible())
  await expect(page).toHaveScreenshot('sign-in.png', SHOT)
})

test('home visual @visual', async ({ page }) => {
  await page.goto('/home')
  await settle(page, () => expect(page.getByText('2 expired', { exact: true })).toBeVisible())
  await expect(page).toHaveScreenshot('home.png', { ...SHOT, fullPage: true })
})

test('chart 1w and 1m visuals @visual', async ({ page }) => {
  await page.goto('/home')
  await settle(page, () => expect(page.getByText('99.3', { exact: true })).toBeVisible())
  const chartCard = page.locator('.hours__chart')
  await chartCard.scrollIntoViewIfNeeded()
  await expect(chartCard).toHaveScreenshot('chart-1w.png', SHOT)

  await page.getByRole('radio', { name: '1m' }).click()
  await expect(page.getByTestId('chart-peak-annotation')).toBeVisible()
  await page.waitForTimeout(800)
  await expect(chartCard).toHaveScreenshot('chart-1m.png', SHOT)
})

test('schedule visual @visual', async ({ page }) => {
  await page.goto('/schedule')
  await settle(page, () => expect(page.getByRole('heading', { name: 'May 2026' })).toBeVisible())
  await expect(page).toHaveScreenshot('schedule-may.png', { ...SHOT, fullPage: true })
})
