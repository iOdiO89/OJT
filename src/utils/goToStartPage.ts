import { TextBox } from '../components/shared/TextBox'
import { PATH } from '../libs/constants'
import { clearQuizHistory } from './handleQuizHistory'
import changeUrl from './router'

/**
 * 처음 페이지로 돌아가는 함수
 *
 * @param navigateButton - '처음으로' 버튼 객체
 *
 */
export const goToStartPage = (navigateButton: TextBox) => {
  navigateButton.on('mouseover', () => {
    navigateButton.setGroup({ hoverCursor: 'pointer' })
  })

  navigateButton.on('mousedown', () => {
    clearQuizHistory()
    changeUrl(PATH.HOME)
  })
}
