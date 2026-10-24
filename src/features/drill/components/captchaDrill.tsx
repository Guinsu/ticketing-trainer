import { useRef } from 'react'
import Modal from '@/common/components/modal'

export default function CaptchaDrill() {
  const resultModalRef = useRef<HTMLDialogElement>(null)

  return (
    <section className="bg-purple-300 min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            보안문자
            <span className="text-purple-800 pl-4">연습</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            실제 예매와 동일한 형태의 보안문자를 반복 연습하고, 속도와 정확도를 높여보세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-[2]">
            <div className="flex flex-1 rounded-xl flex-col border-white border-2 bg-white">
              <div className="mx-3 my-3 flex flex-1 flex-col">
                <div className="flex gap-2.5 text-2xl">
                  <p className="px-3.5 bg-purple-800 rounded-2xl text-white">01</p>
                  <h2 className="font-extrabold">보안문자 입력 연습</h2>
                </div>

                <div className="flex flex-1 flex-col gap-4 bg-gray-200 rounded-xl mt-3 p-5">
                  <div className="flex h-48 items-center justify-center rounded-xl bg-white text-purple-700">
                    연습 시작 버튼을 눌러주세요.
                  </div>

                  <input
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={6}
                    placeholder="보안문자를 입력하세요."
                    aria-label="보안문자 입력"
                    className="rounded-xl border border-purple-200 bg-white px-4 py-3 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    className="rounded-xl bg-purple-600 py-4 text-lg font-bold text-white"
                  >
                    연습 시작
                  </button>
                  <button
                    type="button"
                    onClick={() => resultModalRef.current?.showModal()}
                    className="mt-3 text-sm font-semibold text-purple-800 underline"
                  >
                    modal창
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="min-w-0 border-white border bg-white rounded-xl p-6 lg:flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">현재기록</h2>
              <p className="text-3xl font-extrabold">
                <span className="text-purple-600 mr-2">1</span>
                <span className="text-slate-900">/ 5</span>
              </p>
            </div>

            <div className="mt-5 border-t border-purple-100 pt-5">
              <h3 className="mb-3 font-bold text-purple-600">연습 기록</h3>

              <ol className="space-y-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-purple-100 px-4 py-2 text-sm text-indigo-900"
                  >
                    <span>{index + 1}번</span>
                    <span>00:00</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
      <Modal ref={resultModalRef} />
    </section>
  )
}
