import { expect, test } from '@playwright/test'

const shot = (name: string) => ({ path: `docs/screenshots/${name}.png` })

async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() =>
    Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__),
  )
}

test('sign in, browse the dashboard and open the schedule', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Pilot Companion' })).toBeVisible()
  await waitForHydration(page)
  await page.screenshot(shot('sign-in'))

  await page.getByRole('textbox', { name: 'Username' }).fill('john.doe')
  await page.getByRole('textbox', { name: 'Password' }).fill('caravan208')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('**/home')

  // Header renders store-driven data: pilot name, total hours, alert badge.
  await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible()
  await expect(page.getByText('1,444.5 h')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Notifications, 3 alerts' })).toBeVisible()
  await page.screenshot(shot('home-top'))

  // Hours to limit: fixture card values on screen, 1w chart by default.
  await page.getByRole('heading', { name: 'Hours to limit' }).scrollIntoViewIfNeeded()
  await expect(page.getByText('99.3', { exact: true })).toBeVisible()
  await expect(page.getByText('1,025.3', { exact: true })).toBeVisible()
  await page.waitForTimeout(900) // chart draw-in
  await page.screenshot(shot('hours-1w'))

  // 1m toggle must visualize the over-limit segment (25–29 May above 100 h).
  await page.getByRole('radio', { name: '1m' }).click()
  await page.waitForTimeout(900)
  await page.screenshot(shot('hours-1m'))

  await page.getByRole('heading', { name: 'My documents' }).scrollIntoViewIfNeeded()
  await expect(page.getByText('Expired 30 days ago')).toBeVisible()
  await expect(page.getByText('Expired 2 days ago')).toBeVisible()
  await expect(page.getByText('11 days left')).toBeVisible()
  await page.waitForTimeout(300)
  await page.screenshot(shot('documents'))

  // Schedule: May 2026 by default, today ring on 31 May, tap opens the sheet.
  await page.getByRole('link', { name: 'Schedule' }).click()
  await page.waitForURL('**/schedule')
  await expect(page.getByRole('heading', { name: 'May 2026' })).toBeVisible()
  await page.waitForTimeout(700)
  await page.screenshot(shot('schedule-may'))

  await page.getByRole('button', { name: /31 May, On Duty MKW, 2 flights scheduled/ }).click()
  await expect(page.getByText('Detail page coming soon.')).toBeVisible()
  await page.waitForTimeout(400)
  await page.screenshot(shot('schedule-tap'))
})

test('placeholders exist and deep links load directly', async ({ page }) => {
  await page.goto('/schedule')
  await expect(page.getByRole('heading', { name: 'May 2026' })).toBeVisible()

  await page.goto('/logbook')
  await expect(page.getByText('No logbook entries yet')).toBeVisible()

  await page.goto('/more')
  await expect(page.getByText('Nothing here yet')).toBeVisible()
})
