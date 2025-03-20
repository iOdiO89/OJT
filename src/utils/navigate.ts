import { QuizImage } from '../components/quiz/QuizImage'
import { PATH, QUIZ_COUNT } from '../libs/constants'
import changeUrl from './router'

export const goToNextPage = (quizNum: number, nextButton: QuizImage) => {
  nextButton.on('mouseover', () => {
    nextButton.setGroup({ hoverCursor: 'pointer' })
  })

  nextButton.on('mousedown', () => {
    if (quizNum === QUIZ_COUNT) changeUrl(PATH.REPORT)
    else changeUrl(`${PATH.QUIZ}?no=${quizNum + 1}`)
  })
}
