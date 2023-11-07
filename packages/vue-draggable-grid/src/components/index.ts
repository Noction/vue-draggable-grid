import { App } from 'vue'
import GridItem from './GridItem/GridItem.vue'
import GridLayout from './GridLayout/GridLayout.vue'

const components = {
  GridItem,
  GridLayout
}

export {
  GridItem,
  GridLayout
}

type AppWithDraggableGrid = App & { $_v3DRRGridLayout?: true}

function install (app: AppWithDraggableGrid) {
  if ('$_v3DRRGridLayout' in app && app.$_v3DRRGridLayout) return

  app.$_v3DRRGridLayout = true

  ;(Object.keys(components) as (keyof typeof components)[]).forEach(name => {
    app.component(name, components[name])
  })
}

export default {
  install
}
