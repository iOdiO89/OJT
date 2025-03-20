/**
 * HEX 색상 코드를 RGB(A) 문자열로 변환하는 함수
 *
 * @param hex - 변환할 HEX 색상 코드 (예: '#000000', '#000')
 * @param opacity - 0~1 사이 값. opacity 설정시 rgba로 반환
 * @returns rgb 또는 rgba로 반환
 */
export const hexToRGB = (hex: string, opacity?: number): string => {
  hex = hex.replace(/^#/, '')

  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  if (opacity !== undefined) return `rgba(${r}, ${g}, ${b}, ${opacity})`
  return `rgb(${r}, ${g}, ${b})`
}
