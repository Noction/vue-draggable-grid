import type { GridItemEvents } from '@/types/grid-item'
import type { Breakpoints, BreakpointsKeys, Layout, ResponsiveLayout } from '@/types/helpers'
import type { Id, IntersectionObserverConfig } from '@/types/components'

type LayoutEventKey =
  | 'noc-layout-before-mount'
  | 'noc-layout-create'
  | 'noc-layout-mount'
  | 'noc-layout-ready'
  | 'noc-layout-update'
  | 'update:noc-layout'

type LayoutEvents = {
  [Key in LayoutEventKey]: [layout: Layout]
}

type BreakpointEventPayload = {
  breakpoint: BreakpointsKeys
  layout: Layout
}

export type GridLayoutEvents =
  & Pick<GridItemEvents, 'noc-resize-container'>
  & LayoutEvents
  & {
    'noc-intersection-observe': [id: Id[]]
    'noc-intersection-unobserve': [id: Id[]]
    'noc-item-move': GridItemEvents['noc-move']
    'noc-item-move-end': GridItemEvents['noc-move-end']
    'noc-item-resize': GridItemEvents['noc-resize']
    'noc-item-resize-end': GridItemEvents['noc-resize-end']
    'update:noc-breakpoint': [payload: BreakpointEventPayload]
}

export type GridLayoutProps = {
  colNum: number
  layout: Layout

  autoSize?: boolean
  breakpoints?: Breakpoints
  cols?: Breakpoints
  horizontalShift?: boolean
  intersectionObserverConfig?: IntersectionObserverConfig
  isDraggable?: boolean
  isResizable?: boolean
  margin?: number[]
  maxRows?: number
  preventCollision?: boolean,
  responsive?: boolean
  responsiveLayouts?: ResponsiveLayout
  rowHeight?: number
  useCssTransforms?: boolean
  useObserver?: boolean
  verticalCompact?: boolean
}
