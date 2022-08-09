import App from './App.vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GridLayout from '../../vue3-drr-grid-layout/dist/vue3-drr-grid-layout.mjs'
import  '../../vue3-drr-grid-layout/dist/style.css'
import { createApp } from 'vue'

const app = createApp(App)

app.use(GridLayout)

app.mount('#app')
