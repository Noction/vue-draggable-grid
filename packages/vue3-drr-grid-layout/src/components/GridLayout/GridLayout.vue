<template>
  <div>
    <div
      ref="wrapper"
      class="vue-grid-layout"
      :style="mergedStyle"
    >
      <grid-item
        v-show="isDragging"
        class="vue-grid-placeholder"
        v-bind="{ ...gridItemProps, ...placeholder }"
      />
      <slot :grid-item-props="{ ...gridItemProps, observer }">
        <grid-item
          v-for="layoutItem in layout"
          :key="layoutItem.i"
          v-bind="{ ...gridItemProps, ...layoutItemOptional(layoutItem) }"
          :observer="observer"
          @container-resized="emit('container-resized', $event)"
          @resize="emit('item-resize', $event)"
          @move="emit('item-move', $event)"
          @moved="emit('item-moved', $event)"
        >
          <slot
            name="gridItemContent"
            :item="layoutItem"
          />
        </grid-item>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Events } from '../../types/globals'
import GridItem from '../GridItem/GridItem.vue'
import elementResizeDetectorMaker from 'element-resize-detector'
import { emitterKey } from '../../types/symbols'
import mitt from 'mitt'
import {
  Breakpoints,
  BreakpointsKeys,
  Layout,
  LayoutItem,
  RecordBreakpoint,
  ResponsiveLayout
} from '../../types/helpers'
import { GridLayoutEvent, IntersectionObserverConfig } from '../../types/components'
import {
  PropType,
  computed,
  defineEmits,
  defineProps,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  watch
} from 'vue'
import { addWindowEventListener, removeWindowEventListener } from '../../helpers/DOM'
import {
  bottom,
  cloneLayout,
  compact,
  getAllCollisions,
  getGroupWidgetByHeightInAxis,
  getLayoutItem,
  moveElement
} from '../../helpers/utils'
import {
  breakpointsValidator,
  intersectionObserverConfigValidator,
  layoutValidator,
  marginValidator
} from '../../helpers/propsValidators'
import {
  findOrGenerateResponsiveLayout,
  getBreakpointFromWidth,
  getColsFromBreakpoint
} from '../../helpers/responsiveUtils'

const props = defineProps({
  autoSize: {
    default: true,
    type: Boolean
  },
  breakpoints: {
    default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }),
    type: Object as PropType<Breakpoints>,
    validator: breakpointsValidator
  },
  colNum: {
    required: true,
    type: Number
  },
  cols: {
    default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }),
    type: Object as PropType<Breakpoints>,
    validator: breakpointsValidator
  },
  horizontalShift: {
    default: false,
    type: Boolean
  },
  intersectionObserverConfig: {
    default: () => ({ root: null, rootMargin: '8px', threshold: 0.40 }),
    type: Object as PropType<IntersectionObserverConfig>,
    validator: intersectionObserverConfigValidator
  },
  isDraggable: {
    default: true,
    type: Boolean
  },
  isResizable: {
    default: true,
    type: Boolean
  },
  layout: {
    required: true,
    type: Array as PropType<Layout>,
    validator: layoutValidator
  },
  margin: {
    default: () => [10, 10],
    type: Array as PropType<number[]>,
    validator: marginValidator
  },
  maxRows: {
    default: Infinity,
    type: Number
  },
  preventCollision: {
    default: false,
    type: Boolean
  },
  responsive: {
    default: false,
    type: Boolean
  },
  responsiveLayouts: {
    default: () => ({}),
    type: Object as PropType<ResponsiveLayout>,
    validator: (value: ResponsiveLayout) => {
      const layoutKeys = (Object.keys(value) as (keyof ResponsiveLayout)[])

      if (!layoutKeys.length) return true

      const validator = layoutKeys.map((k: BreakpointsKeys) => layoutValidator(value[k]))

      return !validator.includes(false)
    }
  },
  rowHeight: {
    default: 150,
    type: Number
  },
  useCssTransforms: {
    default: true,
    type: Boolean
  },
  useObserver: {
    default: false,
    type: Boolean
  },
  verticalCompact: {
    default: true,
    type: Boolean
  }
})
// emits
const emit = defineEmits([
  'update:layout',
  'layout-ready',
  'update:breakpoint',
  'layout-created',
  'layout-before-mount',
  'layout-mounted',
  'container-resized',
  'item-resize',
  'item-resized',
  'item-move',
  'item-moved',
  'intersection-observe',
  'intersection-unobserve'
])
const emitter = mitt<Events>()

provide(emitterKey, emitter)

// options
const layoutItemRequired = { h: 0, i: -1, w: 0, x: 0, y: 0 }
const layoutItemOptionalKeys = ['minW', 'minH', 'maxW', 'maxH', 'moved', 'static', 'isDraggable', 'isResizable']

