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
