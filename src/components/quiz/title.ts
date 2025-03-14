import { Canvas, IText } from 'fabric'

export function renderTitle(canvas: Canvas, title: string): IText {
  const questionText = new IText(title, {
    fontSize: 24,
    selectable: false,
  })
  canvas.add(questionText)

  return questionText
}
