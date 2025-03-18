import { Group, IText, Rect } from 'fabric'
import { hexToRGB } from '../../utils/hexToRGB'
import { CANVAS, COLOR, SIZE } from '../../libs/constants'
import { getObjectSize } from '../../utils/getObjectSize'
import { moveSmooth } from '../../utils/moveSmooth'
import { createDefaultButton } from '../../utils/createButton'
import { getIntersectionRect } from '../../utils/getIntersectionArea'
import { canvasAtom, quizAtom, store } from '../../libs/atoms'

export const renderOptions = (
  startPos: number,
  optionStyle: OptionStyle = { buttonWidth: SIZE.BUTTON_WIDTH, colGap: SIZE.GAP_SM, col: 3 },
  inputOptions?: Group[]
): [IText[], Rect[], Group[]] => {
  const canvas = store.get(canvasAtom)
  const quizData = store.get(quizAtom)
  const quizType = quizData.type
  const quizOptions = quizData.options

  const buttonWidth = optionStyle.buttonWidth
  const colGap = optionStyle.colGap
  const col = optionStyle.col

  const totalWidth = col * buttonWidth + (col - 1) * colGap
  const startX = (CANVAS.WIDTH - totalWidth) / 2 + buttonWidth / 2

  const textList: IText[] = []
  const rectList: Rect[] = []
  const groupList: Group[] = []

  quizOptions.forEach((option, index) => {
    const [optionText, optionRect, optionGroup] = createDefaultButton(option, 250)

    optionRect.set({
      stroke: COLOR.GRAY,
      strokeWidth: 2,
    })
    const [_, optionRectHeight] = getObjectSize(optionRect)

    const colIndex = index % col
    const rowIndex = Math.floor(index / col)
    const leftPos = startX + colIndex * (buttonWidth + colGap)
    const topPos =
      startPos + optionGroup.height / 2 + rowIndex * (optionRectHeight + (quizType === 'DRAG' ? SIZE.GAP_XS : colGap))

    optionGroup.set({
      left: leftPos,
      top: topPos,
    })

    textList.push(optionText)
    rectList.push(optionRect)
    groupList.push(optionGroup)
    canvas.add(optionGroup)
  })

  let selectedSingleOption: Group | null = null
  let selectedOptions = Array(inputOptions?.length).fill(undefined)
  const optionCount = quizOptions.length
  for (let i = 0; i < optionCount; i++) {
    const optionText = textList[i]
    const optionRect = rectList[i]
    const optionGroup = groupList[i]

    if (quizType === 'DRAG' && inputOptions) {
      optionGroup.set({
        selectable: true,
        hasBorders: false,
        hasControls: false,
      })

      let prevIntersectInput: Group | undefined
      let maxIntersectInput: Group | undefined
      optionGroup.on('moving', () => {
        let maxIntersectSpace = 0
        for (const input of inputOptions) {
          const intersectSpace = getIntersectionRect(optionGroup, input)
          if (intersectSpace > maxIntersectSpace) {
            maxIntersectSpace = intersectSpace
            maxIntersectInput = input
          }
        }

        if (prevIntersectInput && prevIntersectInput != maxIntersectInput) {
          const prevInputText = prevIntersectInput.item(1) as IText

          if (prevInputText.text === '?')
            prevIntersectInput.item(0).set({
              fill: COLOR.SUPER_LIGHT_GRAY,
            })
        }

        if (maxIntersectInput) {
          const maxIntersectInputText = maxIntersectInput.item(1) as IText
          if (maxIntersectSpace > 0) maxIntersectInput.item(0).set({ fill: hexToRGB(COLOR.GREEN, 0.2) })
          else if (maxIntersectInputText.text === '?') maxIntersectInput.item(0).set({ fill: COLOR.SUPER_LIGHT_GRAY })
        }

        prevIntersectInput = maxIntersectInput
        canvas.renderAll()
      })

      optionGroup.on('mouseup', () => {
        const [_, optionRectHeight] = getObjectSize(optionRect)
        const colIndex = i % col
        const rowIndex = Math.floor(i / col)
        const leftPos = startX + colIndex * (buttonWidth + colGap)
        const topPos =
          startPos +
          optionGroup.height / 2 +
          rowIndex * (optionRectHeight + (quizType === 'DRAG' ? SIZE.GAP_XS : colGap))

        if (maxIntersectInput && optionGroup.intersectsWithObject(maxIntersectInput)) {
          const inputIndex = inputOptions.findIndex((input) => input === maxIntersectInput)
          if (inputIndex >= 0) {
            const prevOption = selectedOptions[inputIndex]
            if (prevOption) {
              const inputText = prevOption.item(1) as IText
              inputText.set({
                fill: 'black',
              })
              prevOption.set({
                evented: true,
              })
            }

            selectedOptions[inputIndex] = optionGroup
          }

          maxIntersectInput.item(1).set({
            text: optionText.text,
          })
          optionText.set({
            fill: COLOR.GRAY,
          })
          optionGroup.set({
            evented: false,
          })
        }

        moveSmooth(canvas, optionGroup, optionGroup.left, optionGroup.top, leftPos, topPos)
        canvas.renderAll()
      })
    }
    optionGroup.on('mouseover', () => {
      if (!isSelected && quizType !== 'DRAG') {
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
      if (quizType === 'MULTI') isSelected = !isSelected
      else if (quizType === 'SINGLE' || quizType === 'MATH') {
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
