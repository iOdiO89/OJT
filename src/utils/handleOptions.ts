import { Canvas } from 'fabric'
import { TextBox } from '../components/shared/TextBox'
import { COLOR } from '../libs/constants'
import { hexToRGB } from './hexToRGB'

export const handleOptions = (canvas: Canvas, quizType: QUIZ_TYPE, options: TextBox[], labels?: TextBox[]) => {
  if (quizType === 'DRAG' && labels) {
    // 드래그 문제인 경우
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
