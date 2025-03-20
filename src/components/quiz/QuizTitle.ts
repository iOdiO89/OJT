import { IText } from 'fabric'

/**
 * Title 클래스
 * - 문제의 질문 객체를 생성하는 클래스
 */
export class Title {
  private text: IText /* 타이틀 텍스트 객체 */

  /**
   * @param textValue - 타이틀에 표시될 문자열
   * - fontSize 24px
   */
  constructor(textValue: string) {
    this.text = new IText(textValue, {
      fontSize: 24,
      selectable: false,
      fontFamily: 'NanumSquareRound'
    })
  }

  /**
   * 타이틀 텍스트 값을 반환
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
   * Title 속성 변경
   * @param properties - 변경할 속성(객체 형식)
   */
  public setText(properties: Record<string, unknown>) {
    this.text.set(properties)
  }
}
