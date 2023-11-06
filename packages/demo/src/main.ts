import '@noction/vue-draggable-grid/styles'
import App from './App.vue'
import VueDraggableGrid from '@noction/vue-draggable-grid'
import { createApp } from 'vue'

const app = createApp(App)

app.use(VueDraggableGrid)

app.mount('#app')
