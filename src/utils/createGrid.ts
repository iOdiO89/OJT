import { Group } from 'fabric'
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
): [TextBox[], Group] {
  const textBoxes: TextBox[] = []
  const textBoxWidth =
    rectProperties && 'width' in rectProperties ? (rectProperties.width as number) : SIZE.BUTTON_WIDTH

  textList.forEach((text, index) => {
    const textBox = new TextBox(text, textBoxWidth)
    if (textProperties) textBox.setText(textProperties)
    if (rectProperties) textBox.setRect(rectProperties)
    if (groupProperties) textBox.setGroup(groupProperties)

    const [, rectHeight] = getObjectSize(textBox.getRectObject())
    const colIndex = index % col
    const rowIndex = Math.floor(index / col)

    const left = colIndex * (textBoxWidth + colGap) + textBoxWidth / 2
    const top = startPos + rowIndex * (rectHeight + rowGap) + rectHeight / 2

    textBox.setGroup({ left, top, originX: 'center', originY: 'center' })

    textBox.setInitPosition(left, top)

    textBoxes.push(textBox)
  })

  const gridWidth = col * textBoxWidth + (col - 1) * colGap
  const gridGroup = new Group(
    textBoxes.map(textBox => textBox.getGroupObject()),
    {
      selectable: false,
      subTargetCheck: true,
      left: (CANVAS.WIDTH - gridWidth) / 2
    }
  )

  return [textBoxes, gridGroup]
}
