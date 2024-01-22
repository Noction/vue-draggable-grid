import type { GridItemEvents } from '@/types/grid-item'
import type { Breakpoints, BreakpointsKeys, Layout, ResponsiveLayout } from '@/types/helpers'
import type { Id, IntersectionObserverConfig } from '@/types/components'

type LayoutEventKey =
  | 'noc-layout-before-mount'
  | 'noc-layout-create'
  | 'noc-layout-mount'
  | 'noc-layout-ready'
  | 'noc-layout-update'

type VModelEvents = {
  'update:layout': [layout: Layout]
  'update:breakpoints': [breakpoints: BreakpointsKeys]
}

type LayoutEvents = {
  [Key in LayoutEventKey]: [layout: Layout]
}

export type GridLayoutEvents =
  & Pick<GridItemEvents, 'noc-resize-container'>
  & LayoutEvents
  & VModelEvents
  & {
    'noc-intersection-observe': [id: Id[]]
    'noc-intersection-unobserve': [id: Id[]]
    'noc-item-move': GridItemEvents['noc-move']
    'noc-item-move-end': GridItemEvents['noc-move-end']
    'noc-item-resize': GridItemEvents['noc-resize']
    'noc-item-resize-end': GridItemEvents['noc-resize-end']
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
  margin?: Margin
  maxRows?: number
  preventCollision?: boolean,
  responsive?: boolean
  responsiveLayouts?: ResponsiveLayout
  rowHeight?: number
  useCssTransforms?: boolean
  useObserver?: boolean
  verticalCompact?: boolean
}

export type Margin =
  | [number]
  | [number, number]
