import { Canvas } from 'fabric'
import { TextBox } from '../components/shared/TextBox'
import { selectedOptionsAtom, store, tryCountAtom } from '../libs/atoms'
import { COLOR } from '../libs/constants'
import { showToast } from './showToast'
import { Option } from '../components/quiz/Option'
import { QuizImage } from '../components/quiz/QuizImage'
import { hexToRGB } from './hexToRGB'

export const checkAnswer = (
  canvas: Canvas,
  quizData: Quiz,
  checkButton: TextBox,
  options: Option[],
  toast: TextBox,
  nextButton: QuizImage,
  labels?: Option[]
) => {
  const selectedOptions = store.get(selectedOptionsAtom)

  checkButton.on('mouseover', () => {
    checkButton.setRect({ fill: hexToRGB(COLOR.PURPLE, 0.8) })
    canvas.renderAll()
  })

  checkButton.on('mouseout', () => {
    checkButton.setRect({ fill: COLOR.PURPLE })
    canvas.renderAll()
  })

  checkButton.on('mousedown', () => {
    let isAllCorrect = true

    if (quizData.type !== 'DRAG') {
      if (checkButton.getTextValue() === '채점하기') {
        if (selectedOptions.size === 0) {
          showToast(canvas, toast, '선택된 답이 없습니다. 답을 선택해주세요!')
          return
        }

        const selectedOptionList = [...selectedOptions]
        options.forEach((_, index) => {
          if (quizData.answer[index] && !selectedOptions.has(index)) {
            isAllCorrect = false
          } else if (!quizData.answer[index] && selectedOptions.has(index)) isAllCorrect = false
        })

        if (isAllCorrect) {
          selectedOptionList.forEach(i => options[i].showIsCorrect())
          showToast(canvas, toast, '정답이에요! 다음으로 넘어가볼까요?')
          checkButton.setGroup({ evented: false })
          nextButton.setGroup({ opacity: 100, visibility: true })
        } else {

          if (store.get(tryCountAtom) === 1) {
            options.forEach((option, index) => {
              if (quizData.answer[index]) {
                if (selectedOptions.has(index)) option.showIsCorrect()
                else option.showIsCorrect(false)
              } else if (selectedOptions.has(index)) option.showIsWrong()
            })
            showToast(canvas, toast, `이번엔 틀렸어요. 다음엔 조금 더 노력해봐요!`)
            checkButton.setGroup({ evented: false })
            nextButton.setGroup({ opacity: 100, visibility: true })
          } else {
            selectedOptionList.forEach(i => {
              const option = options[i]
              if (quizData.answer[i]) option.showIsCorrect()
              else {
                option.showIsWrong()
                isAllCorrect = false
              }
            })
            showToast(canvas, toast, `다시 한 번 풀어볼까요? ${store.get(tryCountAtom) - 1}번의 기회가 남았어요.`)
            checkButton.setText({ text: '다시 풀기' })
          }
        }

        options.forEach(option => option.setGroup({ evented: false }))

        canvas.renderAll()
      } else if (checkButton.getTextValue() === '다시 풀기') {
        isAllCorrect = true
        selectedOptions.clear()
        options.forEach(option => option.reset())
        store.set(tryCountAtom, store.get(tryCountAtom) - 1)
        checkButton.setText({ text: '채점하기' })
      }
    } else if (quizData.type === 'DRAG' && labels) {
      if (labels.some(label => label.getTextValue() === '?')) {
        showToast(canvas, toast, '아직 풀지 않은 문제가 있어요.')
        return
      }

      if (checkButton.getTextValue() === '채점하기') {
        labels.forEach((label, index) => {
          if (label.getTextValue() !== quizData.answer[index]) isAllCorrect = false
        })

        if (isAllCorrect) {
          labels.forEach(label => label.showIsCorrect())
          showToast(canvas, toast, '정답이에요! 다음으로 넘어가볼까요?')
          checkButton.setGroup({ evented: false })
          nextButton.setGroup({ opacity: 100, visibility: true })
        } else {
          if (store.get(tryCountAtom) === 1) {
            labels.forEach((label, index) => {
              if (label.getTextValue() === quizData.answer[index]) label.showIsCorrect()
              else {
                label.showIsWrong(false)
                label.setText({
                  fill: COLOR.RED,
                  text: `${label.getTextValue()} ${quizData.answer[index]}`
                })

                const wrongTextLength = label.getTextValue().length - quizData.answer[index].length - 1
                label.getTextObject().styles = { 0: {} }
                for (let i = 0; i < wrongTextLength; i++)
                  label.getTextObject().styles[0][i] = { fill: 'black', linethrough: true }
              }
            })

            showToast(canvas, toast, `이번엔 틀렸어요. 다음엔 조금 더 노력해봐요!`)
            checkButton.setGroup({ evented: false })
            nextButton.setGroup({ opacity: 100, visibility: true })
          } else {
            labels.forEach((label, index) => {
              if (label.getTextValue() === quizData.answer[index]) label.showIsCorrect()
              else label.showIsWrong()
            })
            showToast(canvas, toast, `다시 한 번 풀어볼까요? ${store.get(tryCountAtom) - 1}번의 기회가 남았어요.`)
          }

          options.forEach(option => option.setGroup({ evented: false }))
          checkButton.setText({ text: '다시 풀기' })
        }
      } else {
        isAllCorrect = true
        labels.forEach(label => {
          label.reset()
          label.setText({ text: '?' })
          label.setRect({ fill: COLOR.SUPER_LIGHT_GRAY, stroke: '' })
        })
        options.forEach(option => option.reset())
        store.set(tryCountAtom, store.get(tryCountAtom) - 1)
        checkButton.setText({ text: '채점하기' })
      }
    }
  })
}
