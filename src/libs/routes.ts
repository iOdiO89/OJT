import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import Quiz from '../pages/Quiz'
import { PATH } from './constants'

export const routes: Route[] = [
  { path: PATH.HOME, page: Home, style: 'home' },
  { path: PATH.NOT_FOUND, page: NotFound, style: '404' },
  { path: PATH.QUIZ, page: Quiz, style: 'quiz' }
]
