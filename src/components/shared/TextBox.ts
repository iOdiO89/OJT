import { Group, GroupEvents, IText, Rect, Shadow } from 'fabric'
import { getObjectSize } from '../../utils/getObjectSize'
import { hexToRGB } from '../../utils/hexToRGB'
import { COLOR } from '../../libs/constants'

export class TextBox {
  protected text: IText
  protected rect: Rect
  protected group: Group
  protected initLeft: number
  protected initTop: number

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
      width: width ?? textWidth + 24,
      height: textHeight + 16,
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

  public getTextValue(): string {
    return this.text.text
  }

  public getTextObject(): IText {
    return this.text
  }

  public getRectObject(): Rect {
    return this.rect
  }

  public getGroupObject(): Group {
    return this.group
  }

  public setText(properties: Record<string, unknown>): void {
    this.text.set(properties)
  }

  public setRect(properties: Record<string, unknown>): void {
    this.rect.set(properties)
  }

  public setGroup(properties: Record<string, unknown>): void {
    this.group.set(properties)
  }

  public on(eventName: keyof GroupEvents, handler: (...args: unknown[]) => unknown): void {
    this.group.on(eventName, handler)
  }

  public setInitPosition(left: number, top: number) {
    this.initLeft = left
    this.initTop = top
  }

  public getInitPosition(): { left: number; top: number } {
    return { left: this.initLeft ?? 0, top: this.initTop ?? 0 }
  }
}
