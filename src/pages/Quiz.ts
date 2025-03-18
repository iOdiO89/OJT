import { Canvas, Group } from 'fabric'
import { quizData } from '../libs/dummy'
import { renderTitle } from '../components/quiz/title'
import { renderOptions } from '../components/quiz/options'
import { renderAnswerButton } from '../components/quiz/answerButton'
import { getOptionStyle } from '../utils/getOptionStyle'
import { CANVAS } from '../libs/constants'
import { renderImageOptions } from '../components/quiz/imageOptions'

export default async function Quiz(): Promise<HTMLElement> {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const quizNum = Number(urlParams.get('no'))
  const quizIndex = quizNum - 1
  const quizType = quizData[quizIndex].type

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
  const questionText = renderTitle(canvas, `${quizNum}. ${quizData[quizIndex].question}`)
  const questionEndPos = questionText.top + questionText.height

  let inputOptions: Group[] = []
  if (quizData[quizIndex].images)
    inputOptions = await renderImageOptions(canvas, quizData[quizIndex].images, questionEndPos + 24)

  const optionStyle = getOptionStyle(quizType)
  const [_, __, optionGroupList] = renderOptions(
    canvas,
    quizData[quizIndex].options,
    quizType,
    quizData[quizIndex].images ? questionEndPos + 300 + 72 : questionEndPos + 24,
    optionStyle?.buttonWidth,
    optionStyle?.colGap,
    optionStyle?.column
  )
  const optionEndPos = optionGroupList[optionGroupList.length - 1].top + optionGroupList[0].height

  renderAnswerButton(canvas, optionEndPos + 16, optionGroupList, quizData[quizIndex].answer, quizNum, quizType)

  return container
}
