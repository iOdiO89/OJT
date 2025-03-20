import { Canvas } from 'fabric'
import { TextBox } from '../components/shared/TextBox'
import { canvasAtom, quizAtom, selectedOptionsAtom, store, tryCountAtom } from '../libs/atoms'
import { COLOR } from '../libs/constants'
import { showToast } from './showToast'
import { Option } from '../components/quiz/Option'
import { QuizImage } from '../components/quiz/QuizImage'
import { hexToRGB } from './hexToRGB'

/**
 * 사용자가 선택한 답안을 확인하고, 정오답 여부에 따라 UI와 상태를 업데이트하는 함수
 *
 * @param checkButton - 채점하기 or 다시풀기 버튼
 * @param options - 선택지 Option 리스트
 * @param toast - 토스트 TextBox
 * @param nextButton - 다음 페이지로 넘어가는 TextBox 버튼
 * @param labels - (optional) 드래그앤드롭 문제 타입일 때 정답을 표시하는 라벨 리스트
 *
 * 주요 기능:
 * 1. 선택한 답이 없는 경우, 사용자에게 답을 선택하라는 알림 표시
 * 2. 선택한 답이 정답과 일치하는 경우:
 *    - 정답 표시
 *    - 다음 페이지 이동 버튼 활성화
 *    - 채점 버튼 비활성화
 * 3. 오답이 있는 경우:
 *    - 시도 기회가 남아 있다면: 선택한 선택지에 대해서만 정오답 표시, 채점 버튼을 '다시 풀기'로 변경
 *    - 마지막 시도라면: 모든 선택지에 대해 정오답 표시, 다음 버튼 활성화
 * 4. 다시 풀기 클릭 시: 선택지 및 상태 초기화, 시도 횟수 차감
 */
export const checkAnswer = (
  checkButton: TextBox,
  options: Option[],
  toast: TextBox,
  nextButton: QuizImage,
  labels?: Option[]
) => {
  const canvas = store.get(canvasAtom)
  const quizData = store.get(quizAtom)
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
    /**
     * 문제 정답과 선택한 선택지가 완전히 일치한지 여부를 저장하는 변수
     * - 완전히 일치한 경우: isAllCorrect = true
     * - 하나라도 다른 게 존재하는 경우: isAllCorrect = false
     */
    let isAllCorrect = true

    if (quizData.type !== 'DRAG') {
      if (checkButton.getTextValue() === '채점하기') {
        /* 아무것도 선택하지 않은 경우 - 답을 선택하기 전까지는 정답 판별 로직 진입 불가 */
        if (selectedOptions.size === 0) {
          showToast(canvas, toast, '선택된 답이 없습니다. 답을 선택해주세요!')
          return
        }

        /* 문제 정답과 선택한 선택지가 완전히 일치한지 확인 */
        const selectedOptionList = [...selectedOptions]
        options.forEach((_, index) => {
          if (quizData.answer[index] && !selectedOptions.has(index)) {
            isAllCorrect = false
          } else if (!quizData.answer[index] && selectedOptions.has(index)) isAllCorrect = false
        })

        /* 다 맞은 경우 - checkButton disabled 처리 & nextButton 보여주기 */
        if (isAllCorrect) {
          selectedOptionList.forEach(i => options[i].showIsCorrect())
          showToast(canvas, toast, '정답이에요! 다음으로 넘어가볼까요?')
          checkButton.setGroup({ evented: false })
          nextButton.setGroup({ opacity: 100, visibility: true })
        } else {
          /* 틀린 문제가 있거나 선택하지 않은 정답이 있는 경우 */

          if (store.get(tryCountAtom) === 1) {
            /**
             * < 마지막 시도인 경우 >
             * 모든 선택지에 대해 정답 판별. 정오답 표시
             * answerButton 비활성화
             * nextButton 보이기
             */
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
            /**
             * < 마지막 시도가 아닌 경우 >
             * 선택한 선택지에 대해서만 정오답 판별.
             * checkButton 텍스트 '채점하기' -> '다시 풀기'로 변경
             */
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

        /* 채점 이후 선택지 다시 클릭할 수 없도록 이벤트 비활성화 */
        options.forEach(option => option.setGroup({ evented: false }))
        canvas.renderAll()
      } else if (checkButton.getTextValue() === '다시 풀기') {
        /* 다시 풀기 클릭 시 선택지 초기화 */
        isAllCorrect = true
        selectedOptions.clear()
        options.forEach(option => option.reset())
        store.set(tryCountAtom, store.get(tryCountAtom) - 1)
        checkButton.setText({ text: '채점하기' })
      }
    } else if (quizData.type === 'DRAG' && labels) {
      /* 아직 풀지 않은 문제가 있는 경우 - 답을 모두 선택하기 전까지는 정답 판별 로직 진입 불가 */
      if (labels.some(label => label.getTextValue() === '?')) {
        showToast(canvas, toast, '아직 풀지 않은 문제가 있어요.')
        return
      }

      if (checkButton.getTextValue() === '채점하기') {
        /* 드래그 타입 문제 정답 체크 */
        labels.forEach((label, index) => {
          if (label.getTextValue() !== quizData.answer[index]) isAllCorrect = false
        })

        if (isAllCorrect) {
          /* 모두 정답일 경우 처리 */
          labels.forEach(label => label.showIsCorrect())
          showToast(canvas, toast, '정답이에요! 다음으로 넘어가볼까요?')
          checkButton.setGroup({ evented: false })
          nextButton.setGroup({ opacity: 100, visibility: true })
        } else {
          if (store.get(tryCountAtom) === 1) {
            /**
             * < 마지막 시도인 경우 >
             * 정오답 표시
             * 오답인 경우, 정답 text도 함께 표시
             */
            labels.forEach((label, index) => {
              if (label.getTextValue() === quizData.answer[index]) label.showIsCorrect()
              else {
                label.showIsWrong(false)
                label.setText({
                  fill: COLOR.RED,
                  text: `${label.getTextValue()} ${quizData.answer[index]}`
                })

                /* 오답 부분은 취소선 처리 */
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
            /**
             * < 마지막 시도가 아닌 경우 >
             * 드래그 문제 선택지에 대한 정오답 표시 후 다시 풀기
             */
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
        /* 다시 풀기 클릭 시 - 정답 상태 및 UI 초기화 */
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
