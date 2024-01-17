import type { GridLayoutEvent } from '@/types/components'

export type MittEvents = {
  'set-col-num': number | undefined
  'recalculate-styles': void
  'resize-event': GridLayoutEvent
  'drag-event': GridLayoutEvent
}
