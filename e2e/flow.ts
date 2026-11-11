import { expect, type Page } from '@playwright/test'

export const enterBookingWindow = async (page: Page) => {
  await page.goto('/')
  await page.getByRole('link', { name: '이 공연으로 연습하기' }).click()
  await page.getByRole('link', { name: '예매하기' }).click()
  await page.getByRole('button', { name: '예매하기' }).click({ timeout: 15_000 })
  await page.getByRole('button', { name: '다음' }).click({ timeout: 30_000 })
}

export const captchaDialog = (page: Page) => page.getByRole('dialog', { name: '안심예매' })

export const passCaptcha = async (page: Page) => {
  const dialog = captchaDialog(page)
  const answer = await dialog.locator('div.text-5xl > div > span').innerText()
  await dialog.getByLabel('보안문자 입력').fill(answer.toLowerCase())
  await dialog.getByRole('button', { name: '입력완료' }).click()
  await expect(dialog).toBeHidden()
}

// 선점 실패가 나면 다른 좌석으로 다시 시도, 결과 화면이 뜰 때까지
export const completeSeat = async (page: Page) => {
  const result = page.getByRole('heading', { name: '예매 결과 분석' })
  const taken = page.getByText('이미 선택된 좌석입니다')
  await page.locator('g.cursor-pointer').first().click()
  for (let attempt = 0; attempt < 20; attempt++) {
    await page.locator('circle.cursor-pointer').first().click()
    await page.getByRole('button', { name: '선택 완료' }).click()
    await expect(result.or(taken)).toBeVisible()
    if (await result.isVisible()) return
  }
  throw new Error('20번 안에 좌석을 확정하지 못함')
}
