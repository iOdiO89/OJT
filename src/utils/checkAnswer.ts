import { Canvas } from 'fabric'
import { TextBox } from '../components/shared/TextBox'
import { selectedOptionsAtom, store, tryCountAtom } from '../libs/atoms'
import { COLOR } from '../libs/constants'
import { showToast } from './showToast'
import { Option } from '../components/quiz/Option'
import { QuizImage } from '../components/quiz/QuizImage'

export const checkAnswer = (
  canvas: Canvas,
  quizData: Quiz,
  checkButton: TextBox,
  options: Option[],
  toast: TextBox,
  nextButton: QuizImage,
) => {
  const selectedOptions = store.get(selectedOptionsAtom)

  checkButton.on('mouseover', () => {
    checkButton.setRect({ fill: COLOR.LIGHT_PURPLE })
    canvas.renderAll()
  })

  checkButton.on('mouseout', () => {
    checkButton.setRect({ fill: COLOR.PURPLE })
    canvas.renderAll()
  })

  checkButton.on('mousedown', () => {
    if (quizData.type !== 'DRAG') {
      let isAllCorrect = true
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

        selectedOptionList.forEach(i => {
          const option = options[i]
          if (quizData.answer[i]) option.showIsCorrect()
          else {
            option.showIsWrong()
            isAllCorrect = false
          }
        })

        if (isAllCorrect) {
          showToast(canvas, toast, '정답이에요! 다음으로 넘어가볼까요?')
          nextButton.setGroup({ opacity: 100, visibility: true })
        } else {
          if (store.get(tryCountAtom) === 1) {
            showToast(canvas, toast, `이번엔 틀렸어요. 다음엔 조금 더 노력해봐요!`)
            checkButton.setGroup({ evented: false })
            nextButton.setGroup({ opacity: 100, visibility: true })
          } else showToast(canvas, toast, `다시 한 번 풀어볼까요? ${store.get(tryCountAtom) - 1}번의 기회가 남았어요.`)
          checkButton.setText({ text: '다시 풀기' })
        }

        options.forEach(option => option.setGroup({ evented: false }))

        canvas.renderAll()
      } else {
        isAllCorrect = true
        selectedOptions.clear()
        options.forEach(option => option.reset())
        store.set(tryCountAtom, store.get(tryCountAtom) - 1)
        checkButton.setText({ text: '채점하기' })
      }
    }

