/* eslint-disable */
import {Emitter} from "mitt";
import { GridLayoutEvent } from "@/types/components";

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

export {}

declare module 'vue' {
  import { Emitter } from "mitt"

  interface ComponentCustomProperties {
    $refs: {
      [key: string]: HTMLElement
    }
    eventBus: Emitter<{
      'drag-event': GridLayoutEvent
      'resize-event': GridLayoutEvent
      'recalculate-styles': void
      'set-col-num': number
    }>
  }
}
