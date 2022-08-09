import { GridLayoutEvent } from './components'

export type Events = {
  'set-col-num': number
  'recalculate-styles': void
  'resize-event': GridLayoutEvent
  'drag-event': GridLayoutEvent
}
