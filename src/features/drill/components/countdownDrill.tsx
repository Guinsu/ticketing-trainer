export default function CountdownDrill() {
  const totalRounds = 5
  return (
    <section className="bg-purple-300 min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            카운트다운
            <span className="text-purple-800 pl-4">버튼 클릭 연습</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            카운트다운이 끝나면 버튼을 클릭하는 연습을 통해 더 빠른 반응 속도를 만들어보세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-[2]">
            <div className="flex flex-1 rounded-xl flex-col border-white border-2 bg-white">
              <div className="mx-3 my-3 flex flex-1 flex-col">
                <div className="flex gap-2.5 text-2xl">
                  <p className="px-3.5 bg-purple-800 rounded-2xl text-white">01</p>
                  <h2 className="font-extrabold">카운트다운 버튼 클릭 연습</h2>
                </div>

                <div className="flex flex-1 flex-col gap-4 bg-gray-200 rounded-xl mt-3 p-5"></div>
              </div>
            </div>
          </div>

          <aside className="min-w-0 border-white border bg-white rounded-xl p-6 lg:flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">현재기록</h2>
              <p className="text-3xl font-extrabold">
                <span className="text-slate-900">/ {totalRounds}</span>
              </p>
            </div>

            <div className="mt-5 border-t border-purple-100 pt-5">
              <h3 className="mb-3 font-bold text-purple-600">연습 기록</h3>

              <ol className="space-y-1">
                {Array.from({ length: totalRounds }, (_, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2 text-sm`}
                  >
                    <span>{index + 1}번</span>
                    <span>진행 중</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-purple-100 pt-5">
                <div className="rounded-xl bg-purple-50 p-4 text-center">
                  <h3 className="text-sm font-semibold text-purple-700">최고 반응 속도</h3>
                  <p className="mt-2 text-2xl font-extrabold text-purple-600">
                    <span className="ml-1 text-sm">초</span>
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4 text-center">
                  <h3 className="text-sm font-semibold text-indigo-700">평균 반응 속도</h3>
                  <p className="mt-2 text-2xl font-extrabold text-indigo-600">
                    <span className="ml-1 text-sm">초</span>
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