//data
const erd = ref(elementResizeDetectorMaker({ callOnAdd: false, strategy: 'scroll' }))
const isDragging = ref(false)
const lastBreakpoint = ref<BreakpointsKeys>('')
const lastLayoutLength = ref(0)
const layouts = ref<RecordBreakpoint<Layout>>({})
const mergedStyle = ref({})
const originalLayout = ref(props.layout)
const placeholder = ref({ h: 0, i: -1, w: 0, x: 0, y: 0 })
const width = ref(0)
let observer: IntersectionObserver
// refs
const wrapper = ref<HTMLDivElement | null>(null)

// computed
const gridItemProps = computed(() => ({
  breakpointCols: props.cols,
  colNum: props.colNum,
  containerWidth: width.value,
  isDraggable: props.isDraggable,
  isResizable: props.isResizable,
  lastBreakpoint: lastBreakpoint.value,
  margin: props.margin,
  maxRows: props.maxRows,
  responsive: props.responsive,
  rowHeight: props.rowHeight,
  useCssTransforms: props.useCssTransforms,
  width: width.value
}))

// watch
watch(() => props.colNum, value => {
  emitter.emit('set-col-num', value)
})

watch(() => props.layout.length, () => {
  layoutUpdate()
  compact(props.layout, props.verticalCompact)
})

watch(() => props.margin, () => {
  updateHeight()
})
watch(() => props.responsive, value => {
  if (!value) {
    emit('update:layout', originalLayout.value)
    emitter.emit('set-col-num', props.colNum)
  }
  onWindowResize()
})
watch(() => width.value, (value, oldValue) => {
  nextTick(() => {

    if (oldValue === 0) {
      nextTick(() => {
        emit('layout-ready', props.layout)
      })
    }

    if (props.responsive) responsiveGridLayout()

    updateHeight()
  })
})
watch(() => props.useObserver, value => {
  if (!value) {
    observer.disconnect()
    return
  }

  createObserver()
})
// methods
const observerCallback = entries => {
  const observerItems = {
    observe: [],
    unobserve: []
  }

  entries.forEach(({ target, isIntersecting }) => {

    if (isIntersecting) {
      observerItems.observe.push(target.__INTERSECTION_OBSERVER_INDEX__)
      return
    }

    observerItems.unobserve.push(target.__INTERSECTION_OBSERVER_INDEX__)
  })

  emit('intersection-observe', observerItems.observe)
  emit('intersection-unobserve', observerItems.unobserve)
}

const layoutItemOptional = (props: { [key: string]: any }) => {
  const requiredKeys = Object.keys(layoutItemRequired)

  return (Object.keys(props) as (keyof typeof props)[])
    .reduce((acc, val) => {
      if (layoutItemOptionalKeys.includes(val) || requiredKeys.includes(val)) {
        acc[val] = props[val]
      }
      return acc
    }, {})
}

