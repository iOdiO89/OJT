import { Canvas, IText } from 'fabric'
import { quizData } from '../libs/dummy'
import { createDefaultButton, createOptionButtons, getObjectSize } from '../libs/createElement'
import { renderAnswerButton } from '../components/answerButton'

export default function Quiz(): HTMLElement {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const quizNum = Number(urlParams.get('no'))
  const quizIndex = quizNum - 1
  const quizType = quizData[quizIndex].type
  console.log({ quizType })

  const container = document.createElement('main')
  container.innerHTML = `
    <canvas id=canvas></canvas>
  `
  const canvasEl = container.querySelector('canvas')
  const canvas = new Canvas(canvasEl as HTMLCanvasElement, {
    defaultCursor: 'default',
    hoverCursor: 'default',
    width: 800,
    height: 500,
  })
  const questionText = new IText(quizData[quizIndex].question, {
    fontSize: 24,
    selectable: false,
  })
  const [_, questionHeight] = getObjectSize(questionText)
  canvas.add(questionText)

  const [__, optionRectList, optionGroupList] = createOptionButtons(
    quizData[quizIndex].options,
    quizType,
    canvas,
    questionHeight
  )
  const optionEndPos = optionGroupList[optionGroupList.length - 1].top + optionGroupList[0].height
  renderAnswerButton(canvas, optionEndPos + 40, optionGroupList, quizData[quizIndex].answer, quizNum)

  return container
}
