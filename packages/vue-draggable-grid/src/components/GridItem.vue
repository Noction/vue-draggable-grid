<template>
  <div
    ref="item"
    class="vue-grid-item"
    :class="cssClasses"
    :style="style.props"
  >
    <slot />
    <span
      v-if="isResizableAndNotStatic"
      :class="RESIZABLE_HANDLE_CLASS"
    />
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from 'vue'
import { emitterKey } from '@/types/symbols'
import { getColsFromBreakpoint } from '@/helpers/responsiveUtils'
import interact from '@interactjs/interactjs'
import { Dimensions, GridItemPosition, HTMLDivElementWithId } from '@/types/components'
import type { GridItemEvents, GridItemProps } from '@/types/grid-item'
import { INTERSECTION_OBSERVER_ID, RESIZABLE_HANDLE_CLASS } from '@/constants'
import {
  computed,
  inject,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'
import { createCoreData, getControlPosition } from '@/helpers/draggableUtils'
import { setTopLeft, setTransform, stringReplacer } from '@/helpers/utils'

const props = withDefaults(
  defineProps<GridItemProps>(),
  {
    dragAllowFrom: null,
    dragIgnoreFrom: 'a, button',
    dragOption: () => ({}),
    isStatic: false,
    maxH: Infinity,
    maxW: Infinity,
    minH: 1,
    minW: 1,
    observer: undefined
  }
)

const emit = defineEmits<GridItemEvents>()

const item = ref<HTMLDivElementWithId | null>(null)
const emitter = inject(emitterKey)

const cols = ref(props.colNum)
const dragEventSet = ref(false)
const dragging = ref<{ left?: number; top?: number }>({})
const inner = ref<Dimensions>({ h: props.h, w: props.w, x: props.x, y: props.y })

// eslint-disable-next-line
const interactObj = ref<any>(null)
const isDragging = ref(false)
const isResizing = ref(false)
const lastInner = ref<Dimensions>({ h: NaN, w: NaN, x: NaN, y: NaN })
const previousInner = ref<Dimensions>({ h: NaN, w: NaN, x: NaN, y: NaN })
const resizeEventSet = ref(false)
const resizing = ref<{ height: number; width: number } | null>(null)
const style: { props: CSSProperties } = reactive({ props: {} })

const cssClasses = computed(() => {
  return {
    'css-transforms': props.useCssTransforms,
    'disable-user-select': isDragging.value,
    'no-touch': isNoTouch.value,
    resizing: isResizing.value,
    static: props.isStatic,
    'vue-draggable-dragging': isDragging.value,
    'vue-resizable': isResizableAndNotStatic.value
  } as const
})

const isNoTouch = computed(() => {
  const isDraggableOrResizable = props.isDraggable || props.isResizable
  const isAndroid = navigator.userAgent
    .toLowerCase()
    .indexOf('android') !== -1

  return isAndroid && isDraggableOrResizable && !props.isStatic
})

const isResizableAndNotStatic = computed(() => props.isResizable && !props.isStatic)

watch(() => props.observer, () => {
  if (props.observer && item.value) {
    props.observer.observe(item.value)

    item.value[INTERSECTION_OBSERVER_ID] = props.id
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
watch(() => props.isStatic, () => {
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

const calcColWidth = (): GridItemPosition['width'] => {
  const [m1] = props.margin

  return (props.containerWidth - (m1 * (cols.value + 1))) / cols.value
}

const calcPosition = ({ x, y, w, h } : Dimensions): GridItemPosition => {
  const colWidth = calcColWidth()
  const [m1, m2] = props.margin

  return {
    height: h === Infinity ? h : Math.round(props.rowHeight * h + Math.max(0, h - 1) * m2),
    left: Math.round(colWidth * x + (x + 1) * m2),
    top: Math.round(props.rowHeight * y + (y + 1) * m2),
    width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * m1)
  }
}

const calcWH = (height: GridItemPosition['height'], width: GridItemPosition['width']): Pick<Dimensions, 'w' | 'h'> => {
  const colWidth = calcColWidth()
  const [m1, m2] = props.margin
  const w = Math.round((width + m1) / (colWidth + m1))
  const h = Math.round((height + m2) / (props.rowHeight + m2))

  return {
    h: Math.max(Math.min(h, props.maxRows - inner.value.y), 0),
    w: Math.max(Math.min(w, cols.value - inner.value.x), 0)
  }
}

const calcXY = (top: GridItemPosition['top'], left: GridItemPosition['left']): Pick<Dimensions, 'x' | 'y'> => {
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
  const pos = calcPosition({
    h: inner.value.h,
    w: inner.value.w,
    x: inner.value.x,
    y: inner.value.y
  })

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
    // eslint-disable-next-line
    // @ts-ignore
    pos.width = resizing?.value?.width ?? 0
    // eslint-disable-next-line
    // @ts-ignore
    pos.height = resizing?.value?.height ?? 0
  }

  style.props = props.useCssTransforms
    ? setTransform(pos.top, pos.left, pos.width, pos.height)
    : setTopLeft(pos.top, pos.left, pos.width, pos.height)

}
const emitContainerResized = () => {
  createStyle()

  const styleProps = {} as { height: number; width: number }

  for (const prop of ['width', 'height'] as const) {
    const val = style.props[prop]
    // eslint-disable-next-line
    // @ts-ignore
    const matches = val?.toString().match(/^(\d+)px$/)

    if (!matches) return

    styleProps[prop] = +matches[1]
  }

  emit('noc-resize-container', {
    h: props.h,
    height: styleProps.height,
    id: props.id,
    w: props.w,
    width: styleProps.width
  })
}

// eslint-disable-next-line
const handleDrag = (event: any): void  => {
  if (props.isStatic || isResizing.value) return

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
    emit('noc-move', {
      id: props.id,
      x: pos.x,
      y: pos.y
    })
  }

  if (event.type === 'dragend' && (previousInner.value.x !== inner.value.x || previousInner.value.y !== inner.value.y)) {
    emit('noc-move-end', {
      id: props.id,
      x: pos.x,
      y: pos.y
    })
  }

  // eslint-disable-next-line
  // @ts-ignore
  emitter?.emit('drag-event', [event.type, props.id, pos.x, pos.y, inner.value.h, inner.value.w])
}

// eslint-disable-next-line
const handleResize = (event: any): void => {
  if (props.isStatic) return

  const position = getControlPosition(event)

  if (!position) return

  const { x, y } = position
  const newSize = { height: 0, width: 0 }

  switch (event.type) {
    case 'resizestart': {
      previousInner.value.w = inner.value.w
      previousInner.value.h = inner.value.h

      const { height, width } = calcPosition({
        h: inner.value.h,
        w: inner.value.w,
        x: inner.value.x,
        y: inner.value.y
      })

      newSize.width = width
      newSize.height = height

      resizing.value = newSize
      isResizing.value = true
      break
    }
    case 'resizemove': {
      const coreEvent = createCoreData(lastInner.value.x, lastInner.value.h, x, y)

      // eslint-disable-next-line
      // @ts-ignore
      newSize.width = (resizing?.value?.width ?? 0) + coreEvent.deltaX
      // eslint-disable-next-line
      // @ts-ignore
      newSize.height = (resizing?.value?.height ?? 0) + coreEvent.deltaY

      resizing.value = newSize
      isResizing.value = true
      break
    }
    case 'resizeend': {
      const { height, width } = calcPosition({
        h: inner.value.h,
        w: inner.value.w,
        x: inner.value.x,
        y: inner.value.y
      })

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
    emit('noc-resize', {
      h: pos.h,
      height: newSize.height,
      id: props.id,
      w: pos.w,
      width: newSize.width
    })
  }

  if (event.type === 'resizeend' && (previousInner.value.w !== inner.value.w || previousInner.value.h !== inner.value.h)) {
    emit('noc-resize-end', {
      h: pos.h,
      height: newSize.height,
      id: props.id,
      w: pos.w,
      width: newSize.width
    })
  }

  // eslint-disable-next-line
  // @ts-ignore
  emitter?.emit('resize-event', [event.type, props.id, inner.value.x, inner.value.y, pos.h, pos.w])
}
const setColNum = (colNum: number): void => {
  cols.value = colNum
}
const tryMakeDraggable = (): void => {
  if (!interactObj.value && item.value) {
    interactObj.value = interact(item.value)
  }

  if (props.isDraggable && !props.isStatic) {
    interactObj.value.draggable({
      allowFrom: props.dragAllowFrom,
      ignoreFrom: props.dragIgnoreFrom,
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

  if (props.isResizable && !props.isStatic) {
    const selector = `.${stringReplacer(RESIZABLE_HANDLE_CLASS, ' ', '.')}`
    const maximum = calcPosition({
      h: props.maxH,
      w: props.maxW,
      x: 0,
      y: 0
    })
    const minimum = calcPosition({
      h: props.minH,
      w: props.minW,
      x: 0,
      y: 0
    })
    const opts = {
      edges: { bottom: selector, left: false, right: selector, top: false },
      ignoreFrom: 'a, button',
      restrictSize: {
        max: { height: maximum.height, width: maximum.width },
        min: { height: minimum.height, width: minimum.width }
      }
    }

    // eslint-disable-next-line
    // @ts-ignore
    interactObj.value.resizable(opts)

    if (!resizeEventSet.value) {
      resizeEventSet.value = true
      interactObj.value.on('resizestart resizemove resizeend', handleResize)
    }
  } else {
    // eslint-disable-next-line
    // @ts-ignore
    interactObj.value.resizable({ enabled: false })
  }
}

const onCreate = () => {
  emitter?.on('recalculate-styles', createStyle)
  // eslint-disable-next-line
  // @ts-ignore
  emitter?.on('set-col-num', setColNum)
}

onCreate()

onBeforeUnmount(() => {
  emitter?.off('recalculate-styles', createStyle)
  // eslint-disable-next-line
  // @ts-ignore
  emitter?.off('set-col-num', setColNum)

  if (interactObj.value) {
    // eslint-disable-next-line
    // @ts-ignore
    interactObj.value.unset()
  }

  if (props.observer && item.value !== null) {
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
    box-sizing: border-box;
    touch-action: none;
    background-color: #f2f2f2;
    transition: all .2s ease;
    transition-property: left, top, right;

    &.no-touch {
      touch-action: none;
    }

    &.css-transforms {
      right: auto;
      left: 0;
      transition-property: transform;
    }

    &.resizing {
      z-index: 3;
      opacity: .6;
    }

    &.vue-draggable-dragging {
      z-index: 3;
      transition: none;
    }

    &.vue-grid-placeholder {
      z-index: 2;
      user-select: none;
      background: red;
      opacity: .2;
      transition-duration: .1s;
    }

    & > .vue-resizable-handle {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 20;
      box-sizing: border-box;
      width: 20px;
      height: 20px;
      padding: 0 3px 3px 0;
      cursor: se-resize;
      background-image: url("../assets/resize.svg");
      background-repeat: no-repeat;
      background-position: bottom right;
      background-origin: content-box;
    }

    &.disable-user-select {
      user-select: none;
    }
  }
</style>
