import { useId, type ReactNode, type Ref } from 'react'

interface ModalProps {
  ref: Ref<HTMLDialogElement>
  title?: string
  children?: ReactNode
}

/**
 * 공통 모달 사용법
 
 * import { useRef } from 'react'
 * import Modal from '@/common/components/modal'
 *
 * export default function ExampleScreen() {
 *   const modalRef = useRef<HTMLDialogElement>(null)
 *
 *   return (
 *     <>
 *       <button type="button" onClick={() => modalRef.current?.showModal()}>
 *         모달 열기
 *       </button>
 *       <Modal ref={modalRef} title="title 내용 입력">
 *         <p className="mt-4">화면별 내용을 입력하세요.</p>
 *         <button type="button" onClick={() => modalRef.current?.close()}>
 *           확인
 *         </button>
 *       </Modal>
 *     </>
 *   )
 * }
 
 */

export default function Modal({ ref, title, children }: ModalProps) {
  const titleId = useId()

  return (
    <dialog
      ref={ref}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : '모달'}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          event.currentTarget.close()
        }
      }}
      className="fixed inset-0 m-auto min-h-64 max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-3xl border-0 bg-white p-6 text-slate-900 shadow-2xl backdrop:bg-slate-950/50 sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        {title && (
          <h2 id={titleId} className="text-2xl font-extrabold">
            {title}
          </h2>
        )}
        <form method="dialog" className="ml-auto">
          <button
            aria-label="모달 닫기"
            className="flex h-8 w-8 items-center justify-center rounded-full text-2xl leading-none text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-purple-600"
          >
            <span aria-hidden="true">×</span>
          </button>
        </form>
      </div>
      {children}
    </dialog>
  )
}
