import { Interactable } from '@interactjs/core/Interactable'
import elementResizeDetectorMaker from 'element-resize-detector'
import { BreakpointsKeys, Layout, LayoutItemRequired, Position, ResponsiveLayout, Transform } from '@/types/helpers'

export interface GridItemData {
  cols: number
  containerWidth: number
  dragEventSet: boolean
  draggable: boolean
  dragging: { left: number; top: number } | null
  innerH: number
  innerW: number
  innerX: number
  innerY: number
  isDragging: boolean
  isResizing: boolean
  lastH: number
  lastW: number
  lastX: number
  lastY: number
  interactObj: Interactable | null
  margin: [number, number]
  maxRows: number
  previousH: null
  previousW: null
  previousX: null
  previousY: null
  resizable: boolean
  resizeEventSet: boolean
  resizing: { height: number; width: number } | null
  rowHeight: number
  style: Position | Transform
  useCssTransforms: boolean
  useStyleCursor: boolean
}

export interface GridLayoutData {
  erd: elementResizeDetectorMaker.Erd
  isDragging: boolean
  lastBreakpoint: BreakpointsKeys
  lastLayoutLength: number
  layouts: ResponsiveLayout
  mergedStyle: Record<any, any>
  originalLayout: Layout
  placeholder: LayoutItemRequired
  width: number
}

export type GridLayoutEvent = [string, string, number, number, number, number]
