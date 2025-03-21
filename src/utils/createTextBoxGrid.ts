import { TextBox } from '../components/shared/TextBox'
import { CANVAS, SIZE } from '../libs/constants'
import { getObjectSize } from './handleFabricObject'

/**
 * 지정한 grid 조건에 맞춰 TextBox 또는 Option Class 객체들을 생성합니다.
 *
 * 가로 정렬: align-items
 * 세로 정렬: flex-start
 *
 * @param classType - 생성할 TextBox 클래스 (TextBox 또는 Option만 사용할 것)
 * @param textList - 각 박스에 표시될 String Array
 * @param startPos - grid의 시작 Top 위치
 * @param col - grid의 열 개수 (기본값: 3)
 * @param rowGap - 행 간 간격 (기본값: SIZE.GAP_SM)
 * @param colGap - 열 간 간격 (기본값: SIZE.GAP_SM)
 * @param textProperties - 텍스트에 적용할 추가 스타일 속성 (객체 형식)
 * @param rectProperties - 박스(Rect)에 적용할 추가 스타일 속성 (객체 형식)
 * @param groupProperties - 그룹(Group)에 적용할 추가 스타일 속성 (객체 형식)
 * @returns 생성된 TextBox 또는 Option Array
 */
export function createTextBoxGrid<T extends TextBox>(
  classType: new (textValue: string, width?: number) => T,
  textList: string[],
  startPos: number,
  col: number = 3,
  rowGap: number = SIZE.GAP_SM,
  colGap: number = SIZE.GAP_SM,
  textProperties?: Record<string, unknown>,
  rectProperties?: Record<string, unknown>,
  groupProperties?: Record<string, unknown>
): T[] {
  const textBoxes: T[] = []

  /* rectProperties에 width 항목을 따로 설정하지 않으면 기본값 SIZE.BUTTON_WIDTH 사용 */
  const textBoxWidth =
    rectProperties && 'width' in rectProperties ? (rectProperties.width as number) : SIZE.BUTTON_WIDTH

  const gridWidth = col * textBoxWidth + (col - 1) * colGap
  const startX = (CANVAS.WIDTH - gridWidth) / 2

  textList.forEach((text, index) => {
    const textBox = new classType(text, textBoxWidth)

    if (textProperties) textBox.setText(textProperties)
    if (rectProperties) textBox.setRect(rectProperties)
    if (groupProperties) textBox.setGroup(groupProperties)

    const [, rectHeight] = getObjectSize(textBox.getRectObject())

    /* 계산된 좌표로 그룹 위치 설정 */
    const colIndex = index % col
    const rowIndex = Math.floor(index / col)

    const left = startX + colIndex * (textBoxWidth + colGap)
    const top = startPos + rowIndex * (rectHeight + rowGap)

    textBox.setGroup({ left, top })

    /* 초기 위치 저장 */
    textBox.setInitPosition(left, top)

    textBoxes.push(textBox)
  })

  return textBoxes
}
