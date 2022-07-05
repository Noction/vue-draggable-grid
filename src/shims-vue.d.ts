/* eslint-disable */
import {Emitter} from "mitt";

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
    eventBus: Emitter<Record<string, any>>
  }
}
