import { IText } from 'fabric'

export class Title {
  private text: IText

  constructor(textValue: string) {
    this.text = new IText(textValue, {
      fontSize: 24,
      selectable: false,
      fontFamily: 'NanumSquareRound'
    })
  }

  public getTextValue(): string {
    return this.text.text
  }

  public getTextObject(): IText {
    return this.text
  }

  public setText(properties: Record<string, unknown>): void {
    this.text.set(properties)
  }
}
