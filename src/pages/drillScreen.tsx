/**
 * DrillScreen
 * @description 개별 연습 페이지 Screen 컴포넌트, 경로 '/drill/:type'
 */

import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import CancelTicketDrill from '@/features/drill/components/cancelTicketDrill'
import TargetSeatDrill from '@/features/drill/components/targetSeatDrill'
import CountdownDrill from '@/features/drill/components/countdownDrill'
import CaptchaDrill from '@/features/drill/components/captchaDrill'

const DrillScreen = () => {
  const { type } = useParams()

  if (type === 'target-seat') {
    return <TargetSeatDrill />
  }

  if (type === 'cancel-ticket') {
    return <CancelTicketDrill />
  }

  if (type === 'countdown') {
    return <CountdownDrill />
  }

  if (type === 'captchaDrill') {
    return <CaptchaDrill />
  }

  return (
    <section className="min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl ">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            연습
            <span className="text-purple-800 pl-4">모드</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            예매에 필요한 각 기능을 반복 연습하고, 속도와 정확도를 높여보세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <div className="flex items-start gap-2.5 text-xl xl:text-2xl">
              <p className="shrink-0 px-3.5 bg-purple-800 rounded-2xl text-white">01</p>
              <h2 className="font-extrabold">보안문자 입력 연습</h2>
            </div>

            {/* 보안문자 연습*/}
            <div className="flex flex-1 flex-col gap-3">
              <div className="mt-3 h-[clamp(140px,24vh,220px)] shrink-0 rounded-xl bg-purple-50">
                {/* 연습 미리보기 이미지 추가 예정 */}
              </div>
              <div className="mt-1">
                <h3 className="font-extrabold">보안문자 연습</h3>
                <p className="mt-1 text-gray-500 text-base sm:text-[15px]">
                  실제 예매와 동일한 형태의 보안문자를 반복해서 연습해보세요.
                </p>
              </div>
              <div className="space-y-3 rounded-xl bg-gray-200 px-4 py-10">
                <p>1. 입력 시간 측정</p>
                <p>2. 정확도 및 오답률 분석</p>
                <p>3. 다양한 유형의 보안문자 제공</p>
              </div>

              <Link
                to="/drill/captchaDrill"
                className="mt-auto block rounded-xl bg-purple-600 py-3 text-lg font-bold text-white text-center"
              >
                연습 시작하기
              </Link>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <div className="flex items-start gap-2.5 text-xl xl:text-2xl">
              <p className="shrink-0 px-3.5 bg-purple-800 rounded-2xl text-white">02</p>
              <h2 className="font-extrabold">좌석 선택 연습</h2>
            </div>

            {/* 좌석 선택 연습*/}
            <div className="flex flex-1 flex-col gap-3">
              <div className="mt-3 h-[clamp(140px,24vh,220px)] shrink-0 rounded-xl bg-purple-50">
                {/* 연습 미리보기 이미지 추가 예정 */}
              </div>
              <div className="mt-1">
                <h3 className="font-extrabold">좌석 선택 연습</h3>
                <p className="mt-1 text-gray-500 text-base sm:text-[15px]">
                  지정 좌석 선택과 취소표 잡기 연습을 통해 빠르고 정확하게 좌석을 선택해 보세요.
                </p>
              </div>

              <div className="bg-gray-200 rounded-xl px-4 py-2">
                <p>1. 지정 좌석 선택 연습 정해진 좌석을 빠르게 선택하는 연습입니다.</p>
                <p>2. 취소표 잡기 연습 실시간으로 열리는 좌석을 빠르게 선택하는 연습입니다.</p>
              </div>

              <Link
                to="/drill/target-seat"
                className="mt-auto block rounded-xl bg-purple-600 py-3 text-lg font-bold text-white text-center"
              >
                지정 좌석 선택 연습
              </Link>

              <Link
                to="/drill/cancel-ticket"
                className="mt-auto block rounded-xl bg-purple-600 py-3 text-lg font-bold text-white text-center"
              >
                취소표 잡기 연습
              </Link>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <div className="flex items-start gap-2.5 text-xl xl:text-2xl">
              <p className="shrink-0 px-3.5 bg-purple-800 rounded-2xl text-white">03</p>
              <h2 className="font-extrabold">카운트다운 버튼 클릭 연습</h2>
            </div>

            {/* 카운트다운 버튼 클릭 연습*/}
            <div className="flex flex-1 flex-col gap-3">
              <div className="mt-3 h-[clamp(140px,24vh,220px)] shrink-0 rounded-xl bg-purple-50">
                {/* 연습 미리보기 이미지 추가 예정 */}
              </div>
              <div className="mt-1">
                <h3 className="font-extrabold">카운트다운 버튼 클릭 연습</h3>
                <p className="mt-1 text-gray-500 text-base sm:text-[15px]">
                  정해진 시간에 버튼을 정확하고 빠르게 클릭하는 연습입니다.
                </p>
              </div>
              <div className="space-y-3 rounded-xl bg-gray-200 px-4 py-10">
                <p>1. 반응 속도 측정</p>
                <p>2. 클릭 정확도 분석</p>
                <p>3. 실제 예매와 유사한 환경 제공</p>
              </div>
              <Link
                to="/drill/countdown"
                className="mt-auto block rounded-xl bg-purple-600 py-3 text-lg font-bold text-white text-center"
              >
                연습 시작하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DrillScreen
