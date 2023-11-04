type InnerKeys = 'h' | 'w' | 'x' | 'y'

export interface GridItemClasses {
  'css-transforms': boolean
  'disable-user-select': boolean
  'no-touch': boolean
  resizing: boolean
  static: boolean
  'vue-draggable-dragging' : boolean
  'vue-resizable' : boolean
}

export interface GridItemPosition {
  height: number
  left: number
  top: number
  width: number
}

export type GridLayoutEvent = [string, number, number, number, number, number]

export type Inner<Type> = Record<InnerKeys, Type>

export type IntersectionObserverConfig = IntersectionObserverInit
