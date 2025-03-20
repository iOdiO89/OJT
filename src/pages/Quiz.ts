import { Canvas } from 'fabric'
import { quizData } from '../libs/dummy'
import { CANVAS, COLOR, SIZE } from '../libs/constants'
import { createImages } from '../components/quiz/QuizImages'
import { canvasAtom, quizAtom, store, tryCountAtom } from '../libs/atoms'
import { Title } from '../components/quiz/QuizTitle'
import { createTextBoxGrid } from '../utils/createTextBoxGrid'
import { handleOptions } from '../utils/handleOptions'
import { checkAnswer } from '../utils/checkAnswer'
import { TextBox } from '../components/shared/TextBox'
import { Option } from '../components/quiz/Option'
import { QuizImage } from '../components/quiz/QuizImage'
import { goToNextPage } from '../utils/goToNextPage'

export default async function Quiz(): Promise<HTMLElement> {
  /* Query Parameter에서 문제 번호 추출 */
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  const quizNum = Number(urlParams.get('no'))

  /* 도전 가능 횟수 초기화 */
  store.set(tryCountAtom, 3)

  /* quizAtom에 현재 문제 데이터 저장 */
  const currentQuizData = quizData[quizNum - 1]
  store.set(quizAtom, currentQuizData)

  /* 캔버스 삽입 및 canvasAtom에 canvas 저장 */
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

  /* 문제 제목 삽입 */
  const title = new Title(`${quizNum}. ${currentQuizData.question}`)
  const titleText = title.getTextObject()
  canvas.add(titleText)

  const questionEndPos = titleText.top + titleText.height

  /* 이미지 삽입 (이미지가 있는 문제인 경우) */
  let images, imagesEndPos
  if (currentQuizData.images) {
    images = await createImages(currentQuizData.images, questionEndPos + 24)
    images.forEach(image => canvas.add(image.getGroupObject()))

    imagesEndPos = images[0].getGroupObject().top + images[0].getGroupObject().height
  }

  /* 드래그 앤 드랍할 위치 생성 (드래그 문제인 경우) */
  let labels, labelEndPos
  if (currentQuizData.type === 'DRAG') {
    const labelCol = currentQuizData.answer.length
    labels = createTextBoxGrid(
      Option,
      Array(labelCol).fill('?'),
      (imagesEndPos ?? questionEndPos) + 24,
      labelCol,
      SIZE.GAP_XS,
      SIZE.GAP_SM,
      {},
      { fill: COLOR.SUPER_LIGHT_GRAY }
    )
    labels.forEach(label => canvas.add(label.getGroupObject()))

    labelEndPos = labels[0].getGroupObject().top + labels[0].getGroupObject().height
  }

  /* 선택지 생성 */
  const optionStartPos = (labelEndPos ?? imagesEndPos ?? questionEndPos) + 48
  const optionCol = currentQuizData.type === 'MATH' ? 10 : 3
  const options = createTextBoxGrid(
    Option,
    currentQuizData.options,
    optionStartPos,
    optionCol,
    currentQuizData.type === 'DRAG' ? SIZE.GAP_XS : SIZE.GAP_SM,
    currentQuizData.type === 'MATH' ? SIZE.GAP_S : SIZE.GAP_SM,
    {},
    { stroke: COLOR.GRAY, strokeWidth: 2, ...(currentQuizData.type === 'MATH' && { width: 62 }) }
  )
  options.forEach(option => canvas.add(option.getGroupObject()))

  const optionCount = options.length
  const optionEndPos = options[optionCount - 1].getGroupObject().top + options[optionCount - 1].getGroupObject().height

  /* 채점 버튼 생성 */
  const checkButton = new TextBox('채점하기')
  checkButton.setText({ fill: 'white', fontSize: 20 })
  checkButton.setRect({ fill: COLOR.PURPLE, rx: 24, ry: 24, width: 180 })
  checkButton.setGroup({ top: optionEndPos + 24, left: (CANVAS.WIDTH - checkButton.getGroupObject().width) / 2 })
  canvas.add(checkButton.getGroupObject())

  const checkButtonEndPosX = checkButton.getGroupObject().left + checkButton.getGroupObject().width
  const checkButtonEndPos = checkButton.getGroupObject().top + checkButton.getGroupObject().height

  /* 다음 문제 버튼 생성 */
  const nextButton = await QuizImage.create('/images/right-arrow.svg', checkButton.getGroupObject().height, 0)
  nextButton.setRect({ stroke: COLOR.PURPLE, fill: 'white', rx: 24, ry: 24 })
  nextButton.setGroup({
    left: checkButtonEndPosX + SIZE.GAP_XL * 2,
    top: optionEndPos + 24,
    opacity: 0,
    visibility: false
  })
  canvas.add(nextButton.getGroupObject())

  /* 토스트 메시지 생성 */
  const toast = new TextBox('')
  toast.setText({ fill: COLOR.PURPLE, fontSize: 20 })
  toast.setRect({ fill: 'white', stroke: COLOR.PURPLE, rx: 24, ry: 24 })
  toast.setGroup({
    originX: 'center',
    top: checkButtonEndPos + 20,
    left: CANVAS.WIDTH / 2,
    opacity: 0,
    visibility: false
  })
  canvas.add(toast.getGroupObject())

  /* options event 정의 - 선택지 토글, 드래그앤드롭 기능 정의 */
  handleOptions(canvas, currentQuizData.type, options, labels)

  /* checkButton event 정의 - 정답 여부 판별 및 정오답 표시 기능 */
  checkAnswer(checkButton, options, toast, nextButton, currentQuizData.type === 'DRAG' ? labels : undefined)

  /* nextButton event 정의 - 다음 페이지(다음 문제 or 레포트 페이지)로 이동 */
  goToNextPage(quizNum, nextButton)

  return container
}
