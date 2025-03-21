import { Circle, FabricObject, Group, IText, Line, Path } from 'fabric'
import { COLOR, REPORT } from '../libs/constants'
import { hexToRGB } from './hexToRGB'

/**
 * history 객체 기반으로 보고서 행을 생성하는 함수
 * - '문제 번호' > '문제 주제' > '정답' 순서로 표시
 * - 틀린 정답은 빨간색으로 표시
 *
 * @param index - 문제 index(0부터 시작)
 * @param history - 현재 행에 표시할 문제 풀이 기록
 * @param startPos - 시작 Y값
 * @returns
 */
export const createReportRow = (index: number, history: QuizHistory, startPos: number): Group => {
  /* 문제 번호 */
  const indexText = new IText(`${index + 1}`, {
    fontSize: 20,
    left: REPORT.WIDTH.INDEX / 2,
    top: startPos + REPORT.HEIGHT / 2,
    originX: 'center',
    originY: 'center',
    fontFamily: 'NanumSquareRound',
    selectable: false
  })

  /* O/X 표시 */
  let mark: FabricObject
  if (history.isAllCorrect) {
    mark = new Circle({
      radius: 14,
      stroke: hexToRGB(COLOR.GREEN, 0.5),
      strokeWidth: 5,
      fill: '',
      left: REPORT.WIDTH.INDEX / 2,
      top: startPos + REPORT.HEIGHT / 2,
      originX: 'center',
      originY: 'center'
    })
  } else {
    const pathData = 'M -12 -12 L 12 12 M -12 12 L 12 -12'

    mark = new Path(pathData, {
      stroke: hexToRGB(COLOR.RED, 0.6),
      strokeWidth: 5,
      fill: '',
      left: REPORT.WIDTH.INDEX / 2,
      top: startPos + REPORT.HEIGHT / 2,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    })
  }

  const indexGroup = new Group([indexText, mark], { selectable: false })

  /* 주제 */
  const topicText = new IText(history.topic, {
    fontSize: 20,
    left: REPORT.WIDTH.INDEX + REPORT.COL_GAP,
    top: startPos + REPORT.HEIGHT / 2,
    originY: 'center',
    fontFamily: 'NanumSquareRound',
    selectable: false
  })

  /* 정답 */
  const answers = history.answer.map(
    (ans, i) =>
      new IText(ans, {
        fontSize: 20,
        fill: history.isCorrect[i] ? 'black' : COLOR.RED,
        fontFamily: 'NanumSquareRound',
        selectable: false
      })
  )

  /* 정답 위치 조정 */
  let currentLeft = 0
  const joinedAnswers: FabricObject[] = []

  answers.forEach((answerText, i) => {
    if (i > 0) {
      const comma = new IText(', ', {
        fontSize: 20,
        fill: 'black',
        fontFamily: 'NanumSquareRound',
        selectable: false,
        left: currentLeft
      })
      joinedAnswers.push(comma)
      currentLeft += comma.width ?? 0
    }
    answerText.set({ left: currentLeft })
    joinedAnswers.push(answerText)
    currentLeft += answerText.width ?? 0
  })

  /* 정답 그룹 - 오른쪽 정렬 */
  const answerGroup = new Group(joinedAnswers, {
    left: REPORT.WIDTH.TOTAL - 20,
    top: startPos + REPORT.HEIGHT / 2,
    originX: 'right',
    originY: 'center',
    selectable: false
  })

  const divider = new Line([0, startPos + REPORT.HEIGHT, REPORT.WIDTH.TOTAL, startPos + REPORT.HEIGHT], {
    stroke: COLOR.GRAY,
    strokeWidth: 1,
    selectable: false
  })

  const rowGroup = new Group([indexGroup, topicText, answerGroup, divider], {
    selectable: false
  })

  return rowGroup
}
