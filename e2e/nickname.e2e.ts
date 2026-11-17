import { expect, test, type Page } from '@playwright/test'

// 헤더는 Supabase를 닉네임 등록 순간에 불러온다, 그 경로로 등록과 중복 안내가 동작하는지 확인
const mockProfiles = (page: Page, status: number, body: unknown) =>
  page.route('**/rest/v1/profiles*', (route) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) }),
  )

test('닉네임을 등록하면 헤더에 닉네임이 보인다', async ({ page }) => {
  await mockProfiles(page, 201, null)
  await page.goto('/')

  await page.getByPlaceholder('닉네임을 입력하세요').fill('e2e-user')
  await page.getByRole('button', { name: '닉네임 등록' }).click()

  await expect(page.getByText('e2e-user')).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('nickname'))).toBe('e2e-user')
})

test('이미 있는 닉네임이면 중복 안내를 보여준다', async ({ page }) => {
  await mockProfiles(page, 409, { code: '23505', message: 'duplicate key value' })
  await page.route('**/rest/v1/error_logs*', (route) => route.fulfill({ status: 201 }))
  await page.goto('/')

  await page.getByPlaceholder('닉네임을 입력하세요').fill('taken')
  await page.getByRole('button', { name: '닉네임 등록' }).click()

  await expect(page.getByRole('alert')).toHaveText('이미 사용 중인 닉네임입니다.')
})
