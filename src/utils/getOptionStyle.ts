import { SIZE } from '../libs/constants'

export const getOptionStyle = (type: QUIZ_TYPE) => {
  if (type === 'SINGLE' || type === 'MULTI') return { buttonWidth: SIZE.BUTTON_WIDTH, colGap: SIZE.GAP_SM, column: 3 }
  else if (type === 'MATH') return { buttonWidth: 61, colGap: 10, column: 10 }
  else if (type === 'DRAG') return { buttonWidth: 250, colGap: SIZE.GAP_SM, column: 3 }
}
