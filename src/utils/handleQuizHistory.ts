import { Option } from '../components/quiz/Option'

const QUIZ_HISTORY_KEY = 'QUIZ_HISTORY'

/**
 * 현재 문제의 풀이 결과를 QuizHistory 형태로 가공하는 함수
 *
 * @param quizData - 현재 문제의 퀴즈 데이터
 * @param selectedOptions - 선택된 Option Index들
 * @param options - 선택지
 * @param labels - (optional) 드래그 문제인 경우 필요
 * @returns
 */
export function createQuizHistory(
  quizData: Quiz,
  selectedOptions: Set<number>,
  options: Option[],
  labels?: Option[]
): QuizHistory {
  const isCorrectList: boolean[] = [] /* 각 정답에 대해 맞췄는지 여부 저장 */
  const userAnswer: string[] = [] /* 사용자가 선택한 답안 리스트 */
  const answerList: string[] = [] /* 정답 리스트 */
  let isAllCorrect = true /* 모든 답을 맞췄는지 여부 */

  /* SINGLE, MULTI, MATH 문제 */
  if (quizData.type !== 'DRAG') {
    quizData.answer.forEach((answerFlag, index) => {
      if (answerFlag) {
        const userSelected = selectedOptions.has(index)
        isCorrectList.push(userSelected) /* 정답일 때 맞췄는지 여부 저장 */
        answerList.push(quizData.options[index])
        if (userSelected) userAnswer.push(options[index].getTextValue())
        if (!userSelected) isAllCorrect = false
      } else {
        /* 오답 선택한 경우도 기록 */
        if (selectedOptions.has(index)) {
          userAnswer.push(options[index].getTextValue())
          isAllCorrect = false
        }
      }
    })
  } else if (quizData.type === 'DRAG' && labels) {
    /* DRAG 문제 처리 */
    labels.forEach((label, index) => {
      const labelText = label.getTextValue()
      const correct = labelText === quizData.answer[index]
      isCorrectList.push(correct)
      userAnswer.push(labelText)
      if (!correct) isAllCorrect = false
    })
    quizData.answer.forEach(ans => answerList.push(ans))
  }

  return {
    isAllCorrect,
    isCorrect: isCorrectList,
    answer: answerList,
    topic: quizData.topic
  }
}

/* 새로운 풀이 기록을 sessionStorage에 추가로 저장 */
export function saveQuizHistory(history: QuizHistory) {
  const prevData = sessionStorage.getItem(QUIZ_HISTORY_KEY)

  let historyList: QuizHistory[] = []
  if (prevData) {
    try {
      historyList = JSON.parse(prevData) as QuizHistory[]
    } catch (e) {
      console.error('퀴즈 풀이 기록 가져오기 실패: ', e)
      historyList = []
    }
  }

  historyList.push(history)

  sessionStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(historyList))
}

/* 저장된 모든 퀴즈 풀이 기록 가져오기 */
export function getQuizHistory(): QuizHistory[] {
  const data = sessionStorage.getItem(QUIZ_HISTORY_KEY)
  if (!data) return []
  try {
    return JSON.parse(data) as QuizHistory[]
  } catch (e) {
    console.error('퀴즈 풀이 기록 파싱 실패:', e)
    return []
  }
}

/* 저장된 모든 퀴즈 풀이 기록 삭제 */
export function clearQuizHistory() {
  sessionStorage.removeItem(QUIZ_HISTORY_KEY)
}
