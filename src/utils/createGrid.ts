import { TextBox } from '../components/shared/TextBox'
import { CANVAS, SIZE } from '../libs/constants'
import { getObjectSize } from './getObjectSize'
export function createTextBoxGrid(
  textList: string[],
  startPos: number,
  col: number = 3,
  rowGap: number = SIZE.GAP_SM,
  colGap: number = SIZE.GAP_SM,
  textProperties?: Record<string, unknown>,
  rectProperties?: Record<string, unknown>,
  groupProperties?: Record<string, unknown>
): TextBox[] {
  const textBoxes: TextBox[] = []
  const textBoxWidth =
    rectProperties && 'width' in rectProperties ? (rectProperties.width as number) : SIZE.BUTTON_WIDTH

  const gridWidth = col * textBoxWidth + (col - 1) * colGap
  const startX = (CANVAS.WIDTH - gridWidth) / 2

  textList.forEach((text, index) => {
    const textBox = new TextBox(text, textBoxWidth)
    if (textProperties) textBox.setText(textProperties)
    if (rectProperties) textBox.setRect(rectProperties)
    if (groupProperties) textBox.setGroup(groupProperties)

    const [, rectHeight] = getObjectSize(textBox.getRectObject())
    const colIndex = index % col
    const rowIndex = Math.floor(index / col)

    const left = startX + colIndex * (textBoxWidth + colGap)
    const top = startPos + rowIndex * (rectHeight + rowGap)

    textBox.setGroup({ left, top })

    textBox.setInitPosition(left, top)

    textBoxes.push(textBox)
  })

  return textBoxes
}
