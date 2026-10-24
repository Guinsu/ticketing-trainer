const OPTION_GROUPS = [
  { name: 'receive', title: '수령 방법', options: ['모바일 티켓', '현장 수령'] },
  { name: 'payment', title: '결제 수단', options: ['신용카드', '무통장입금', '간편결제'] },
]

interface PaymentStepProps {
  concertTitle: string
  scheduleText: string
}

/**
 * PaymentStep
 * @description 예매창 3단계, 예매 정보·수령 방법·결제 수단·결제 금액
 */
const PaymentStep = ({ concertTitle, scheduleText }: PaymentStepProps) => {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 lg:grid-cols-[1fr_340px]">
      <div className="space-y-6">
        <section className="border border-gray-300 p-6">
          <h2 className="text-lg font-extrabold tracking-tight">예매 정보</h2>
          <dl className="mt-4 grid grid-cols-[5rem_1fr] gap-y-2 text-sm">
            <dt className="text-gray-500">공연</dt>
            <dd>{concertTitle}</dd>
            <dt className="text-gray-500">일시</dt>
            <dd>{scheduleText}</dd>
            <dt className="text-gray-500">좌석</dt>
            <dd>R석 F1구역 3열 12번</dd>
          </dl>
        </section>

        {OPTION_GROUPS.map((group) => (
          <section key={group.name} className="border border-gray-300 p-6">
            <h2 className="text-lg font-extrabold tracking-tight">{group.title}</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {group.options.map((option, index) => (
                <label
                  key={option}
                  className="flex flex-1 cursor-pointer items-center gap-2 border border-gray-300 p-4 has-checked:border-primary has-checked:ring-1 has-checked:ring-primary"
                >
                  <input
                    type="radio"
                    name={group.name}
                    defaultChecked={index === 0}
                    className="accent-primary"
                  />
                  <span className="font-semibold whitespace-nowrap">{option}</span>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="h-fit border border-gray-300 p-6 lg:sticky lg:top-6">
        <h2 className="text-lg font-extrabold tracking-tight">결제 금액</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">티켓 금액</dt>
            <dd>154,000원</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">예매 수수료</dt>
            <dd>2,000원</dd>
          </div>
          <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
            <dt>총 결제금액</dt>
            <dd className="text-primary">156,000원</dd>
          </div>
        </dl>
        <button
          type="button"
          className="mt-6 w-full cursor-pointer bg-primary py-4 text-lg font-bold text-white hover:bg-primary-hover"
        >
          결제하기
        </button>
      </aside>
    </div>
  )
}

export default PaymentStep
