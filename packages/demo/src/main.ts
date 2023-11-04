import App from './App.vue'
import GridLayout from '@noction/vue-draggable-grid/dist/vue3-drr-grid-layout.mjs'
import '@noction/vue-draggable-grid/dist/style.css'
import { createApp } from 'vue'

const app = createApp(App)

app.use(GridLayout)

app.mount('#app')
