import { Canvas, IText } from 'fabric'

export function renderTitle(title: string, canvas: Canvas): IText {
  const questionText = new IText(title, {
    fontSize: 24,
    selectable: false,
  })
  canvas.add(questionText)

  return questionText
}
