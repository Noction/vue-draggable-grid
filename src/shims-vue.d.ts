/* eslint-disable */
import {Emitter} from "mitt";
import { GridLayoutEvent } from "@/types/components";
import { Interactable } from '@interactjs/core/Interactable'

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


declare module '@interactjs/core/InteractStatic' {
  interface InteractStatic {
    draggable(opts: {
      onstart(event: any): void
      onmove(event: any): void
      onend(event: any): void
      startAxis: 'x' | 'y' | 'xy'
      lockAxis: 'x' | 'y' | 'xy' | 'start'
      max: number
      maxPerElement: number
    }): void
  }
}
