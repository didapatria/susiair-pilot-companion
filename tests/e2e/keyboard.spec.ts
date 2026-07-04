import { expect, test } from '@playwright/test'

async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() =>
    Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__),
  )
}

test('signs in with the keyboard only', async ({ page }) => {
  await page.goto('/')
  await waitForHydration(page)

  await page.keyboard.press('Tab')
  await expect(page.getByRole('textbox', { name: 'Username' })).toBeFocused()
  await page.keyboard.type('john.doe')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeFocused()
  await page.keyboard.type('caravan208')
  await page.keyboard.press('Enter')
  await page.waitForURL('**/home')
})

test('navigates the duty calendar with arrows and honors the dialog focus contract', async ({ page }) => {
  await page.goto('/schedule')
  await waitForHydration(page)
  await expect(page.getByRole('heading', { name: 'May 2026' })).toBeVisible()

  const today = page.locator('[data-iso="2026-05-31"]')
  await today.focus()

  // Day-wise arrows
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('[data-iso="2026-05-30"]')).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('[data-iso="2026-05-23"]')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowRight')
  await expect(today).toBeFocused()

  // Month step keeps day-of-month where it exists (31 May → 30 June)
  await page.keyboard.press('PageDown')
  await expect(page.getByRole('heading', { name: 'June 2026' })).toBeVisible()
  await expect(page.locator('[data-iso="2026-06-30"]')).toBeFocused()
  await page.keyboard.press('PageUp')
  await expect(page.getByRole('heading', { name: 'May 2026' })).toBeVisible()
  await expect(page.locator('[data-iso="2026-05-30"]')).toBeFocused()

  // Enter opens the dialog, Esc closes and focus returns to the invoking cell
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'Sunday, 31 May' })).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused()

  // Tab stays trapped inside the dialog
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(today).toBeFocused()
})
