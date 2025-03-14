export const hexToRGB = (hex: string, opacity?: number) => {
  hex = hex.replace(/^#/, '')

  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  if (opacity) return `rgba(${r}, ${g}, ${b}, ${opacity})`
  return `rgb(${r}, ${g}, ${b})`
}
