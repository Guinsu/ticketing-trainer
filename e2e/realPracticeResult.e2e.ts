import { expect, test, type Page, type Route } from '@playwright/test'
import { completeSeat, enterBookingWindow, passCaptcha } from './flow'

const RECORD_ID = '11111111-2222-3333-4444-555555555555'
const OTHER_USER_STAGES = {
  reaction_ms: 100,
  schedule_selection_ms: 100,
  captcha_ms: 100,
  seat_selection_ms: 100,
}

// 실제 DB 대신 메모리에 저장하는 Supabase REST 흉내, 저장한 행을 그대로 다시 돌려준다
const mockSupabase = async (page: Page) => {
  const rows: Record<string, unknown>[] = []
  const reply = (route: Route, status: number, body: unknown) =>
    route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  const asSingle = (route: Route) =>
    (route.request().headers()['accept'] ?? '').includes('vnd.pgrst.object')

  await page.route('**/rest/v1/profiles?*', (route) =>
    reply(route, 200, asSingle(route) ? { id: 'user-1' } : [{ id: 'user-1' }]),
  )
  await page.route('**/rest/v1/error_logs*', (route) => reply(route, 201, null))
  await page.route('**/rest/v1/real_practice_records?*', (route) => {
    const request = route.request()
    if (request.method() === 'POST') {
      rows.push({ ...request.postDataJSON(), id: RECORD_ID })
      return reply(route, 201, asSingle(route) ? { id: RECORD_ID } : [{ id: RECORD_ID }])
    }
    if (new URL(request.url()).searchParams.get('id') === `eq.${RECORD_ID}`) {
      const row = rows[0] ?? null
      return reply(route, 200, asSingle(route) ? row : row ? [row] : [])
    }
    return reply(route, 200, [...rows, OTHER_USER_STAGES])
  })
  return rows
}

test('저장된 결과는 /result/:id에서 새로고침해도 그대로 보인다', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nickname', 'e2e-user'))
  const rows = await mockSupabase(page)

  await enterBookingWindow(page)
  await passCaptcha(page)
  await completeSeat(page)

  await expect(page).toHaveURL(`/result/${RECORD_ID}`)
  expect(rows[0]).toMatchObject({ concert_id: 'luminous-bloom-2026', captcha_misses: 0 })

  const seatText = await page.getByText(/\d+열 \d+번/).innerText()
  await page.reload()
  await expect(page.getByRole('heading', { name: '예매 결과 분석' })).toBeVisible()
  await expect(page.getByText(seatText)).toBeVisible()
  await expect(page.getByText(/평균 \d/).first()).toBeVisible()
  await expect(page.getByRole('heading', { name: '추천 집중연습' })).toBeVisible()
  await expect(page.getByRole('link', { name: /하러 가기$/ }).first()).toBeVisible()
})

test('없는 기록 주소는 찾을 수 없다고 안내한다', async ({ page }) => {
  await page.goto('/result/not-a-record')
  await expect(page.getByRole('heading', { name: '기록을 찾을 수 없어요' })).toBeVisible()
})
