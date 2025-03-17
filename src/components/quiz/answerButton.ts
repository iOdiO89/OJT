import { Canvas, Group, IText, Rect, util } from 'fabric'
import { hexToRGB } from '../../utils/hexToRGB'
import { COLOR, PATH, QUIZ_COUNT } from '../../libs/constants'
import changeUrl from '../../utils/router'
import { createDefaultButton } from '../../utils/createButton'

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

  const [toastText, toastRect, toastGroup] = createDefaultButton('선택된 답이 없습니다. 답을 선택해주세요!')
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

  answerGroup.on('mousedown', () => {
    if (answerText.text === '정답 확인') {
      if (selectedOptionGroup.size === 0) {
        toastGroup.set({ opacity: 0, visible: true })
        canvas.renderAll()

        util.animate({
          startValue: 0,
          endValue: 1,
          duration: 300,
          easing: util.ease.easeInOutQuad,
          onChange: (opacity) => {
            toastGroup.set({ opacity })
            canvas.renderAll()
          },
          onComplete: () => {
            setTimeout(() => {
              util.animate({
                startValue: 1,
                endValue: 0,
                duration: 300,
                easing: util.ease.easeInOutQuad,
                onChange: (opacity) => {
                  toastGroup.set({ opacity })
                  canvas.renderAll()
                },
                onComplete: () => {
                  toastGroup.set({ visible: false })
                  canvas.renderAll()
                },
              })
            }, 1000)
          },
        })

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
  canvas.add(toastGroup)

  return [answerText, answerRect, answerGroup]
}
