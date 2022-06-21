export type Breakpoint = string

export type Breakpoints = { lg?: number, md?: number, sm?: number, xs?: number, xxs?: number }

interface HW {
  height: string
  width: string
}

interface Position extends HW {
  position: string
  top: string
}

export type Layout = LayoutItem[]

export type LayoutItem = LayoutItemRequired &
  {minW?: number, minH?: number, maxW?: number, maxH?: number,
    moved?: boolean, static?: boolean,
    isDraggable?: boolean, isResizable?: boolean}

export type LayoutItemRequired = {w: number, h: number, x: number, y: number, i: string}

export interface PositionLeft extends Position {
  left: string
}

export type ResponsiveLayout = { lg?: Layout, md?: Layout, sm?: Layout, xs?: Layout, xxs?: Layout }

export interface Transform extends HW{
  transform: string
  position: string
}

export type findOrGenerateResponsiveLayoutFnc = (orgLayout: Layout, layouts: ResponsiveLayout, breakpoints: Breakpoints, breakpoint: Breakpoint, lastBreakpoint: Breakpoint, cols: number, verticalCompact: boolean) => Layout

export type setPositionFnc<Position> = (top: number, left: number, width: number, height: number) => Position
