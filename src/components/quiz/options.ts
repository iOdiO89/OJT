import { Canvas, Group, IText, Rect } from 'fabric'
import { hexToRGB } from '../../utils/hexToRGB'
import { CANVAS, COLOR, SIZE } from '../../libs/constants'
import { getObjectSize } from '../../utils/getObjectSize'
import { createDefaultButton } from '../../utils/createButton'

export const renderOptions = (
  canvas: Canvas,
  options: string[],
  type: QUIZ_TYPE,
  startPos: number,
  buttonWidth: number = SIZE.BUTTON_WIDTH,
  colGap: number = SIZE.GAP_SM,
  columns: number = 3
): [IText[], Rect[], Group[]] => {
  const totalWidth = columns * buttonWidth + (columns - 1) * colGap
  const startX = (CANVAS.WIDTH - totalWidth) / 2 + buttonWidth / 2

  const textList: IText[] = []
  const rectList: Rect[] = []
  const groupList: Group[] = []

  options.forEach((option, index) => {
    const [optionText, optionRect, optionGroup] = createDefaultButton(option, 250)

    optionRect.set({
      stroke: COLOR.GRAY,
      strokeWidth: 2,
    })
    const [_, optionRectHeight] = getObjectSize(optionRect)

    const colIndex = index % columns
    const rowIndex = Math.floor(index / columns)
    const leftPos = startX + colIndex * (buttonWidth + colGap)
    const topPos =
      startPos + optionGroup.height / 2 + rowIndex * (optionRectHeight + (type === 'DRAG' ? SIZE.GAP_XS : colGap))

    optionGroup.set({
      left: leftPos,
      top: topPos,
    })

    textList.push(optionText)
    rectList.push(optionRect)
    groupList.push(optionGroup)
    canvas.add(optionGroup)
  })
  const optionCount = options.length
  for (let i = 0; i < optionCount; i++) {
    const optionText = textList[i]
    const optionRect = rectList[i]
    const optionGroup = groupList[i]
    optionGroup.on('mouseover', () => {
      if (!isSelected && type !== 'DRAG') {
        optionRect.set({
          stroke: COLOR.GREEN,
          fill: hexToRGB(COLOR.GREEN, 0.01),
        })
      }
      optionGroup.set({ hoverCursor: 'pointer' })
      canvas.renderAll()
    })

    optionGroup.on('mouseout', () => {
      if (!isSelected) {
        optionRect.set({
          stroke: COLOR.GRAY,
          fill: 'white',
        })
        canvas.renderAll()
      }
    })

    let isSelected = false
    optionGroup.on('mousedown', () => {
      if (type === 'MULTI') isSelected = !isSelected
      else if (type === 'SINGLE' || type === 'MATH') {
        if (selectedSingleOption && selectedSingleOption !== optionGroup) {
          const prevRect = selectedSingleOption.item(0) as Rect
          prevRect.set({
            stroke: COLOR.GRAY,
            fill: 'white',
          })
        }

        if (selectedSingleOption === optionGroup) {
          isSelected = false
          selectedSingleOption = null
        } else {
          isSelected = true
          selectedSingleOption = optionGroup
        }
      }

      optionRect.set({
        stroke: isSelected ? COLOR.GREEN : COLOR.GRAY,
        fill: isSelected ? hexToRGB(COLOR.GREEN, 0.01) : 'white',
      })

      canvas.renderAll()
    })
  }

  return [textList, rectList, groupList]
}
