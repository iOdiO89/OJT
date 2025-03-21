import { Canvas, Rect, Group, util, IText } from 'fabric'
import { CANVAS, COLOR, QUIZ_COUNT } from '../../libs/constants'
import { hexToRGB } from '../../utils/hexToRGB'

/**
 * ProgressBar 클래스
 * - 진행률을 표시하는 진행 바를 생성하는 클래스
 * - 전체 진행 바의 길이는 캔버스의 너비와 같으며, 퀴즈 문제 수(QUIZ_COUNT)에 맞춰 진행 상태를 업데이트
 * - 고정 높이: 16px
 */
export class ProgressBar {
  private background: Rect /* 전체 길이 */
  private fill: Rect /* 채워진 영역 */
  private fillWidth: number = 0 /* 채워진 영역 width */
  private group: Group /* Progress Bar 전체 */

  /**
   *
   * @param quizNum - 현재 진행된 문제 번호
   */
  constructor(quizNum: number) {
    this.fillWidth = ((quizNum - 2 < 0 ? 0 : quizNum - 2) / QUIZ_COUNT) * CANVAS.WIDTH

    this.background = new Rect({
      width: CANVAS.WIDTH,
      height: 16,
      fill: COLOR.SUPER_LIGHT_GRAY,
      selectable: false,
      rx: 8,
      ry: 8
    })

    this.fill = new Rect({
      width: this.fillWidth,
      height: 16,
      fill: hexToRGB(COLOR.PURPLE),
      selectable: false,
      rx: 8,
      ry: 8
    })

    this.group = new Group([this.background, this.fill], {
      selectable: false
    })
  }

  /**
   * 진행률 업데이트하는 함수
   * - 이전 문제 진행률 -> 현재 문제 진행률로 Progress Bar 업데이트
   *
   * @param canvas
   * @param quizNum - 현재 진행된 문제 번호
   */
  public add(canvas: Canvas, quizNum: number): void {
    const newWidth = ((quizNum - 1) / QUIZ_COUNT) * CANVAS.WIDTH

    util.animate({
      startValue: this.fillWidth,
      endValue: newWidth,
      duration: 1000,
      easing: util.ease.easeOutQuad,
      onChange: (value: number) => {
        this.fill.set({ width: value })
        this.fill.setCoords()
        canvas.renderAll()
      }
    })

    this.fillWidth = newWidth
  }

  /**
   * 그룹(Group) 객체 반환
   * @returns Group 객체
   */
  public getGroupObject(): Group {
    return this.group
  }
}
