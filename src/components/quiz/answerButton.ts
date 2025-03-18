import { Group, IText, Rect } from 'fabric'
import { hexToRGB } from '../../utils/hexToRGB'
import { CANVAS, COLOR, PATH, QUIZ_COUNT } from '../../libs/constants'
import changeUrl from '../../utils/router'
import { createDefaultButton } from '../../utils/createButton'
import { showToast } from '../../utils/showToast'
import { canvasAtom, quizAtom, store } from '../../libs/atoms'

export function renderAnswerButton(
  startPos: number,
  quizNum: number,
  optionGroup: Group[],
  labelGroup?: Group[]
): [IText, Rect, Group] {
  const canvas = store.get(canvasAtom)
  const quizData = store.get(quizAtom)

  const [answerText, answerRect, answerGroup] = createDefaultButton('정답 확인', 200)
  answerText.set({ fill: 'white', fontSize: 20 })
  answerRect.set({ fill: COLOR.PURPLE, rx: 24, ry: 24 })
  answerGroup.set({ originX: 'center', top: startPos + 40, left: CANVAS.WIDTH / 2, evented: true })
  const answerEndPos = answerGroup.top + answerGroup.height

  const [toastText, toastRect, toastGroup] = createDefaultButton('')
  toastText.set({ fill: COLOR.PURPLE, fontSize: 20 })
  toastRect.set({ fill: 'white', stroke: COLOR.PURPLE, rx: 24, ry: 24 })
  toastGroup.set({ originX: 'center', top: answerEndPos + 20, left: 400, opacity: 0, visibility: false })

  const selectedOptionGroup = new Set()
  optionGroup.forEach((option, index) =>
    option.on('mousedown', () => {
      if (quizData.type === 'SINGLE' || quizData.type === 'MATH') {
        selectedOptionGroup.clear()
        selectedOptionGroup.add(index)
      } else if (quizData.type === 'MULTI') {
        if (selectedOptionGroup.has(index)) selectedOptionGroup.delete(index)
        else selectedOptionGroup.add(index)
      }
      canvas.renderAll()
    })
  )

  answerGroup.on('mouseover', () => {
    answerGroup.set({ hoverCursor: 'pointer' })
    answerRect.set({ fill: COLOR.LIGHT_PURPLE })
    canvas.renderAll()
  })

  answerGroup.on('mouseout', () => {
    answerRect.set({ fill: COLOR.PURPLE })
    canvas.renderAll()
  })

  let isAllCorrect = true
  let hasWrong = false
  let hasPartialCorrect = false
  answerGroup.on('mousedown', () => {
    if (answerText.text === '정답 확인') {
      if (quizData.type !== 'DRAG') {
        if (selectedOptionGroup.size === 0) {
          showToast(toastGroup, canvas, '선택된 답이 없습니다. 답을 선택해주세요!')
          return
        }

        optionGroup.forEach((option, index) => {
          const isCorrect = quizData.answer[index]

          if (!isCorrect && selectedOptionGroup.has(index)) {
            // 오답을 선택한 경우
            option.item(0).set({ stroke: COLOR.RED, fill: hexToRGB(COLOR.RED, 0.03) })
            hasWrong = true
          } else if (isCorrect && !selectedOptionGroup.has(index)) {
            // 정답을 선택하지 않은 경우
            option.item(0).set({ stroke: COLOR.GREEN, strokeDashArray: [10, 5], fill: hexToRGB(COLOR.GREEN, 0.03) })
            isAllCorrect = false
          } else if (isCorrect && selectedOptionGroup.has(index)) hasPartialCorrect = true // 정답을 선택한 경우

          option.off('mousedown')
          option.off('mouseover')
          option.off('mouseout')
        })

        if (hasWrong) showToast(toastGroup, canvas, '이번엔 틀렸어요! 다음엔 조금 더 생각해봐요.')
        else if (isAllCorrect) showToast(toastGroup, canvas, '정답이에요! 계속해서 멋진 실력을 보여주세요!')
        else if (hasPartialCorrect) showToast(toastGroup, canvas, '거의 다 맞았어요! 다음엔 조금 더 노력해봐요.')
      } else if (quizData.type === 'DRAG' && labelGroup) {
        const hasNotSolvedQuestion = labelGroup.some(label => {
          const labelText = label.item(1) as IText
          if (labelText.text === '?') return true
          else return false
        })
        if (hasNotSolvedQuestion) {
          showToast(toastGroup, canvas, '아직 풀지 않은 문제가 있어요.')
          return
        }

        labelGroup.forEach((label, index) => {
          const labelRect = label.item(0)
          const labelText = label.item(1) as IText
          if (labelText.text === quizData.answer[index]) {
            labelText.set({ fill: COLOR.GREEN })
            labelRect.set({ fill: hexToRGB(COLOR.GREEN, 0.03), stroke: COLOR.GREEN, strokeWidth: 2 })
          } else {
            hasWrong = true
            isAllCorrect = false
            labelText.set({
              fill: COLOR.RED,
              text: `${labelText.text === '?' ? '' : labelText.text} ${quizData.answer[index]}`
            })
            labelRect.set({ fill: hexToRGB(COLOR.RED, 0.03), stroke: COLOR.RED, strokeWidth: 2 })

            const textLength = labelText.text.length - quizData.answer[index].length - 1
            labelText.styles = { 0: {} }
            for (let i = 0; i < textLength; i++) labelText.styles[0][i] = { fill: 'black', linethrough: true }
          }
        })

        optionGroup.forEach(option => {
          const optionText = option.item(1) as IText
          optionText.set({ fill: 'black' })
          option.set({ evented: false, selectable: false })
        })

        if (hasWrong) showToast(toastGroup, canvas, '이번엔 틀렸어요! 다음엔 조금 더 생각해봐요.')
        else if (isAllCorrect) showToast(toastGroup, canvas, '정답이에요! 계속해서 멋진 실력을 보여주세요!')
      }

      answerText.set({ text: quizNum !== QUIZ_COUNT ? '다음 문제로' : '레포트 확인하기' })
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
