export type Breakpoints = RecordBreakpoint<number>

export type BreakpointsKeys = 'lg' | 'md' | 'sm' | 'xs' | 'xxs'

export interface HW {
  height: string
  width: string
}

export type Layout = LayoutItem[]

export type LayoutItem = LayoutItemRequired & LayoutItemOptional

export type LayoutItemOptional = {
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  moved?: boolean
  static?: boolean
  isDraggable?: boolean
  isResizable?: boolean
}

export type LayoutItemRequired = { w: number, h: number, x: number, y: number, i: string }

export interface Position extends HW {
  position: string
  top: string
  left: string
}

export type RecordBreakpoint<Type> = Partial<Record<BreakpointsKeys, Type>>

export type ResponsiveLayout = RecordBreakpoint<Layout>

export interface Transform extends HW {
  transform: string
  position: string
}

export type findOrGenerateResponsiveLayoutFnc = (orgLayout: Layout, layouts: ResponsiveLayout, breakpoints: Breakpoints, breakpoint: BreakpointsKeys, lastBreakpoint: BreakpointsKeys, cols: number, verticalCompact: boolean) => Layout

export type setPositionFnc<Position> = (top: number, left: number, width: number, height: number) => Position
