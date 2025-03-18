import { SIZE } from '../libs/constants'

export const getOptionStyle = (type: QUIZ_TYPE): OptionStyle => {
  if (type === 'SINGLE' || type === 'MULTI') return { buttonWidth: SIZE.BUTTON_WIDTH, colGap: SIZE.GAP_SM, col: 3 }
  else if (type === 'MATH') return { buttonWidth: 61, colGap: 10, col: 10 }
  else return { buttonWidth: 250, colGap: SIZE.GAP_SM, col: 3 }
}
