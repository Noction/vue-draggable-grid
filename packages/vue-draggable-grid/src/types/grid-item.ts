import type { Breakpoints, BreakpointsKeys } from '@/types/helpers'
import type { Dimensions, GridItemPosition, Id } from '@/types/components'

export type GridItemEvents = {
  'noc-resize-container': [payload: ResizePayload]
  'noc-resize': [payload: ResizePayload]
  'noc-resize-end': [payload: ResizePayload]
  'noc-move': [payload: MovePayload]
  'noc-move-end': [payload: MovePayload]
}
export type GridItemProps = {
  breakpointCols: Breakpoints
  colNum: number
  containerWidth: number
  h: number
  id: Id
  isDraggable: boolean
  isResizable: boolean
  lastBreakpoint: BreakpointsKeys
  margin: number[]
  maxRows: number
  rowHeight: number
  useCssTransforms: boolean
  w: number
  x: number
  y: number

  dragAllowFrom?: string | null
  dragIgnoreFrom?: string
  dragOption?: object
  maxH?: number
  maxW?: number
  minH?: number
  minW?: number
  observer?: IntersectionObserver | undefined
  isStatic?: boolean
}

export type MovePayload = Pick<Dimensions, 'x' | 'y'> & Record<'id', Id>

export type ResizePayload = Pick<Dimensions, 'h' | 'w'> & Pick<GridItemPosition, 'height' | 'width'> & Record<'id', Id>
