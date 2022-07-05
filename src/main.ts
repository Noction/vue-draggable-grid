import App from './App.vue'
import { createApp } from 'vue'
import mitt from 'mitt'

const app = createApp(App)

// export type Events = {
//   name: string
// }

app.config.unwrapInjectedRef = true
app.config.globalProperties.eventBus = mitt()

app.mount('#app')
