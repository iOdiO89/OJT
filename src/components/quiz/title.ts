import { IText } from 'fabric'
import { canvasAtom, quizAtom, store } from '../../libs/atoms'

export function renderTitle(quizNum: number): IText {
  const quiz = store.get(quizAtom)
  const questionText = new IText(`${quizNum}. ${quiz.question}`, {
    fontSize: 24,
    selectable: false,
    fontFamily: 'NanumSquareRound'
  })

  const canvas = store.get(canvasAtom)
  if (canvas) canvas.add(questionText)

  return questionText
}
