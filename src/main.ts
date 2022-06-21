import App from './App.vue'
import { InjectionKey, createApp } from 'vue'
import mitt, { Emitter } from 'mitt'

const app = createApp(App)

// export type Events = {
//   name: string
// }

// export const emitterKey: InjectionKey<Emitter<Events>> = Symbol('eventBus')
app.config.unwrapInjectedRef = true
app.config.globalProperties.eventBus = mitt()
// app.provide(emitterKey, mitt())

app.mount('#app')
