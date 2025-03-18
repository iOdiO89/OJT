interface Route {
  path: string
  page: React.HTMLElement
  style: string
}

type QUIZ_TYPE = 'SINGLE' | 'MULTI' | 'DRAG' | 'MATH'

interface QuizBase {
  question: string
  images?: string[]
  options: string[]
}

interface QuizA extends QuizBase {
  type: 'SINGLE' | 'MULTI' | 'MATH'
  answer: boolean[]
}

interface QuizB extends QuizBase {
  type: 'DRAG'
  answer: string[]
}

type Quiz = QuizA | QuizB

