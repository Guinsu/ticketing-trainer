/**
 * DrillScreen
 * @description 개별 연습 페이지 Screen 컴포넌트, 경로 '/drill/:type'
 */

import { useParams } from 'react-router-dom'
import CaptchaDrill from '@/features/drill/components/captchaDrill'
import { CancelTicketDrill } from '@/features/drill/components/cancelTicketDrill'

const DrillScreen = () => {
  const { type } = useParams()

  if (type === 'captcha') {
    return <CaptchaDrill />
  }

  if (type === 'cancel-ticket') {
    return <CancelTicketDrill />
  }

  return <div>아직 준비중인 연습입니다.</div>
}

export default DrillScreen
