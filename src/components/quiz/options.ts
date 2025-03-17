import { Canvas, Group, IText, Rect, Shadow } from 'fabric'
import { hexToRGB } from '../../utils/hexToRGB'
import { CANVAS, COLOR, SIZE } from '../../libs/constants'
import { getObjectSize } from '../../utils/getObjectSize'

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
  const startX = (CANVAS.WIDTH - totalWidth) / 2

  let selectedSingleOption: Group | null = null

  const textList: IText[] = []
  const rectList: Rect[] = []
  const groupList: Group[] = []
  options.forEach((option, index) => {
    const optionText = new IText(option, {
      fontSize: 24,
      fill: 'black',
      originX: 'center',
      originY: 'center',
      selectable: false,
      fontFamily: 'NanumSquareRound',
    })

    const [__, optionTextHeight] = getObjectSize(optionText)

    const optionRect = new Rect({
      width: buttonWidth,
      height: optionTextHeight + 20,
      stroke: COLOR.GRAY,
      strokeWidth: 2,
      rx: 8,
      ry: 8,
      fill: 'white',
      shadow: new Shadow({
        blur: 12,
        offsetY: 6,
        color: hexToRGB(COLOR.SHADOW, 0.03),
      }),
      selectable: false,
    })
    const [_, optionRectHeight] = getObjectSize(optionRect)

    optionText.set({
      left: buttonWidth / 2,
      top: optionRectHeight / 2,
    })

    const optionGroup = new Group([optionRect, optionText], {
      selectable: false,
    })

    const colIndex = index % columns
    const rowIndex = Math.floor(index / columns)
    const leftPos = startX + colIndex * (buttonWidth + colGap)
    const topPos = startPos + rowIndex * (optionRectHeight + (type === 'DRAG' ? SIZE.GAP_XS : colGap))

    optionGroup.set({
      left: leftPos,
      top: topPos,
    })

    optionGroup.on('mouseover', () => {
      if (!isSelected) {
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

    textList.push(optionText)
    rectList.push(optionRect)
    groupList.push(optionGroup)
    canvas.add(optionGroup)
  })

  return [textList, rectList, groupList]
}
