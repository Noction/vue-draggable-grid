import { Interactable } from '@interactjs/core/Interactable'
import elementResizeDetectorMaker from 'element-resize-detector'
import { BreakpointsKeys, Layout, LayoutItemRequired, Position, ResponsiveLayout, Transform } from '@/types/helpers'

type InnerKeys = 'h' | 'w' | 'x' | 'y'

type Inner<Type> = Record<InnerKeys, Type>

export interface GridItemData {
  cols: number
  dragEventSet: boolean
  dragging: { left: number; top: number } | null
  inner: Inner<number>
  interactObj: Interactable | null
  isDragging: boolean
  isResizing: boolean
  lastInner: Inner<number>
  previousInner: Inner<number>
  resizeEventSet: boolean
  resizing: { height: number; width: number } | null
  style: Position | Transform | object
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
