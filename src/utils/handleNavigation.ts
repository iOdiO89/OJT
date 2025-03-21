import { TextBox } from '../components/shared/TextBox'
import { PATH, QUIZ_COUNT } from '../libs/constants'
import { clearQuizHistory } from './handleQuizHistory'
import changeUrl from './router'

/**
 * 문제 풀이 시작 함수
 *
 * @param navigateButton - '시작하기' 버튼 객체
 *
 */
export const startQuiz = (navigateButton: TextBox) => {
  navigateButton.on('mouseover', () => {
    navigateButton.setGroup({ hoverCursor: 'pointer' })
  })

  navigateButton.on('mousedown', () => {
    clearQuizHistory()
    changeUrl(`${PATH.QUIZ}?no=1`)
  })
}
