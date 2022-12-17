<template>
  <div
    ref="item"
    class="vue-grid-item"
    :class="classObj"
    :style="style.props"
  >
    <slot />
    <span
      v-if="resizableAndNotStatic"
      :class="resizableHandleClass"
    />
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue'
import { emitterKey } from '../../types/symbols'
import { getColsFromBreakpoint } from '../../helpers/responsiveUtils'
import interact from '@interactjs/interactjs'
import { Breakpoints, BreakpointsKeys } from '../../types/helpers'
import { GridItemClasses, GridItemPosition, Inner } from '../../types/components'
import {
  PropType,
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'
import { createCoreData, getControlPosition } from '../../helpers/draggableUtils'
import { setTopLeft, setTransform, stringReplacer } from '../../helpers/utils'

const props = defineProps({
  breakpointCols: {
    required: true,
    type: Object as PropType<Breakpoints>
  },
  colNum: {
    required: true,
    type: Number
  },
  containerWidth: {
    required: true,
    type: Number
  },
  h: {
    required: true,
    type: Number
  },
  i: {
    required: true,
    type: Number
  },
  isDraggable: {
    required: true,
    type: Boolean
  },
  isResizable: {
    required: true,
    type: Boolean
  },
  lastBreakpoint: {
    required: true,
    type: String as PropType<BreakpointsKeys>
  },
  margin: {
    required: true,
    type: Array as PropType<number[]>
  },
  maxH: {
    default: Infinity,
    type: Number
  },
  maxRows: {
    required: true,
    type: Number
  },
  maxW: {
    default: Infinity,
    type: Number
  },
  minH: {
    default: 1,
    type: Number
  },
  minW: {
    default: 1,
    type: Number
  },
  observer: {
    default: undefined,
    type: [IntersectionObserver, undefined]
  },
  rowHeight: {
    required: true,
    type: Number
  },
  static: {
    default: false,
    type: Boolean
  },
  useCssTransforms: {
    required: true,
    type: Boolean
  },
  w: {
    required: true,
    type: Number
  },
  x: {
    required: true,
    type: Number
  },
  y: {
    required: true,
    type: Number
  },
  dragIgnoreFrom: {
    type: String,
    required: false,
    default: 'a, button'
  },
  dragAllowFrom: {
      type: String,
      required: false,
      default: null
  },
  dragOption:{
    type:Object,
    required: false,
    default: ()=>({}),
  },
})
const emit = defineEmits(['container-resized', 'resize', 'resized', 'move', 'moved', 'drag-event', 'resize-event'])
const item = ref<HTMLDivElement | null>(null)
const emitter = inject(emitterKey)
const resizableHandleClass = 'vue-resizable-handle'

// data
const cols = ref(props.colNum)
const dragEventSet = ref(false)
const dragging = ref<{ left?: number; top?: number }>({})
const inner = ref<Inner<number>>({ h: props.h, w: props.w, x: props.x, y: props.y })
const interactObj = ref<any>(null)
const isDragging = ref(false)
const isResizing = ref(false)
const lastInner = ref<Inner<number>>({ h: NaN, w: NaN, x: NaN, y: NaN })
const previousInner = ref<Inner<number>>({ h: NaN, w: NaN, x: NaN, y: NaN })
const resizeEventSet = ref(false)
const resizing = ref<{ height: number; width: number } | null>(null)
const style: { props: CSSProperties } = reactive({ props: {} })

// computed
const classObj = computed((): GridItemClasses => ({
  'css-transforms': props.useCssTransforms,
  'disable-user-select': isDragging.value,
  'no-touch': isNoTouch.value,
  resizing: isResizing.value,
  static: props.static,
  'vue-draggable-dragging': isDragging.value,
  'vue-resizable': resizableAndNotStatic.value
}))
const isNoTouch = computed((): boolean => {
  const draggableOrResizableAndNotStatic = (props.isDraggable || props.isResizable) && !props.static
  const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') !== -1

  return draggableOrResizableAndNotStatic && isAndroid
})
const resizableAndNotStatic = computed((): boolean => props.isResizable && !props.static)

watch(() => props.observer, () => {
  if (props.observer && item.value) {
    props.observer.observe(item.value)
    item.value.__INTERSECTION_OBSERVER_INDEX__ = props.i
  }
})
watch(() => cols.value, () => {
  tryMakeResizable()
  emitContainerResized()
})
watch(() => props.containerWidth, () => {
  tryMakeResizable()
  emitContainerResized()
})
watch(() => props.h, value => {
  inner.value.h = value
  emitContainerResized()
})
watch(() => props.isDraggable, () => {
  tryMakeDraggable()
})
watch(() => props.isResizable, () => {
  tryMakeResizable()
})
watch(() => props.maxH, () => {
  tryMakeResizable()
})
watch(() => props.maxW, () => {
  tryMakeResizable()
})
watch(() => props.minH, () => {
  tryMakeResizable()
})
watch(() => props.minW, () => {
  tryMakeResizable()
})
watch(() => props.rowHeight, () => {
  emitContainerResized()
})
watch(() => props.static, () => {
  tryMakeResizable()
  tryMakeDraggable()
})
watch(() => props.w, value => {
  inner.value.w = value
  createStyle()
})
watch(() => props.x, value => {
  inner.value.x = value
  createStyle()
})
watch(() => props.y, value => {
  inner.value.y = value
  createStyle()
})

const calcColWidth = (): number => {
  const [m1] = props.margin

  return (props.containerWidth - (m1 * (cols.value + 1))) / cols.value
}
const calcPosition = (x: number, y: number, w: number, h: number): GridItemPosition => {
  const colWidth = calcColWidth()
  const [m1, m2] = props.margin

  return {
    height: h === Infinity ? h : Math.round(props.rowHeight * h + Math.max(0, h - 1) * m2),
    left: Math.round(colWidth * x + (x + 1) * m2),
    top: Math.round(props.rowHeight * y + (y + 1) * m2),
    width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * m1)
  }
}
const calcWH = (height: number, width: number): { h: number; w: number } => {
  const colWidth = calcColWidth()
  const [m1, m2] = props.margin
  const w = Math.round((width + m1) / (colWidth + m1))
  const h = Math.round((height + m2) / (props.rowHeight + m2))

  return {
    h: Math.max(Math.min(h, props.maxRows - inner.value.y), 0),
    w: Math.max(Math.min(w, cols.value - inner.value.x), 0)
  }
}
const calcXY = (top: number, left: number): { x: number; y: number } => {
  const colWidth = calcColWidth()
  const [m1, m2] = props.margin
  const x = Math.round((left - m1) / (colWidth + m1))
  const y = Math.round((top - m2) / (props.rowHeight + m2))

  return {
    x: Math.max(Math.min(x, cols.value - inner.value.w), 0),
    y: Math.max(Math.min(y, props.maxRows - inner.value.h), 0)
  }
}
const createStyle = (): void => {
  const pos = calcPosition(inner.value.x, inner.value.y, inner.value.w, inner.value.h)

  if (props.x + props.w > cols.value) {
    inner.value.x = 0
    inner.value.w = (props.w > cols.value) ? cols.value : props.w
  } else {
    inner.value.x = props.x
    inner.value.w = props.w
  }

  if (isDragging.value) {
    pos.top = dragging.value.top ?? 0
    pos.left = dragging.value.left ?? 0
  }

  if (isResizing.value) {
    pos.width = resizing?.value?.width ?? 0
    pos.height = resizing?.value?.height ?? 0
  }

  style.props = props.useCssTransforms
    ? setTransform(pos.top, pos.left, pos.width, pos.height)
    : setTopLeft(pos.top, pos.left, pos.width, pos.height)

}
const emitContainerResized = () => {
  createStyle()

  const styleProps = {} as { height: number; width: number }

  for (const prop of ['width', 'height']) {
    const val = style.props[prop as 'width' | 'height']
    const matches = val?.toString().match(/^(\d+)px$/)

    if (!matches) return

    styleProps[prop as 'width' | 'height'] = +matches[1]
  }

  emit('container-resized', {
    h: props.h,
    height: styleProps.height,
    i: props.i,
    w: props.w,
    width: styleProps.width
  })
}
const handleDrag = (event: any): void  => {
  if (props.static || isResizing.value) return

  const position = getControlPosition(event)

  if (!position) return

  const { x, y } = position

  const newPosition = { left: 0, top: 0 }

  switch (event.type) {
    case 'dragstart': {
      previousInner.value.x = inner.value.x
      previousInner.value.y = inner.value.y

      const parentRect = event.target.offsetParent.getBoundingClientRect()
      const clientRect = event.target.getBoundingClientRect()

      newPosition.left = clientRect.left - parentRect.left
      newPosition.top = clientRect.top - parentRect.top

      dragging.value = newPosition
      isDragging.value = true
      break
    }
    case 'dragend': {
      if (!isDragging.value) return
      const parentRect = event.target.offsetParent.getBoundingClientRect()
      const clientRect = event.target.getBoundingClientRect()

      newPosition.left = clientRect.left - parentRect.left
      newPosition.top = clientRect.top - parentRect.top

      dragging.value = {}
      isDragging.value = false
      break
    }
    case 'dragmove': {
      const coreEvent = createCoreData(lastInner.value.x, lastInner.value.y, x, y)

      newPosition.left = (dragging?.value?.left ?? 0) + coreEvent.deltaX
      newPosition.top = (dragging?.value?.top ?? 0) + coreEvent.deltaY

      dragging.value = newPosition
      break
    }
  }

  const pos = calcXY(newPosition.top, newPosition.left)

  lastInner.value.x = x
  lastInner.value.y = y

  if (inner.value.x !== pos.x || inner.value.y !== pos.y) {
    emit('move', props.i, pos.x, pos.y)
  }

  if (event.type === 'dragend' && (previousInner.value.x !== inner.value.x || previousInner.value.y !== inner.value.y)) {
    emit('moved', props.i, pos.x, pos.y)
  }

  emitter?.emit('drag-event', [event.type, props.i, pos.x, pos.y, inner.value.h, inner.value.w])
}
const handleResize = (event: any): void => {
  if (props.static) return

  const position = getControlPosition(event)

  if (!position) return

  const { x, y } = position
  const newSize = { height: 0, width: 0 }

  switch (event.type) {
    case 'resizestart': {
      previousInner.value.w = inner.value.w
      previousInner.value.h = inner.value.h

      const { height, width } = calcPosition(inner.value.x, inner.value.y, inner.value.w, inner.value.h)

      newSize.width = width
      newSize.height = height

      resizing.value = newSize
      isResizing.value = true
      break
    }
    case 'resizemove': {
      const coreEvent = createCoreData(lastInner.value.x, lastInner.value.h, x, y)

      newSize.width = (resizing?.value?.width ?? 0) + coreEvent.deltaX
      newSize.height = (resizing?.value?.height ?? 0) + coreEvent.deltaY

      resizing.value = newSize
      isResizing.value = true
      break
    }
    case 'resizeend': {
      const { height, width } = calcPosition(inner.value.x, inner.value.y, inner.value.w, inner.value.h)

      newSize.width = width
      newSize.height = height

      resizing.value = null
      isResizing.value = false
      break
    }
  }

  const pos = calcWH(newSize.height, newSize.width)

  if (pos.w < props.minW) pos.w = props.minW
  if (pos.w > props.maxW) pos.w = props.maxW
  if (pos.h < props.minH) pos.h = props.minH
  if (pos.h > props.maxH) pos.h = props.maxH
  if (pos.h < 1) pos.h = 1
  if (pos.w < 1) pos.w = 1

  lastInner.value.x = x
  lastInner.value.h = y

  if (inner.value.w !== pos.w || inner.value.h !== pos.h) {
    emit('resize', props.i, pos.h, pos.w, newSize.height, newSize.width)
  }

  if (event.type === 'resizeend' && (previousInner.value.w !== inner.value.w || previousInner.value.h !== inner.value.h)) {
    emit('resized', props.i, pos.h, pos.w, newSize.height, newSize.width)
  }

  emitter?.emit('resize-event', [event.type, props.i, inner.value.x, inner.value.y, pos.h, pos.w])
}
const setColNum = (colNum: number): void => {
  cols.value = colNum
}
const tryMakeDraggable = (): void => {
  if (!interactObj.value && item.value) {
    interactObj.value = interact(item.value)
  }

  if (props.isDraggable && !props.static) {
    interactObj.value.draggable({
      ignoreFrom: props.dragIgnoreFrom,
      allowFrom: props.dragAllowFrom,
      ...props.dragOption
    })

    if (!dragEventSet.value) {
      dragEventSet.value = true
      interactObj.value.on('dragstart dragmove dragend', handleDrag)
    }
  } else {
    interactObj.value.draggable({ enabled: false })
  }
}
const tryMakeResizable = (): void => {
  if (!interactObj.value && item.value) {
    interactObj.value = interact(item.value)
  }

  if (props.isResizable && !props.static) {
    const selector = `.${stringReplacer(resizableHandleClass, ' ', '.')}`
    const maximum = calcPosition(0, 0, props.maxW, props.maxH)
    const minimum = calcPosition(0, 0, props.minW, props.minH)
    const opts = {
      edges: { bottom: selector, left: false, right: selector, top: false },
      ignoreFrom: 'a, button',
      restrictSize: {
        max: { height: maximum.height, width: maximum.width },
        min: { height: minimum.height, width: minimum.width }
      }
    }

    interactObj.value.resizable(opts)

    if (!resizeEventSet.value) {
      resizeEventSet.value = true
      interactObj.value.on('resizestart resizemove resizeend', handleResize)
    }
  } else {
    interactObj.value.resizable({ enabled: false })
  }
}

