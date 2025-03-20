/**
 * 이동할 페이지에 대한 정보(경로, 컴포넌트, css)
 */
interface Route {
  path: string /* 이동할 페이지 path */
  page: React.HTMLElement /* 렌더링할 React 페이지 컴포넌트 */
  style: string /* 페이지에 적용할 css 파일 이름 */
}

type QUIZ_TYPE = 'SINGLE' | 'MULTI' | 'DRAG' | 'MATH' /* 퀴즈 유형 정의 */

/**
 * 공통 퀴즈 속성을 정의하는 기본 인터페이스
 */
interface QuizBase {
  question: string /* 문제 텍스트 */
  images?: string[] /* 문제와 함께 표시될 이미지 경로 리스트*/
  options: string[] /* 선택지 배열 */
}

/**
 * 단답형, 객관식, 수학 문제 유형의 퀴즈 타입
 */
interface QuizA extends QuizBase {
  type: 'SINGLE' | 'MULTI' | 'MATH' /* 퀴즈 유형 */
  answer: boolean[] /* 각 선택지의 정답 여부 */
}

/**
 * 드래그 앤 드롭 유형 퀴즈 타입
 */
interface QuizB extends QuizBase {
  type: 'DRAG' /* 퀴즈 유형 고정: DRAG */
  answer: string[] /* 각 정답 라벨의 정답 값 */
}

/* 전체 퀴즈 타입 - QuizA 또는 QuizB */
type Quiz = QuizA | QuizB
