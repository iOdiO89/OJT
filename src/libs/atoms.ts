import { Canvas } from 'fabric'
import { createStore, atom } from 'jotai/vanilla'
import { quizData } from './dummy'

export const store = createStore()

/* Canvas 객체 저장 */
export const canvasAtom = atom<Canvas>(new Canvas())

/* 현재 퀴즈 데이터 상태 저장 */
export const quizAtom = atom<Quiz>(quizData[0])

/* 선택된 Option index 저장 */
export const selectedOptionsAtom = atom<Set<number>>(new Set<number>())

/* 사용자가 문제를 풀 수 있는 남은 시도 횟수 상태 - 최대 3번 */
export const tryCountAtom = atom<number>(3)
