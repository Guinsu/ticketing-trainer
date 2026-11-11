import { expect, test, type Locator, type Page } from '@playwright/test'
import { captchaDialog, enterBookingWindow, passCaptcha } from './flow'

test.use({ viewport: { width: 375, height: 740 }, hasTouch: true })

const expectNoHorizontalScroll = async (page: Page, screen: string) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  )
  expect(overflow, `${screen} 가로 스크롤 없음`).toBeLessThanOrEqual(0)
}

const expectInViewport = async (locator: Locator, what: string) => {
  const box = await locator.boundingBox()
  const height = locator.page().viewportSize()!.height
  expect(box, what).not.toBeNull()
  expect(box!.y + box!.height, `${what} 화면 안에 보임`).toBeLessThanOrEqual(height)
}

test('휴대폰 폭에서 스크롤 없이 실전연습을 진행할 수 있다', async ({ page }) => {
  await page.goto('/')
  await expectNoHorizontalScroll(page, '홈')

  await enterBookingWindow(page)
  await expectNoHorizontalScroll(page, '보안문자')
  await expectInViewport(
    captchaDialog(page).getByRole('button', { name: '입력완료' }),
    '보안문자 입력완료',
  )
  await passCaptcha(page)
  await expectNoHorizontalScroll(page, '구역 선택')

  await page.locator('g.cursor-pointer').first().click()
  await expectNoHorizontalScroll(page, '좌석 선택')
  const seat = page.locator('circle.cursor-pointer').first()
  const seatBox = await seat.boundingBox()
  expect(seatBox!.width, '좌석이 누를 만한 크기').toBeGreaterThanOrEqual(14)

  await seat.tap()
  await expectInViewport(page.getByRole('button', { name: '선택 완료' }), '선택 완료 버튼')
})
