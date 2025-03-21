import { FabricObject } from 'fabric'

/**
 * 주어진 Fabric 객체의 가로, 세로 크기를 반환하는 함수
 *
 * @param object - 크기를 측정할 Fabric 객체
 * @returns [width, height] 배열
 */
export const getObjectSize = (object: FabricObject) => {
  const width = object.getScaledWidth()
  const height = object.getScaledHeight()

  return [width, height]
}

/**
 * 주어진 Fabric 객체들의 최상단, 최하단 Y값을 반환하는 함수
 * - return 값을 활용하면 objects의 Height를 구할 수 있음
 *
 * @param objects - 위치를 측정할 Fabric 객체 배열
 * @returns [최상단Y값, 최하단Y값] 배열
 */
export function getObjectPos(objects: FabricObject[]): [number, number] {
  if (objects.length === 0) return [-1, -1]

  let startY = Infinity
  let endY = -Infinity

  for (const obj of objects) {
    const top = obj.top
    const bottom = obj.top + obj.height

    if (top < startY) startY = top
    if (bottom > endY) endY = bottom
  }

  return [startY, endY]
}

/**
 * 주어진 Fabric 객체를 originTop -> newTop으로 수직이동하는 함수
 *
 * @param objects - 움직일 Fabric 객체 배열
 * @param originTop - 기존 Top 값
 * @param newTop - 움직인 이후의 Top 값
 */
export function placeObject(objects: FabricObject[], originTop: number, newTop: number) {
  if (objects.length === 0) return

  const shiftY = newTop - originTop
  for (const object of objects) {
    object.set({ top: object.top! + shiftY })
    object.setCoords()
  }
}
