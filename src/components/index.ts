import { App } from 'vue'
import GridItem from './GridItem.vue'
import GridLayout from './GridLayout.vue'

const VueGridLayout = {
  GridItem,
  GridLayout
}

export {
  GridItem,
  GridLayout,
  plugin
}

const plugin = {
  install
}

export function install (app: App<Element>) {
  (Object.keys(VueGridLayout) as (keyof typeof VueGridLayout)[]).forEach(name => {
    app.component(name, VueGridLayout[name])
  })
}

export default VueGridLayout