const onCreate = () => {
  emitter?.on('recalculate-styles', createStyle)
  emitter?.on('set-col-num', setColNum)
}
// lifecycle

onCreate()
onBeforeUnmount(() => {
  emitter?.off('recalculate-styles', createStyle)
  emitter?.off('set-col-num', setColNum)

  if (interactObj.value) {
    interactObj.value.unset()
  }

  if (props.observer) {
    props.observer.unobserve(item.value)
  }
})
onMounted(() => {
  if (props.lastBreakpoint) {
    cols.value = getColsFromBreakpoint(props.lastBreakpoint, props.breakpointCols)
  }

  tryMakeResizable()
  tryMakeDraggable()
  createStyle()
})
</script>

<style lang="scss">
  .vue-grid-item {
    touch-action: none;
    box-sizing: border-box;
    transition: all 200ms ease;
    transition-property: left, top, right;
    background-color: #f2f2f2;

    &.no-touch {
      touch-action: none;
    }

    &.css-transforms {
      transition-property: transform;
      left: 0;
      right: auto;
    }

    &.resizing {
      opacity: 0.6;
      z-index: 3;
    }

    &.vue-draggable-dragging {
      transition:none;
      z-index: 3;
    }

    &.vue-grid-placeholder {
      background: red;
      opacity: 0.2;
      transition-duration: 100ms;
      z-index: 2;
      user-select: none;
    }

    & > .vue-resizable-handle {
      position: absolute;
      width: 20px;
      height: 20px;
      z-index: 20;
      bottom: 0;
      right: 0;
      background-image: url('../../assets/resize.svg');
      background-position: bottom right;
      background-repeat: no-repeat;
      padding: 0 3px 3px 0;
      background-origin: content-box;
      box-sizing: border-box;
      cursor: se-resize;
    }

    &.disable-user-select {
      user-select: none;
    }
  }
</style>
