import { Canvas, Group } from 'fabric'
import { hexToRGB } from '../../utils/hexToRGB'
import { COLOR, PATH, QUIZ_COUNT } from '../../libs/constants'
import changeUrl from '../../utils/router'
import { createDefaultButton } from '../../utils/createButton'

export function renderAnswerButton(
  canvas: Canvas,
  startPos: number,
  optionGroup: Group[],
  answer: boolean[],
  quizNum: number
) {
  const [answerText, answerRect, answerGroup] = createDefaultButton('정답 확인', 200)
  answerText.set({
    fill: 'white',
    fontSize: 20,
  })
  answerRect.set({
    fill: '#8347FF',
    rx: 24,
    ry: 24,
  })
  answerGroup.set({
    originX: 'center',
    top: startPos + 40,
    left: 400,
    evented: true,
  })

  const selectedOptionGroup = new Set()
  optionGroup.forEach((option, index) =>
    option.on('mousedown', () => {
      if (selectedOptionGroup.has(index)) selectedOptionGroup.delete(index)
      else selectedOptionGroup.add(index)
    })
  )

  answerGroup.on('mousedown', () => {
    if (answerText.text === '정답 확인') {
      optionGroup.forEach((option, index) => {
        const isCorrect = answer[index]

        if (!isCorrect && selectedOptionGroup.has(index)) {
          // 오답을 선택한 경우
          option.item(0).set({
            stroke: COLOR.RED,
            fill: hexToRGB(COLOR.RED, 0.01),
          })
        } else if (isCorrect && !selectedOptionGroup.has(index)) {
          // 정답을 선택하지 않은 경우
          option.item(0).set({
            stroke: COLOR.GREEN,
            strokeDashArray: [10, 5],
            fill: hexToRGB(COLOR.GREEN, 0.01),
          })
        }
        option.off('mousedown')
        option.off('mouseover')
        option.off('mouseout')
      })

      answerText.set({
        text: quizNum !== QUIZ_COUNT ? '다음 문제로' : '레포트 확인하기',
      })
    } else {
      if (quizNum !== QUIZ_COUNT) changeUrl(`${PATH.QUIZ}?no=${quizNum + 1}`)
      else changeUrl(PATH.REPORT)
    }

    canvas.renderAll()
  })

  canvas.add(answerGroup)
}
