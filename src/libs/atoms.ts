import { Canvas } from 'fabric'
import { createStore, atom } from 'jotai/vanilla'
import { quizData } from './dummy'

export const store = createStore()

export const canvasAtom = atom<Canvas>(new Canvas())
export const quizAtom = atom<Quiz>(quizData[0])
export const selectedOptionsAtom = atom<Set<number>>(new Set<number>())
export const tryCountAtom = atom<number>(3)
