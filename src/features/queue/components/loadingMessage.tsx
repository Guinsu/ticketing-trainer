interface LoadingMessageProps {
  title: string
  subtitle?: string
}

/**
 * LoadingMessage
 * @description 대기 순서 확인, 예매 화면 로딩 등 전체 화면 안내 문구
 */
const LoadingMessage = ({ title, subtitle }: LoadingMessageProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <p className="text-3xl leading-none font-black tracking-tight italic">
        TICKET<span className="text-primary">RUN</span>
      </p>
      <p className="mt-6 text-lg font-bold">{title}</p>
      {subtitle && <p className="text-lg font-bold text-primary">{subtitle}</p>}
    </div>
  )
}

export default LoadingMessage
