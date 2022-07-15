import elementResizeDetectorMaker from 'element-resize-detector'
import {
  BreakpointsKeys,
  Layout,
  LayoutItemRequired,
  Position,
  ResponsiveLayout,
  Transform
} from '@/types/helpers'

type InnerKeys = 'h' | 'w' | 'x' | 'y'

type Inner<Type> = Record<InnerKeys, Type>

export interface GridItemClasses {
  'css-transforms': boolean
  'disable-user-select': boolean
  'no-touch': boolean
  resizing: boolean
  static: boolean
  'vue-draggable-dragging' : boolean
  'vue-resizable' : boolean
}

export interface GridItemData {
  cols: number
  dragEventSet: boolean
  dragging: { left?: number; top?: number }
  inner: Inner<number>
  interactObj: any
  isDragging: boolean
  isResizing: boolean
  lastInner: Inner<number>
  previousInner: Inner<number>
  resizeEventSet: boolean
  resizing: { height: number; width: number } | null
  style: Position | Transform | object
}

export interface GridItemPosition {
  height: number
  left: number
  top: number
  width: number
}

export interface GridLayoutData {
  erd: elementResizeDetectorMaker.Erd
  isDragging: boolean
  lastBreakpoint: BreakpointsKeys
  lastLayoutLength: number
  layouts: ResponsiveLayout
  mergedStyle: { height?: string }
  originalLayout: Layout
  placeholder: LayoutItemRequired
  width: number
}

export type GridLayoutEvent = [string, string, number, number, number, number]
