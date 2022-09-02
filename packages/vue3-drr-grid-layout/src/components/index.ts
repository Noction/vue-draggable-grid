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

function install (app: any) {
  if (app.$_v3DRRGridLayout) return

  app.$_v3DRRGridLayout = true

  ;(Object.keys(components) as (keyof typeof components)[]).forEach(name => {
    app.component(name, components[name])
  })
}

export default {
  install
}
