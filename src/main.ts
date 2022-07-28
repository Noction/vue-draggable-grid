import App from './App.vue'
import { createApp } from 'vue'
import { emitterKey } from '@/types/symbols'
import mitt from 'mitt'

const app = createApp(App)

app.config.unwrapInjectedRef = true

app.provide(emitterKey, mitt())

app.mount('#app')
