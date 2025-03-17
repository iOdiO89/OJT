import { Canvas, Group, IText, Rect, util } from 'fabric'
import { hexToRGB } from '../../utils/hexToRGB'
import { COLOR, PATH, QUIZ_COUNT } from '../../libs/constants'
import changeUrl from '../../utils/router'
import { createDefaultButton } from '../../utils/createButton'
import { showToast } from '../../utils/showToast'

export function renderAnswerButton(
  canvas: Canvas,
  startPos: number,
  optionGroup: Group[],
  answer: boolean[],
  quizNum: number,
  quizType: QUIZ_TYPE
): [IText, Rect, Group] {
  const [answerText, answerRect, answerGroup] = createDefaultButton('정답 확인', 200)
  answerText.set({
    fill: 'white',
    fontSize: 20,
  })
  answerRect.set({
    fill: COLOR.PURPLE,
    rx: 24,
    ry: 24,
  })
  answerGroup.set({
    originX: 'center',
    top: startPos + 40,
    left: 400,
    evented: true,
  })
  const answerEndPos = answerGroup.top + answerGroup.height

  const [toastText, toastRect, toastGroup] = createDefaultButton('')
  toastText.set({
    fill: COLOR.PURPLE,
    fontSize: 20,
  })
  toastRect.set({
    fill: 'white',
    stroke: COLOR.PURPLE,
    rx: 24,
    ry: 24,
  })
  toastGroup.set({ originX: 'center', top: answerEndPos + 20, left: 400, opacity: 0, visibility: false })

  const selectedOptionGroup = new Set()
  optionGroup.forEach((option, index) =>
    option.on('mousedown', () => {
      if (quizType === 'SINGLE' || quizType === 'MATH') {
        selectedOptionGroup.clear()
        selectedOptionGroup.add(index)
      } else if (quizType === 'MULTI') {
        if (selectedOptionGroup.has(index)) selectedOptionGroup.delete(index)
        else selectedOptionGroup.add(index)
      }
      canvas.renderAll()
    })
  )

  answerGroup.on('mouseover', () => {
    answerGroup.set({ hoverCursor: 'pointer' })
    answerRect.set({
      fill: COLOR.LIGHT_PURPLE,
    })
    canvas.renderAll()
  })

  answerGroup.on('mouseout', () => {
    answerRect.set({
      fill: COLOR.PURPLE,
    })
    canvas.renderAll()
  })

  let isAllCorrect = true
  let hasWrong = false
  let hasPartialCorrect = false
  answerGroup.on('mousedown', () => {
    if (answerText.text === '정답 확인') {
      if (selectedOptionGroup.size === 0) {
        showToast(toastGroup, canvas, '선택된 답이 없습니다. 답을 선택해주세요!')
        return
      }

      optionGroup.forEach((option, index) => {
        const isCorrect = answer[index]

        if (!isCorrect && selectedOptionGroup.has(index)) {
          // 오답을 선택한 경우
          option.item(0).set({
            stroke: COLOR.RED,
            fill: hexToRGB(COLOR.RED, 0.01),
          })
          hasWrong = true
        } else if (isCorrect && !selectedOptionGroup.has(index)) {
          // 정답을 선택하지 않은 경우
          option.item(0).set({
            stroke: COLOR.GREEN,
            strokeDashArray: [10, 5],
            fill: hexToRGB(COLOR.GREEN, 0.01),
          })
          isAllCorrect = false
        } else if (isCorrect && selectedOptionGroup.has(index)) hasPartialCorrect = true // 정답을 선택한 경우

        option.off('mousedown')
        option.off('mouseover')
        option.off('mouseout')
      })

      if (hasWrong) showToast(toastGroup, canvas, '이번엔 틀렸어요! 다음엔 조금 더 생각해봐요.')
      else if (isAllCorrect) showToast(toastGroup, canvas, '정답이에요! 계속해서 멋진 실력을 보여주세요!')
      else if (hasPartialCorrect) showToast(toastGroup, canvas, '거의 다 맞았어요! 다음엔 조금 더 노력해봐요.')

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
  canvas.add(toastGroup)

  return [answerText, answerRect, answerGroup]
}
