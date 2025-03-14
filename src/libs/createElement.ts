import { Canvas, FabricObject, Group, IText, Rect, Shadow } from 'fabric'
import { COLOR } from './constants'
import { hexToRGB } from './hexToRGB'

export const getObjectSize = (object: FabricObject) => {
  const width = object.getScaledWidth()
  const height = object.getScaledHeight()

  return [width, height]
}

export const createDefaultButton = (textValue: string, width?: number): [IText, Rect, Group] => {
  const text = new IText(textValue, {
    fontSize: 24,
    fill: 'black',
    originX: 'center',
    originY: 'center',
    selectable: false,
  })
  const [textWidth, textHeight] = getObjectSize(text)
  const rect = new Rect({
    width: width ?? textWidth + 24,
    height: textHeight + 16,
    rx: 8,
    ry: 8,
    fill: 'white',
    shadow: new Shadow({
      blur: 12,
      offsetY: 6,
      color: hexToRGB(COLOR.SHADOW, 0.03),
    }),
  })
  const [_, rectHeight] = getObjectSize(rect)

  text.set({
    left: (width ?? textWidth + 24) / 2,
    top: rectHeight / 2,
  })

  const group = new Group([rect, text], {
    selectable: false,
    hasControls: false,
  })

  return [text, rect, group]
}

export const createOptionButtons = (
  options: string[],
  type: QUIZ_TYPE,
  canvas: Canvas,
  startPos: number
): [IText[], Rect[], Group[]] => {
  const buttonWidth = 250 // button width
  const rowGap = 20 // row gap
  const colGap = 20 // col gap
  const columns = 3 // grid col num

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
    const leftPos = colIndex * (buttonWidth + rowGap)
    const topPos = startPos + 24 + rowIndex * (optionRectHeight + colGap)

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
        canvas.renderAll()
      }
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
      else if (type === 'SINGLE') {
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
