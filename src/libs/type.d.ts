interface Route {
  path: string
  page: React.HTMLElement
  style: string
}

interface Quiz {
  question: string
  type: QUIZ_TYPE
  image?: string
  options: string[]
  answer: number[]
}

type QUIZ_TYPE = 'SINGLE' | 'MULTI' | 'DRAG' | 'MATH'

interface QuizItem {
  type: QUIZ_TYPE
  question: string
  images?: string[]
  options: string[]
  answer: boolean[]
}
