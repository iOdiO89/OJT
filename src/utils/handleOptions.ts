import { Canvas } from 'fabric'
import { TextBox } from '../components/shared/TextBox'
import { COLOR } from '../libs/constants'
import { hexToRGB } from './hexToRGB'
import { moveSmooth } from './moveSmooth'
import { getOverlappedSpace } from './getIntersectionArea'
import { selectedOptionsAtom, store } from '../libs/atoms'

/**
 * 선택지들의 event 처리하는 함수
 * - 단일/다중/사칙연산 문제: mouseover, mouseout, mousedown
 * - 드래그 문제: mouseover, mousedown, moving, mouseup
 *
 * @param canvas - Fabric.js 캔버스 객체
 * @param quizType - 퀴즈 유형 (DRAG, MULTI, SINGLE, MATH)
 * @param options - 선택지 TextBox 배열
 * @param labels - (optional) 드래그 문제에서 선택지와 매칭되는 label 배열
 *
 * 주요 기능:
 * 1. DRAG 유형:
 *    - 선택지를 드래그 가능하게 설정
 *    - label과 겹칠 경우, 겹친 면적에 따라 시각적 피드백 제공
 *    - 드래그 종료 시, label에 선택지를 매칭하거나 원래 위치로 복귀
 * 2. MULTI, SINGLE, MATH 유형:
 *    - 선택지를 클릭해 정답 선택/해제
 *    - 단일 선택(SINGLE, MATH)에서는 하나만 선택되도록 처리
 */
export const handleOptions = (canvas: Canvas, quizType: QUIZ_TYPE, options: TextBox[], labels?: TextBox[]) => {
  /* MULTI, SINGLE, MATH 유형 */
  if (quizType !== 'DRAG') {
    const selectedOptions = store.get(selectedOptionsAtom)
    selectedOptions.clear()

    options.forEach((option, index) => {
      option.on('mouseover', () => {
        if (!selectedOptions.has(index)) option.setRect({ stroke: COLOR.GREEN, fill: hexToRGB(COLOR.GREEN, 0.01) })

        canvas.renderAll()
      })

      /* 선택 해제시, 기본 색상 복귀 */
      option.on('mouseout', () => {
        if (!selectedOptions.has(index)) {
          option.setRect({ stroke: COLOR.GRAY, fill: 'white' })
          canvas.renderAll()
        }
      })

      /* 선택지 토글 처리 및 단일/다중 선택 기능 */
      let selectedOption: TextBox | null = null
      option.on('mousedown', () => {
        if (quizType === 'MULTI') {
          if (selectedOptions.has(index)) selectedOptions.delete(index)
          else selectedOptions.add(index)
        } else if (quizType === 'SINGLE' || quizType === 'MATH') {
          if (selectedOption && selectedOption !== option) {
            selectedOptions.clear()
            selectedOption.getRectObject().set({ stroke: COLOR.GRAY, fill: 'white' })
          }

          if (selectedOption === option) {
            selectedOptions.clear()
            selectedOption = null
          } else {
            selectedOptions.add(index)
            selectedOption = option
          }
        }

        option.setRect({
          stroke: selectedOptions.has(index) ? COLOR.GREEN : COLOR.GRAY,
          fill: selectedOptions.has(index) ? hexToRGB(COLOR.GREEN, 0.01) : 'white'
        })

        /* 선택된 옵션 index를 selectedOptionsAtom에 저장 */
        store.set(selectedOptionsAtom, selectedOptions)

        canvas.renderAll()
      })
    })
  } else if (quizType === 'DRAG' && labels) {
    /* 각 label에 어떤 option이 매칭됐는지 기록 */
    let selectedOptions = Array(labels.length).fill(undefined)

    options.forEach(option => {
      /* 드래그 가능하게 설정 */
      option.setGroup({ selectable: true, hasBorders: false, hasControls: false })

      let prevOverlappedLabel: TextBox | undefined /* 이전에 겹쳐진 label */
      let maxOverlappedLabel: TextBox | undefined /* 현재 겹쳐진 label */
      option.on('moving', () => {
        /* 가장 많이 겹치는 label 찾기 */
        let maxOverlappedSpace = 0
        for (const label of labels) {
          const overlappedSpace = getOverlappedSpace(option.getGroupObject(), label)
          if (overlappedSpace > maxOverlappedSpace) {
            maxOverlappedSpace = overlappedSpace
            maxOverlappedLabel = label
          }
        }

        /* 이전에 겹쳤던 label의 색상 초기화 (현재 겹쳐지는 label만 강조되도록) */
        if (prevOverlappedLabel && prevOverlappedLabel != maxOverlappedLabel) {
          if (prevOverlappedLabel.getTextValue() === '?') prevOverlappedLabel.setRect({ fill: COLOR.SUPER_LIGHT_GRAY })
          else prevOverlappedLabel.setRect({ fill: hexToRGB(COLOR.GREEN, 0.2) })
        }

        /* 현재 가장 많이 겹친 label 1개만 색상 변경 */
        if (maxOverlappedLabel) {
          if (maxOverlappedSpace > 0 && maxOverlappedLabel.getTextValue() !== '?')
            maxOverlappedLabel.setRect({ fill: hexToRGB(COLOR.GREEN, 0.3) }) /* 이미 선택된 label인 경우 진한 초록 */
          else if (maxOverlappedSpace > 0)
            maxOverlappedLabel.setRect({ fill: hexToRGB(COLOR.GREEN, 0.2) }) /* 비어있는 label인 경우 연한 초록 */
          else if (maxOverlappedLabel.getTextValue() === '?')
            maxOverlappedLabel.setRect({ fill: COLOR.SUPER_LIGHT_GRAY }) /* 겹치지 않으면 기본 색상 */
        }

        prevOverlappedLabel = maxOverlappedLabel
        canvas.renderAll()
      })

      /* moving 전 돌아가야 할 기존 위치 저장 */
      option.on('mousedown', () => {
        option.setInitPosition(option.getGroupObject().left, option.getGroupObject().top)
      })

      option.on('mouseup', () => {
        /* moving시 마지막으로 가장 많이 겹쳐있던 label이 현재도 겹쳐있는지 확인 */
        if (maxOverlappedLabel && option.getGroupObject().intersectsWithObject(maxOverlappedLabel.getGroupObject())) {
          /* 해당 label에 선택된 옵션이 있는 경우 - 해당 옵션 활성화 처리 */
          const prevLabelIndex = labels.findIndex(input => input === maxOverlappedLabel)
          if (prevLabelIndex >= 0) {
            const prevOption = selectedOptions[prevLabelIndex]
            if (prevOption) {
              prevOption.setText({ fill: 'black' })
              prevOption.setGroup({ evented: true })
            }

            selectedOptions[prevLabelIndex] = option
          }

          /* label에 선택지 텍스트 매칭 */
          maxOverlappedLabel.setText({ text: option.getTextValue() })

          /* 선택된 옵션 비활성화 처리 */
          option.setText({ fill: COLOR.GRAY })
          option.setGroup({ evented: false })
        }

        /* 선택지를 원래 위치로 이동 */
        const optionGroup = option.getGroupObject()
        const initPos = option.getInitPosition()
        moveSmooth(option, optionGroup.left, optionGroup.top, initPos.left, initPos.top)
        canvas.renderAll()
      })
    })
  }
}
