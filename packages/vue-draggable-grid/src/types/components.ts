import { INTERSECTION_OBSERVER_ID } from '@/constants'

export type Dimension = 'h' | 'w' | 'x' | 'y'

export type Dimensions = Record<Dimension, number>

export type GridItemClass =
  | 'css-transforms'
  | 'disable-user-select'
  | 'no-touch'
  | 'resizing'
  | 'static'
  | 'vue-draggable-dragging'
  | 'vue-resizable'

export type GridItemClasses = Record<GridItemClass, boolean>

export interface GridItemPosition {
  height: number
  left: number
  top: number
  width: number
}

export type GridLayoutEvent = [string, number, number, number, number, number]

export type HTMLDivElementWithId = HTMLDivElement & Record<typeof INTERSECTION_OBSERVER_ID, string | number>

// export type Inner<Type> = Record<InnerKeys, Type>

export type Id =
  | string
  | number

export type IntersectionObserverConfig = IntersectionObserverInit
