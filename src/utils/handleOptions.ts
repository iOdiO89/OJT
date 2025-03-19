import { Canvas } from 'fabric'
import { TextBox } from '../components/shared/TextBox'
import { COLOR } from '../libs/constants'
import { hexToRGB } from './hexToRGB'
import { moveSmooth } from './moveSmooth'
import { getOverlappedSpace } from './getIntersectionArea'

export const handleOptions = (canvas: Canvas, quizType: QUIZ_TYPE, options: TextBox[], labels?: TextBox[]) => {
  if (quizType === 'DRAG' && labels) {
    // eslint-disable-next-line prefer-const
    let selectedOptions = Array(labels.length).fill(undefined)

    options.forEach(option => {
      option.setGroup({ selectable: true, hasBorders: false, hasControls: false })

      let prevOverlappedLabel: TextBox | undefined
      let maxOverlappedLabel: TextBox | undefined

      option.on('mouseover', () => {
        canvas.setActiveObject(option.getGroupObject())
      })

      option.on('mousedown', () => {
        option.setInitPosition(option.getGroupObject().left, option.getGroupObject().top)
      })

      option.on('moving', () => {
        let maxOverlappedSpace = 0
        for (const label of labels) {
          const overlappedSpace = getOverlappedSpace(option.getGroupObject(), label)
          if (overlappedSpace > maxOverlappedSpace) {
            maxOverlappedSpace = overlappedSpace
            maxOverlappedLabel = label
          }
        }

        if (prevOverlappedLabel && prevOverlappedLabel != maxOverlappedLabel) {
          if (prevOverlappedLabel.getTextValue() === '?')
            prevOverlappedLabel.setRect({
              fill: COLOR.SUPER_LIGHT_GRAY
            })
        }

        if (maxOverlappedLabel) {
          if (maxOverlappedSpace > 0) maxOverlappedLabel.setRect({ fill: hexToRGB(COLOR.GREEN, 0.2) })
          else if (maxOverlappedLabel.getTextValue() === '?')
            maxOverlappedLabel.setRect({ fill: COLOR.SUPER_LIGHT_GRAY })
        }

        prevOverlappedLabel = maxOverlappedLabel
        canvas.renderAll()
      })

      option.on('mouseup', () => {
        if (maxOverlappedLabel && option.getGroupObject().intersectsWithObject(maxOverlappedLabel.getGroupObject())) {
          const prevLabelIndex = labels.findIndex(input => input === maxOverlappedLabel)
          if (prevLabelIndex >= 0) {
            const prevOption = selectedOptions[prevLabelIndex]
            if (prevOption) {
              prevOption.setText({ fill: 'black' })
              prevOption.setGroup({ evented: true })
            }

            selectedOptions[prevLabelIndex] = option
          }

          maxOverlappedLabel.setText({ text: option.getTextValue() })
          maxOverlappedLabel.centerText()

          option.setText({ fill: COLOR.GRAY })
          option.setGroup({ evented: false })
        }

        const optionGroup = option.getGroupObject()
        const initPos = option.getInitPosition()
        moveSmooth(canvas, option, optionGroup.left, optionGroup.top, initPos.left, initPos.top)
        canvas.renderAll()
      })
    })
  } else {
    let selectedOption: TextBox | null = null

    options.forEach(option => {
      let isSelected = false

      option.on('mouseover', () => {
        if (!isSelected) option.setRect({ stroke: COLOR.GREEN, fill: hexToRGB(COLOR.GREEN, 0.01) })

        canvas.renderAll()
      })

      option.on('mouseout', () => {
        if (!isSelected) {
          option.setRect({ stroke: COLOR.GRAY, fill: 'white' })
          canvas.renderAll()
        }
      })

      option.on('mousedown', () => {
        if (quizType === 'MULTI') isSelected = !isSelected
        else if (quizType === 'SINGLE' || quizType === 'MATH') {
          if (selectedOption && selectedOption !== option) {
            const prevRect = selectedOption.getRectObject()
            prevRect.set({ stroke: COLOR.GRAY, fill: 'white' })
          }
          if (selectedOption === option) {
            isSelected = false
            selectedOption = null
          } else {
            isSelected = true
            selectedOption = option
          }
        }

        option.setRect({
          stroke: isSelected ? COLOR.GREEN : COLOR.GRAY,
          fill: isSelected ? hexToRGB(COLOR.GREEN, 0.01) : 'white'
        })

        canvas.renderAll()
      })
    })
  }
}
