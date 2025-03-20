import { Group, Circle, Path } from 'fabric'
import { COLOR } from '../../libs/constants'
import { hexToRGB } from '../../utils/hexToRGB'
import { TextBox } from '../shared/TextBox'

/**
 * Option 클래스
 * - TextBox를 상속하여, 정답/오답 상태에 대한 표시 기능을 추가한 클래스
 * - 선택지 역할
 */
export class Option extends TextBox {
  private mark: Group | null = null /* 정오답 마크 그룹 객체 */

  /**
   * 선택지가 정답일 때의 스타일 및 표시 설정
   *
   * @param isSelected - 사용자가 선택한 정답인지 여부 (기본값: true)
   *                     선택하지 않은 정답은 점선으로 표시
   */
  public showIsCorrect(isSelected: boolean = true) {
    this.rect.set({
      fill: hexToRGB(COLOR.GREEN, 0.03),
      stroke: COLOR.GREEN,
      strokeWidth: 2,
      ...(!isSelected && { strokeDashArray: [10, 5] }) /* 선택되지 않은 정답은 점선 */
    })
    this.showCorrectMark()
  }

  /**
   * 선택지가 오답일 때의 스타일 및 표시 설정
   *
   * @param showMark - 오답 마크를 보여줄지 여부 (기본값: true)
   */
  public showIsWrong(showMark: boolean = true) {
    this.rect.set({ fill: hexToRGB(COLOR.RED, 0.03), stroke: COLOR.RED, strokeWidth: 2 }) /* 연한 빨간 배경 */
    if (showMark) this.showWrongMark()
  }

  /**
   * 정답 마크 (초록 원) 표시
   */
  public showCorrectMark() {
    if (this.mark) this.group.remove(this.mark)

    const circle = new Circle({
      radius: 14,
      stroke: hexToRGB(COLOR.GREEN, 0.5),
      strokeWidth: 7,
      fill: '',
      originX: 'center',
      originY: 'center'
    })

    const rectWidth = this.rect.width ?? 0
    const rectHeight = this.rect.height ?? 0

    this.mark = new Group([circle], {
      left: this.initLeft + rectWidth / 2,
      top: this.initTop + rectHeight / 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    })

    this.group.add(this.mark)
    this.group.bringObjectToFront(this.mark)
    this.group.setCoords()
  }

  /**
   * 오답 마크 (빨간 X) 표시
   */
  public showWrongMark() {
    if (this.mark) this.group.remove(this.mark)

    const pathData = 'M -14 -14 L 14 14 M -14 14 L 14 -14' /* X자 형태 */

    const cross = new Path(pathData, {
      stroke: hexToRGB(COLOR.RED, 0.7),
      strokeWidth: 5,
      fill: '',
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false
    })

    const rectWidth = this.rect.width ?? 0
    const rectHeight = this.rect.height ?? 0

    this.mark = new Group([cross], {
      left: this.initLeft + rectWidth / 2,
      top: this.initTop + rectHeight / 2,
      selectable: false,
      evented: false,
      originX: 'center',
      originY: 'center'
    })

    this.group.add(this.mark)
    this.group.bringObjectToFront(this.mark)
    this.group.setCoords()
  }

  /**
   * 정오답 마크 제거
   */
  public removeMark() {
    if (this.mark) {
      this.group.remove(this.mark)
      this.mark = null
    }
  }

  /**
   * 선택지 상태 초기화
   * - 텍스트 색상, 테두리, 배경, 이벤트 상태 복구
   */
  public reset() {
    this.text.set({ fill: 'black' })

    this.removeMark()
    this.rect.set({ fill: 'white', stroke: COLOR.GRAY })

    this.group.set({ evented: true })
  }
}
