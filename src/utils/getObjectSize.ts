import { FabricObject } from 'fabric'

export const getObjectSize = (object: FabricObject) => {
  const width = object.getScaledWidth()
  const height = object.getScaledHeight()

  return [width, height]
}
