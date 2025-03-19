import { Canvas } from 'fabric'
import { quizData } from '../libs/dummy'
import { renderAnswerButton } from '../components/quiz/answerButton'
import { CANVAS, COLOR, SIZE } from '../libs/constants'
import { createImages } from '../components/quiz/QuizImages'
import { canvasAtom, quizAtom, store } from '../libs/atoms'
import { Title } from '../components/quiz/QuizTitle'
import { createTextBoxGrid } from '../utils/createGrid'
import { handleOptions } from '../utils/handleOptions'

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

    imagesEndPos = images[0].getGroupObject().top + images[0].getGroupObject().height
  }

  let labels, labelEndPos
  if (currentQuizData.type === 'DRAG') {
    const labelCol = currentQuizData.answer.length
    labels = createTextBoxGrid(
      Array(labelCol).fill('?'),
      (imagesEndPos ?? questionEndPos) + 24,
      labelCol,
      SIZE.GAP_XS,
      SIZE.GAP_SM,
      {},
      { fill: COLOR.SUPER_LIGHT_GRAY }
    )
    labels.forEach(label => canvas.add(label.getGroupObject()))

  renderAnswerButton(optionEndPos + 16, quizNum, optionGroupList, inputOptions)
    labelEndPos = labels[0].getGroupObject().top + labels[0].getGroupObject().height
  }
  const optionStartPos = (labelEndPos ?? imagesEndPos ?? questionEndPos) + 48
  const optionCol = currentQuizData.type === 'MATH' ? 10 : 3
  const options = createTextBoxGrid(
    currentQuizData.options,
    optionStartPos,
    optionCol,
    currentQuizData.type === 'DRAG' ? SIZE.GAP_XS : SIZE.GAP_SM,
    SIZE.GAP_SM,
    {},
    { stroke: COLOR.GRAY, strokeWidth: 2 }
  )
  options.forEach(option => canvas.add(option.getGroupObject()))
  handleOptions(canvas, currentQuizData.type, options, labels)

  return container
}
