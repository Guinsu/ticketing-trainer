import { expect, test, type Page } from '@playwright/test'

const enterBookingWindow = async (page: Page) => {
  await page.goto('/')
  await page.getByRole('link', { name: '이 공연으로 연습하기' }).click()
  await page.getByRole('link', { name: '예매하기' }).click()
  await page.getByRole('button', { name: '예매하기' }).click({ timeout: 15_000 })
  await page.getByRole('button', { name: '다음' }).click({ timeout: 30_000 })
}

const captchaText = (page: Page) =>
  page.getByRole('dialog', { name: '안심예매' }).locator('div.text-5xl > div > span').innerText()

test('홈에서 결과까지 실전연습을 끝낸다', async ({ page }) => {
  await enterBookingWindow(page)

  const captcha = page.getByRole('dialog', { name: '안심예매' })
  await captcha.getByLabel('보안문자 입력').fill('WRONG1')
  await captcha.getByRole('button', { name: '입력완료' }).click()
  await expect(captcha.getByRole('alert')).toHaveText(/일치하지 않습니다/)
  await captcha.getByLabel('보안문자 입력').fill((await captchaText(page)).toLowerCase())
  await captcha.getByRole('button', { name: '입력완료' }).click()
  await expect(captcha).toBeHidden()

  await page.getByRole('button', { name: '일정변경' }).click()
  await page.getByRole('button', { name: '다음' }).click()
  await expect(
    page.getByRole('dialog', { name: '안심예매' }),
    '일정변경 후 보안문자를 다시 묻지 않음',
  ).toBeHidden()

  await page.locator('g.cursor-pointer').first().click()
  const result = page.getByRole('heading', { name: '예매 결과 분석' })
  for (let attempt = 0; attempt < 20 && !(await result.isVisible()); attempt++) {
    await page.locator('circle.cursor-pointer').first().click()
    await page.getByRole('button', { name: '선택 완료' }).click()
  }

  await expect(result).toBeVisible()
  await expect(page.getByText('오답 1회')).toBeVisible()
})

test('좌석 선택 시간이 지나면 예매 실패를 보여준다', async ({ page }) => {
  await page.clock.install()
  await enterBookingWindow(page)
  await expect(page.getByText('10:00')).toBeVisible()

  await page.clock.fastForward('10:01')

  await expect(page.getByRole('heading', { name: '좌석 선택 시간이 초과되었어요' })).toBeVisible()
})
