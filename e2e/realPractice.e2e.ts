import { expect, test } from '@playwright/test'
import { captchaDialog, completeSeat, enterBookingWindow, passCaptcha } from './flow'

test('홈에서 결과까지 실전연습을 끝낸다', async ({ page }) => {
  await enterBookingWindow(page)

  const captcha = captchaDialog(page)
  await captcha.getByLabel('보안문자 입력').fill('WRONG1')
  await captcha.getByRole('button', { name: '입력완료' }).click()
  await expect(captcha.getByRole('alert')).toHaveText(/일치하지 않습니다/)
  await passCaptcha(page)

  await page.getByRole('button', { name: '일정변경' }).click()
  await page.getByRole('button', { name: '다음' }).click()
  await expect(captchaDialog(page), '일정변경 후 보안문자를 다시 묻지 않음').toBeHidden()

  await completeSeat(page)
  await expect(page.getByText('닉네임을 등록하면 기록이 저장되고')).toBeVisible()
  await expect(page.getByText('오답 1회')).toBeVisible()
})

test('좌석 선택 시간이 지나면 예매 실패를 보여준다', async ({ page }) => {
  await page.clock.install()
  await enterBookingWindow(page)
  await expect(page.getByText('10:00')).toBeVisible()

  await page.clock.fastForward('10:01')

  await expect(page.getByRole('heading', { name: '좌석 선택 시간이 초과되었어요' })).toBeVisible()
})
