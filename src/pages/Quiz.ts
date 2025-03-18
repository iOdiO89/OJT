import { Canvas } from 'fabric'
import { quizData } from '../libs/dummy'
import { renderTitle } from '../components/quiz/title'
import { renderOptions } from '../components/quiz/options'
import { renderAnswerButton } from '../components/quiz/answerButton'
import { getOptionStyle } from '../utils/getOptionStyle'
import { CANVAS } from '../libs/constants'
import { renderImageOptions } from '../components/quiz/imageOptions'
import { canvasAtom, quizAtom, store } from '../libs/atoms'

export default async function Quiz(): Promise<HTMLElement> {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const quizNum = Number(urlParams.get('no'))

  const currentQuizData = quizData[quizNum - 1]
  store.set(quizAtom, currentQuizData)

  const container = document.createElement('main')
  container.innerHTML = `
    <canvas id=canvas></canvas>
  `
  const canvasEl = container.querySelector('canvas')
  const canvas = new Canvas(canvasEl as HTMLCanvasElement, {
    defaultCursor: 'default',
    hoverCursor: 'default',
    width: CANVAS.WIDTH,
    height: CANVAS.HEIGHT,
  })
  store.set(canvasAtom, canvas)

  const questionText = renderTitle(quizNum)
  const questionEndPos = questionText.top + questionText.height

  let inputOptions
  if (currentQuizData.images) inputOptions = await renderImageOptions(questionEndPos + 24, currentQuizData.images)

  let optionStartPos = questionEndPos + 24
  if (currentQuizData.images) optionStartPos += 300 + 48

  const optionStyle = getOptionStyle(currentQuizData.type)
  const [_, __, optionGroupList] = renderOptions(optionStartPos, optionStyle, inputOptions)
  const optionEndPos = optionGroupList[optionGroupList.length - 1].top + optionGroupList[0].height

  renderAnswerButton(optionEndPos + 16, optionGroupList, quizNum)

  return container
}
