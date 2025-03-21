import { Canvas, Line } from 'fabric'
import { CANVAS, COLOR, REPORT } from '../libs/constants'
import { Title } from '../components/quiz/QuizTitle'
import { TextBox } from '../components/shared/TextBox'
import { createReportRow } from '../utils/createReportRow'
import { getQuizHistory } from '../utils/handleQuizHistory'
import { goToStartPage } from '../utils/handleNavigation'

export default function Report(): HTMLElement {
  /* 캔버스 삽입 */
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
    backgroundColor: 'white'
  })

  /* 문제 제목 삽입 */
  const title = new Title('< 문제 풀이 보고서 >')
  title.setText({
    left: (CANVAS.WIDTH - title.getTextObject().width) / 2,
    fontSize: 28,
    fontWeight: 800
  })
  canvas.add(title.getTextObject())

  const questionEndPos = title.getTextObject().top + title.getTextObject().height

  /* 문제 풀이 기록 table 삽입 */
  let currentTop = questionEndPos + 48
  const topLine = new Line([0, currentTop, REPORT.WIDTH.TOTAL, currentTop], {
    stroke: COLOR.GRAY,
    strokeWidth: 1,
    selectable: false,
    left: (CANVAS.WIDTH - REPORT.WIDTH.TOTAL) / 2
  })
  canvas.add(topLine)

  const histories = getQuizHistory()
  histories.forEach((record, index) => {
    const row = createReportRow(index, record, currentTop)
    row.set({ left: (CANVAS.WIDTH - REPORT.WIDTH.TOTAL) / 2 })
    canvas.add(row)
    currentTop += REPORT.HEIGHT
  })

  /* 처음으로 돌아가는 버튼 삽입 */
  const navigateButton = new TextBox('처음으로')
  navigateButton.setText({ fill: 'white', fontSize: 20 })
  navigateButton.setRect({ fill: COLOR.PURPLE, rx: 24, ry: 24, width: 180 })
  navigateButton.setGroup({ top: currentTop + 24, left: (CANVAS.WIDTH - navigateButton.getGroupObject().width) / 2 })
  canvas.add(navigateButton.getGroupObject())

  goToStartPage(navigateButton)

  canvas.renderAll()

  return container
}
