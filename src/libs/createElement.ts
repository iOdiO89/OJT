import { Canvas, FabricObject, Group, IText, Rect, Shadow } from 'fabric'

export const getObjectSize = (object: FabricObject) => {
  const width = object.getScaledWidth()
  const height = object.getScaledHeight()

  return [width, height]
}

export const createOptionButtons = (
  options: string[],
  type: QUIZ_TYPE,
  canvas: Canvas,
  questionHeight: number
): void => {
  const buttonWidth = 250 // button width
  const rowGap = 20 // row gap
  const colGap = 20 // col gap
  const columns = 3 // grid col num

  let selectedSingleOption: Group | null = null

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
      stroke: 'lightgray',
      strokeWidth: 2,
      rx: 8,
      ry: 8,
      fill: 'white',
      shadow: new Shadow({
        blur: 12,
        offsetY: 6,
        color: 'rgba(24, 24, 24, 0.03)',
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
      hasControls: false,
    })

    const colIndex = index % columns
    const rowIndex = Math.floor(index / columns)
    const leftPos = colIndex * (buttonWidth + rowGap)
    const topPos = questionHeight + 24 + rowIndex * (optionRect.height + colGap)

    optionGroup.set({
      left: leftPos,
      top: topPos,
    })

    optionGroup.on('mouseover', () => {
      if (!isSelected) {
        optionRect.set({
          stroke: '#00C247',
          fill: 'rgba(0, 194, 71, 0.01)',
        })
        canvas.renderAll()
      }
    })

    optionGroup.on('mouseout', () => {
      if (!isSelected) {
        optionRect.set({
          stroke: '#e4e4e7',
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
            stroke: 'lightgray',
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
        stroke: isSelected ? '#00C247' : '#e4e4e7',
        fill: isSelected ? 'rgba(0, 194, 71, 0.01)' : 'white',
      })

      canvas.renderAll()
    })

    canvas.add(optionGroup)
  })
}
