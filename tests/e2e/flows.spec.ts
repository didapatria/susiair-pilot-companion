import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() =>
    Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__),
  )
}

test('home renders the fixture-derived facts', async ({ page }) => {
  await page.goto('/home')

  // Header total (count-up settles on the exact fixture figure)
  await expect(page.getByText('1,444.5', { exact: true })).toBeVisible()

  // Documents urgency summary strip
  await expect(page.getByText('2 expired', { exact: true })).toBeVisible()
  await expect(page.getByText('1 expiring soon', { exact: true })).toBeVisible()
})

test('1m toggle shows the over-limit story', async ({ page }) => {
  await page.goto('/home')
  await waitForHydration(page)
  await page.getByRole('heading', { name: 'Hours to limit' }).scrollIntoViewIfNeeded()
  await page.getByRole('radio', { name: '1m' }).click()

  await expect(page.getByTestId('chart-peak-annotation')).toBeVisible()
  await expect(page.getByTestId('chart-peak-annotation')).toContainText('104.4 h · 29 May')
  await expect(page.getByTestId('chart-over-segment')).toBeVisible()
  await expect(page.getByTestId('chart-over-band')).toBeVisible()

  // 1w has no crossing: annotation and over layers disappear
  await page.getByRole('radio', { name: '1w' }).click()
  await expect(page.getByTestId('chart-peak-annotation')).toHaveCount(0)
  await expect(page.getByTestId('chart-over-segment')).toHaveCount(0)
})

test('schedule deep-loads, opens the right day sheet, survives empty months', async ({ page }) => {
  await page.goto('/schedule')
  await waitForHydration(page)
  await expect(page.getByRole('heading', { name: 'May 2026' })).toBeVisible()

  // 15 May is a completed MKW duty (tick, 6/6) — sheet shows its full date
  await page.getByRole('gridcell', { name: /^15 MKW/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'Friday, 15 May' })).toBeVisible()
  await page.keyboard.press('Escape')

  // March 2026 has no duties: the grid still renders, just without chips
  await page.getByRole('button', { name: 'Previous month' }).click()
  await page.getByRole('button', { name: 'Previous month' }).click()
  await expect(page.getByRole('heading', { name: 'March 2026' })).toBeVisible()
  await expect(page.locator('.day-cell--duty')).toHaveCount(0)
})

test('home works under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/home')

  await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible()
  await expect(page.getByText('2 expired', { exact: true })).toBeVisible()
  await expect(page.getByText('99.3', { exact: true })).toBeVisible()
})

for (const route of ['/', '/home', '/schedule']) {
  test(`axe: no accessibility violations on ${route}`, async ({ page }) => {
    await page.goto(route)
    await waitForHydration(page)
    // Let simulated store latency resolve so the real content is audited
    if (route !== '/') await page.waitForTimeout(900)

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
}
