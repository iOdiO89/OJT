import { Canvas, Group, Rect } from 'fabric'
import { createDefaultButton } from '../libs/createElement'
import { COLOR, PATH } from '../libs/constants'
import { hexToRGB } from '../libs/hexToRGB'
import changeUrl from '../libs/router'

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

  /* '정답 확인' 버튼 클릭 함수 - 정답 판별 + buttonText: '다음 문제로' 로 변경 */
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
        text: '다음 문제로',
      })
    } else changeUrl(`${PATH.QUIZ}?no=${quizNum + 1}`)

    canvas.renderAll()
  })

  canvas.add(answerGroup)
}
