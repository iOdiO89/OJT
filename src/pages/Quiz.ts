import { Canvas } from 'fabric'
import { quizData } from '../libs/dummy'
import { renderTitle } from '../components/quiz/title'
import { renderOptions } from '../components/quiz/options'
import { renderAnswerButton } from '../components/quiz/answerButton'

export default function Quiz(): HTMLElement {
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
    width: 800,
    height: 500,
  })
  const questionText = renderTitle(`${quizNum}. ${quizData[quizIndex].question}`, canvas)
  const titleEndPos = questionText.height

  const [_, __, optionGroupList] = renderOptions(quizData[quizIndex].options, quizType, titleEndPos, canvas)
  const optionEndPos = optionGroupList[optionGroupList.length - 1].top + optionGroupList[0].height

  renderAnswerButton(optionEndPos + 40, optionGroupList, quizData[quizIndex].answer, quizNum, canvas)

  return container
}
