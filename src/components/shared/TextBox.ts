import { Group, GroupEvents, IText, Rect, Shadow } from 'fabric'
import { getObjectSize } from '../../utils/getObjectSize'
import { hexToRGB } from '../../utils/hexToRGB'
import { COLOR } from '../../libs/constants'

/**
 * TextBox 클래스
 * - 텍스트와 배경을 하나의 그룹으로 구성한 컴포넌트
 * - 선택지, 입력란, 버튼 등 다양한 요소로 활용 가능
 */
export class TextBox {
  protected text: IText /* 텍스트 객체 */
  protected rect: Rect /* 배경 Rect 객체 */
  protected group: Group /* 텍스트와 배경을 포함하는 그룹 객체 */
  protected initLeft: number /* 초기 left 좌표 */
  protected initTop: number /* 초기 top 좌표 */

  /**
   * TextBox 생성자
   *
   * @param textValue - 표시할 텍스트 값
   * @param width - 생략시 TextBox 크기: text 길이에 맞춤 (px-[12px]) / 명시하면 Width 고정
   */
  constructor(textValue: string, width?: number) {
    this.text = new IText(textValue, {
      originX: 'center',
      originY: 'center',
      fontSize: 24,
      fill: 'black',
      selectable: false,
      fontFamily: 'NanumSquareRound'
    })

    const [textWidth, textHeight] = getObjectSize(this.text)
    this.rect = new Rect({
      originX: 'center',
      originY: 'center',
      width: width ?? textWidth + 24 /* px-3 */,
      height: textHeight + 16 /* py-2 */,
      rx: 8,
      ry: 8,
      fill: 'white',
      shadow: new Shadow({
        blur: 12,
        offsetY: 6,
        color: hexToRGB(COLOR.SHADOW, 0.03)
      }),
      selectable: false
    })

    this.group = new Group([this.rect, this.text], {
      selectable: false,
      hasControls: false,
      hasBorders: false,
      hoverCursor: 'pointer'
    })

    this.initLeft = 0
    this.initTop = 0
  }

  /**
   * 현재 TextBox의 텍스트 값 반환
   * @returns 텍스트 문자열
   */
  public getTextValue(): string {
    return this.text.text
  }

  /**
   * fabric.IText 객체 반환
   * @returns IText 객체
   */
  public getTextObject(): IText {
    return this.text
  }

  /**
   * fabric.Rect 객체 반환
   * @returns Rect 객체
   */
  public getRectObject(): Rect {
    return this.rect
  }

  /**
   * 그룹(Group) 객체 반환
   * @returns Group 객체
   */
  public getGroupObject(): Group {
    return this.group
  }

  /**
   * 텍스트 속성 수정
   * @param properties - 적용할 속성(객체 형식)
   */
  public setText(properties: Record<string, unknown>) {
    this.text.set(properties)
  }

  /**
   * 배경 속성 수정
   * @param properties - 적용할 속성(객체 형식)
   */
  public setRect(properties: Record<string, unknown>) {
    this.rect.set(properties)
  }

  /**
   * 그룹 속성 수정
   * @param properties - 적용할 속성(객체 형식)
   */
  public setGroup(properties: Record<string, unknown>) {
    this.group.set(properties)
  }

  /**
   * 그룹에 이벤트 리스너 등록
   * @param eventName - 이벤트 이름
   * @param handler - 이벤트 발생 시 실행할 핸들러 함수
   */
  public on(eventName: keyof GroupEvents, handler: (...args: unknown[]) => unknown) {
    this.group.on(eventName, handler)
  }

  /**
   * 초기 좌표(left, top) 설정
   * @param left - 초기 left 좌표
   * @param top - 초기 top 좌표
   */
  public setInitPosition(left: number, top: number) {
    this.initLeft = left
    this.initTop = top
  }

  /**
   * 초기 좌표(left, top) 반환
   * @returns 초기 좌표 객체
   */
  public getInitPosition(): { left: number; top: number } {
    return { left: this.initLeft ?? 0, top: this.initTop ?? 0 }
  }
}
