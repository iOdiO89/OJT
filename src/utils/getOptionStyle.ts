export const getOptionStyle = (type: QUIZ_TYPE) => {
  if (type === 'SINGLE' || type === 'MULTI') return { buttonWidth: 250, colGap: 20, column: 3 }
  else if (type === 'MATH') return { buttonWidth: 61, colGap: 10, column: 10 }
}
