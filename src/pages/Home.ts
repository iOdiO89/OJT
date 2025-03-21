import { Canvas, IText } from 'fabric'
import { CANVAS, COLOR, DESCRIPTION } from '../libs/constants'
import { Title } from '../components/quiz/QuizTitle'
import { TextBox } from '../components/shared/TextBox'
import { handleScreenSize } from '../utils/handleScreenSize'
import { startQuiz } from '../utils/handleNavigation'

export default function Home(): HTMLElement {
  /* 캔버스 삽입 */
  const container = document.createElement('main')
  container.innerHTML = `
    <canvas id=canvas></canvas>
  `

  const canvasEl = container.querySelector('canvas')
  const canvas = new Canvas(canvasEl as HTMLCanvasElement, {
    defaultCursor: 'default',
    hoverCursor: 'default',
    width: 800,
    height: CANVAS.HEIGHT,
    backgroundColor: 'white'
  })

  /* 문제 제목 삽입 */
  const title = new Title('문제 풀기')
  title.setText({
    left: (CANVAS.WIDTH - title.getTextObject().width) / 2,
    fontSize: 28,
    fontWeight: 800
  })
  const titleEndPos = title.getTextObject().top + title.getTextObject().height
  canvas.add(title.getTextObject())

  /* 문제 설명 삽입 */
  const descriptions: IText[] = []
  DESCRIPTION.forEach((line, index) => {
    const lineText = new IText(line, {
      fontSize: 20,
      left: CANVAS.WIDTH / 2,
      top: titleEndPos + 48 + index * 30,
      originX: 'center',
      fontFamily: 'NanumSquareRound',
      selectable: false
    })
    descriptions.push(lineText)
  })
  descriptions.forEach(description => canvas.add(description))
  const descriptionEndPos = descriptions[descriptions.length - 1].height + descriptions[descriptions.length - 1].top

  /* 처음으로 돌아가는 버튼 삽입 */
  const navigateButton = new TextBox('시작하기')
  navigateButton.setText({ fill: 'white', fontSize: 20 })
  navigateButton.setRect({ fill: COLOR.PURPLE, rx: 24, ry: 24, width: 180 })
  navigateButton.setGroup({
    top: descriptionEndPos + 48,
    left: (CANVAS.WIDTH - navigateButton.getGroupObject().width) / 2
  })
  canvas.add(navigateButton.getGroupObject())

  /* 컨텐츠 크기에 맞춰 canvas 크기 조정 */
  const contentEndPos = navigateButton.getGroupObject().top + navigateButton.getGroupObject().height
  canvas.setHeight(contentEndPos)

  /* nextButton event 정의 - 다음 페이지(다음 문제 or 레포트 페이지)로 이동 */
  startQuiz(navigateButton)

  /* 화면 크기가 캔버스 크기보다 작은 경우 오버레이 표시 */
  handleScreenSize(canvas)

  canvas.renderAll()

  return container
}
