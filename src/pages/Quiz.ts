import { Canvas } from 'fabric'
import { quizData } from '../libs/dummy'
import { renderOptions } from '../components/quiz/options'
import { renderAnswerButton } from '../components/quiz/answerButton'
import { getOptionStyle } from '../utils/getOptionStyle'
import { CANVAS } from '../libs/constants'
import { renderImageOptions } from '../components/quiz/imageOptions'
import { canvasAtom, quizAtom, store } from '../libs/atoms'
import { Title } from '../components/quiz/QuizTitle'

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
    height: CANVAS.HEIGHT
  })
  store.set(canvasAtom, canvas)

  const title = new Title(`${quizNum}. ${currentQuizData.question}`)
  const titleText = title.getTextObject()
  canvas.add(titleText)
  const questionEndPos = titleText.top + titleText.height

  let images, imagesEndPos
  if (currentQuizData.images) {
    images = await createImages(currentQuizData.images, questionEndPos + 24)
    images.forEach(image => canvas.add(image.getGroupObject()))

  let optionStartPos = questionEndPos + 24
  if (currentQuizData.images) optionStartPos += 300 + 48
    imagesEndPos = images[0].getGroupObject().top + images[0].getGroupObject().height
  }

  const optionStyle = getOptionStyle(currentQuizData.type)
  const [, , optionGroupList] = renderOptions(optionStartPos, optionStyle, inputOptions)
  const optionEndPos = optionGroupList[optionGroupList.length - 1].top + optionGroupList[0].height

  renderAnswerButton(optionEndPos + 16, quizNum, optionGroupList, inputOptions)

  return container
}
