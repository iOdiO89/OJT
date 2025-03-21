import { Option } from '../components/quiz/Option'

const QUIZ_HISTORY_KEY = 'QUIZ_HISTORY'

export function createQuizHistory(
  quizData: Quiz,
  selectedOptions: Set<number>,
  options: Option[],
  labels?: Option[]
): QuizHistory {
  const isCorrectList: boolean[] = []
  const userAnswer: string[] = []
  const answerList: string[] = []
  let isAllCorrect = true

  if (quizData.type !== 'DRAG') {
    // SINGLE, MULTI, MATH
    quizData.answer.forEach((answerFlag, index) => {
      if (answerFlag) {
        const userSelected = selectedOptions.has(index)
        isCorrectList.push(userSelected) // 정답만 기록
        answerList.push(quizData.options[index])
        if (userSelected) userAnswer.push(options[index].getTextValue())
        if (!userSelected) isAllCorrect = false
      } else {
        // 오답인데 사용자가 선택한 것도 userAnswer에는 추가
        if (selectedOptions.has(index)) {
          userAnswer.push(options[index].getTextValue())
          isAllCorrect = false
        }
      }
    })
  } else if (quizData.type === 'DRAG' && labels) {
    // DRAG
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

export function getQuizHistory(): QuizHistory[] {
  const data = sessionStorage.getItem(QUIZ_HISTORY_KEY)
  if (!data) return []
  try {
    return JSON.parse(data) as QuizHistory[]
  } catch (e) {
    console.error('퀴즈 풀이 기록 저장하기 실패:', e)
    return []
  }
}

export function clearQuizHistory() {
  sessionStorage.removeItem(QUIZ_HISTORY_KEY)
}