const layoutUpdate = (): void => {
  if (props.layout && originalLayout.value) {
    if (props.layout.length !== originalLayout.value.length) {
      const diff = findDifference(props.layout, originalLayout.value)
      // TODO

      if (diff.length > 0) {
        if (props.layout.length > originalLayout.value.length) {
          originalLayout.value = originalLayout.value.concat(diff)
        } else {
          originalLayout.value = originalLayout.value.filter(obj => {
            return !diff.some(obj2 => {
              return obj.i === obj2.i
            })
          })
        }
      }

      lastLayoutLength.value = props.layout.length
      initResponsiveFeatures()
    }

    compact(props.layout, props.verticalCompact)

    updateHeight()

    emit('update:layout', props.layout)
    emitter.emit('recalculate-styles')
  }
}
const findDifference = (layout: Layout, originalLayout: Layout): Layout => {
  const uniqueResultOne = layout.filter(l => !originalLayout.some(ol => l.i === ol.i))
  const uniqueResultTwo = originalLayout.filter(ol => !layout.some(l => ol.i === l.i))

  return uniqueResultOne.concat(uniqueResultTwo)
}
const initResponsiveFeatures = (): void => {
  layouts.value = Object.assign({}, props.responsiveLayouts)
}
const updateHeight = (): void => {
  const height = containerHeight()

  mergedStyle.value = { height }
}
const containerHeight = (): string | undefined => {
  if (!props.autoSize || !props.layout) return

  const [, m2] = props.margin

  return `${bottom(props.layout) * (props.rowHeight + m2) + m2}px`
}
const onWindowResize = (): void => {
  if (wrapper.value) {
    width.value = wrapper.value.offsetWidth
  }
}
const responsiveGridLayout = (): void => {
  const newBreakpoint = getBreakpointFromWidth(props.breakpoints, width.value)
  const newCols = getColsFromBreakpoint(newBreakpoint, props.cols)

  if (lastBreakpoint.value && !layouts.value[lastBreakpoint.value]) {
    layouts.value[lastBreakpoint.value] = cloneLayout(props.layout)
  }

  const layout = findOrGenerateResponsiveLayout(
    originalLayout.value,
    layouts.value,
    props.breakpoints,
    newBreakpoint,
    lastBreakpoint.value,
    newCols,
    props.verticalCompact
  )

  layouts.value[newBreakpoint] = layout

  if (lastBreakpoint.value !== newBreakpoint) {
    emit('update:breakpoint', newBreakpoint, layout)
  }

  lastBreakpoint.value = newBreakpoint

  emit('update:layout', layout)
  emitter.emit('set-col-num', getColsFromBreakpoint(newBreakpoint, props.cols))
}
const onCreated = () => {
  emit('layout-created', props.layout)

  emitter.on('resize-event', resizeEvent)
  emitter.on('drag-event', dragEvent)
}
const resizeEvent = ([eventName, id, x, y, h, w]: GridLayoutEvent): void => {
  const layoutItem = getLayoutItem(props.layout, id)
  const l = layoutItem ?? { ...layoutItemRequired }

  let hasCollisions

  if (props.preventCollision) {
    const collisions = getAllCollisions(props.layout, { ...l, h, w }).filter(
      layoutItem => layoutItem.i !== l.i
    )

    hasCollisions = collisions.length > 0

    if (hasCollisions) {
      let leastX = Infinity, leastY = Infinity

      collisions.forEach(layoutItem => {
        if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x)

        if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y)
      })

      if (Number.isFinite(leastX)) l.w = leastX - l.x

      if (Number.isFinite(leastY)) l.h = leastY - l.y
    }
  }

  if (!hasCollisions) {
    l.w = w
    l.h = h
  }

  if (eventName === 'resizestart' || eventName === 'resizemove') {
    placeholder.value.i = +id
    placeholder.value.x = x
    placeholder.value.y = y
    placeholder.value.w = l.w
    placeholder.value.h = l.h

    nextTick(() => {
      isDragging.value = true
    })

  } else {
    nextTick(() => {
      isDragging.value = false
    })
  }

  if (props.responsive) responsiveGridLayout()

  compact(props.layout, props.verticalCompact)

  emitter.emit('recalculate-styles')
  updateHeight()

  if (eventName === 'resizeend') {
    emit('update:layout', props.layout)
  }
}

const dragEvent = ([eventName, id, x, y, h, w]: GridLayoutEvent): void => {
  const layoutItem = getLayoutItem(props.layout, id)
  const l = layoutItem ?? { ...layoutItemRequired }

  if (eventName === 'dragmove' || eventName === 'dragstart') {
    placeholder.value.i = +id
    placeholder.value.x = l.x
    placeholder.value.y = l.y
    placeholder.value.w = w
    placeholder.value.h = h
    nextTick(() => {
      isDragging.value = true
    })
  } else {
    nextTick(() => {
      isDragging.value = false
    })
  }

  emit('update:layout', moveElement(props.layout, l, x, y, true, props.horizontalShift, props.preventCollision))

  compact(props.layout, props.verticalCompact)

  emitter.emit('recalculate-styles')
  updateHeight()

  if (eventName === 'dragend') {
    compact(props.layout, props.verticalCompact)
    emit('update:layout', props.layout)
  }
}

const createObserver = () => {
  observer = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '8px',
    threshold: 0.40,
    ...props.intersectionObserverConfig
  })
}


// lifecycles
onCreated()
onBeforeUnmount(() => {
  removeWindowEventListener('resize', onWindowResize)

  if (erd.value && wrapper.value) {
    erd.value.uninstall(wrapper.value)
  }

  emitter.off('resize-event', resizeEvent)
  emitter.off('drag-event', dragEvent)
})
onBeforeMount(() => {
  emit('layout-before-mount', props.layout)
})

onMounted(() => {
  emit('layout-mounted', props.layout)
  nextTick(() => {
    originalLayout.value = props.layout

    nextTick(() => {
      onWindowResize()
      initResponsiveFeatures()

      addWindowEventListener('resize', onWindowResize.bind(this))
      compact(props.layout, props.verticalCompact)

      emit('update:layout', props.layout)
      updateHeight()

      if (wrapper.value) {
        erd.value.listenTo(wrapper.value, onWindowResize)
      }

      if (props.useObserver) {
        createObserver()
      }
    })
  })
})
</script>

<style>
.vue-grid-layout {
  position: relative;
  transition: height 200ms ease;
}
</style>
