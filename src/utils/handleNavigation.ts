import { QuizImage } from '../components/quiz/QuizImage'
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

/**
 * 다음 페이지로 이동하는 함수
 *
 * @param quizNum - 현재 퀴즈 번호
 * @param nextButton - 다음 페이지로 넘어가는 버튼
 *
 * 버튼 클릭 시:
 *  - 마지막 문제인 경우: 리포트 페이지로 이동
 *  - 마지막 문제가 아닌 경우: 다음 퀴즈 페이지로 이동
 */
export const goToNextPage = (quizNum: number, nextButton: QuizImage) => {
  nextButton.on('mouseover', () => {
    nextButton.setGroup({ hoverCursor: 'pointer' })
  })

  nextButton.on('mousedown', () => {
    if (quizNum === QUIZ_COUNT) changeUrl(PATH.REPORT)
    else changeUrl(`${PATH.QUIZ}?no=${quizNum + 1}`)
  })
}
