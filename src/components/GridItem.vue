<template>
  <div
    ref="item"
    class="vue-grid-item"
    :class="classObj"
    :style="style"
  >
    <slot />
    <span
      v-if="resizableAndNotStatic"
      :class="$options.resizableHandleClass"
    />
  </div>
</template>

<script lang="ts">
import '@interactjs/auto-start'
import '@interactjs/actions/drag'
import '@interactjs/actions/resize'
import '@interactjs/modifiers'
import '@interactjs/dev-tools'

import { getColsFromBreakpoint } from '@/helpers/responsiveUtils'
import interact from '@interactjs/interact'
import { Breakpoints, BreakpointsKeys } from '@/types/helpers'
import { GridItemClasses, GridItemData, GridItemPosition } from '@/types/components'
import { PropType, defineComponent } from 'vue'
import { createCoreData, getControlPosition } from '@/helpers/draggableUtils'
import { setTopLeft, setTransform, stringReplacer } from '@/helpers/utils'

export default defineComponent({
  name: 'GridItem',
  resizableHandleClass: 'vue-resizable-handle',
  props: {
    breakpointCols: {
      type: Object as PropType<Breakpoints>,
      required: true
    },
    colNum: {
      type: Number,
      required: true
    },
    containerWidth: {
      type: Number,
      required: true
    },
    dragAllowFrom: {
      type: String,
      default: null
    },
    dragIgnoreFrom: {
      type: String,
      required: false,
      default: 'a, button'
    },
    h: {
      type: Number,
      required: true
    },
    i: {
      type: String,
      required: true
    },
    isDraggable: {
      type: Boolean,
      default: false
    },
    isResizable: {
      type: Boolean,
      default: true
    },
    lastBreakpoint: {
      type: String as PropType<BreakpointsKeys>,
      required: true
    },
    margin: {
      type: Array as PropType<number[]>,
      default: () => [10, 10]
    },
    maxH: {
      type: Number,
      default: Infinity
    },
    maxRows: {
      type: Number,
      required: true
    },
    maxW: {
      type: Number,
      default: Infinity
    },
    minH: {
      type: Number,
      default: 1
    },
    minW: {
      type: Number,
      default: 1
    },
    resizeIgnoreFrom: {
      type: String,
      required: false,
      default: 'a, button'
    },
    rowHeight: {
      type: Number,
      required: true
    },
    static: {
      type: Boolean,
      default: false
    },
    useCssTransforms: {
      type: Boolean,
      default: true
    },
    w: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  emits: ['container-resized', 'resize', 'resized', 'move', 'moved'],
  data (): GridItemData {
    return {
      cols: this.colNum,
      dragEventSet: false,
      dragging: null,
      inner: { h: this.h, w: this.w, x: this.x, y: this.y },
      interactObj: null,
      isDragging: false,
      isResizing: false,
      lastInner: { h: NaN, w: NaN, x: NaN, y: NaN },
      previousInner: { h: NaN, w: NaN, x: NaN, y: NaN },
      resizeEventSet: false,
      resizing: null,
      style: {}
    }
  },
  computed: {
    classObj (): GridItemClasses {
      return {
        'css-transforms': this.useCssTransforms,
        'disable-user-select': this.isDragging,
        'no-touch': this.isNoTouch,
        resizing: this.isResizing,
        static: this.static,
        'vue-draggable-dragging': this.isDragging,
        'vue-resizable': this.resizableAndNotStatic
      }
    },
    isNoTouch (): boolean {
      const draggableOrResizableAndNotStatic = (this.isDraggable || this.isResizable) && !this.static
      const isAndroid = navigator.userAgent.toLowerCase().indexOf('android') !== -1

      return draggableOrResizableAndNotStatic && isAndroid
    },
    resizableAndNotStatic (): boolean {
      return this.isResizable && !this.static
    }
  },
  watch: {
    cols () {
      this.tryMakeResizable()
      this.createStyle()
      this.emitContainerResized()
    },
    containerWidth () {
      this.tryMakeResizable()
      this.createStyle()
      this.emitContainerResized()
    },
    h (newVal) {
      this.inner.h = newVal
      this.createStyle()
      // this.emitContainerResized();
    },
    isDraggable () {
      this.tryMakeDraggable()
    },
    isResizable () {
      this.tryMakeResizable()
    },
    maxH () {
      this.tryMakeResizable()
    },
    maxW () {
      this.tryMakeResizable()
    },
    minH () {
      this.tryMakeResizable()
    },
    minW () {
      this.tryMakeResizable()
    },
    rowHeight () {
      this.createStyle()
      this.emitContainerResized()
    },
    static () {
      this.tryMakeDraggable()
      this.tryMakeResizable()
    },
    w (newVal) {
      this.inner.w = newVal
      this.createStyle()
    },
    x (newVal) {
      this.inner.x = newVal
      this.createStyle()
    },
    y (newVal) {
      this.inner.y = newVal
      this.createStyle()
    }
  },
  created () {
    this.eventBus.on('recalculate-styles', this.createStyle)
    this.eventBus.on('set-col-num', this.setColNum)
  },
  beforeUnmount () {
    this.eventBus.off('recalculate-styles', this.createStyle)
    this.eventBus.off('set-col-num', this.setColNum)

    if (this.interactObj) {
      this.interactObj.unset()
    }
  },
  mounted () {
    this.cols = getColsFromBreakpoint(this.lastBreakpoint, this.breakpointCols)

    this.tryMakeDraggable()
    this.tryMakeResizable()
    this.createStyle()
  },
  methods: {
    calcColWidth (): number {
      const [m1] = this.margin

      return (this.containerWidth - (m1 * (this.cols + 1))) / this.cols
    },
    calcPosition (x: number, y: number, w: number, h: number): GridItemPosition {
      const colWidth = this.calcColWidth()
      const [m1, m2] = this.margin

      return {
        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * m2),
        left: Math.round(colWidth * x + (x + 1) * m2),
        top: Math.round(this.rowHeight * y + (y + 1) * m2),
        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * m1)
      }
    },
    calcWH (height: number, width: number): { h: number; w: number } {
      const colWidth = this.calcColWidth()
      const [m1, m2] = this.margin
      const w = Math.round((width + m1) / (colWidth + m1))
      const h = Math.round((height + m2) / (this.rowHeight + m2))

      return {
        h: Math.max(Math.min(w, this.cols - this.inner.x), 0),
        w: Math.max(Math.min(h, this.maxRows - this.inner.y), 0)
      }
    },
    calcXY (top: number, left: number): { x: number; y: number } {
      const colWidth = this.calcColWidth()
      const [m1, m2] = this.margin
      const x = Math.round((left - m1) / (colWidth + m1))
      const y = Math.round((top - m2) / (this.rowHeight + m2))

      return {
        x: Math.max(Math.min(x, this.cols - this.inner.w), 0),
        y: Math.max(Math.min(y, this.maxRows - this.inner.h), 0)
      }
    },
    createStyle (): void {
      const pos = this.calcPosition(this.inner.x, this.inner.y, this.inner.w, this.inner.h)

      if (this.x + this.w > this.cols) {
        this.inner.x = 0
        this.inner.w = (this.w > this.cols) ? this.cols : this.w
      } else {
        this.inner.x = this.x
        this.inner.w = this.w
      }

      if (this.isDragging) {
        pos.top = this.dragging?.top ?? 0
        pos.left = this.dragging?.left ?? 0
      }

      if (this.isResizing) {
        pos.width = this.resizing?.width ?? 0
        pos.height = this.resizing?.height ?? 0
      }

      this.style = this.useCssTransforms
        ? setTransform(pos.top, pos.left, pos.width, pos.height)
        : setTopLeft(pos.top, pos.left, pos.width, pos.height)
    },
    emitContainerResized () {
      const styleProps = {} as { height: number; width: number }

      for (const prop of ['width', 'height']) {
        const val = this.style[prop]
        const matches = val.match(/^(\d+)px$/)

        if (!matches) return

        // eslint-disable-next-line prefer-destructuring
        styleProps[prop] = matches[1]
      }
      this.$emit('container-resized', this.i, this.h, this.w, styleProps.height, styleProps.width)
    },
    handleDrag (event: any) {
      if (this.static) return
      if (this.isResizing) return

      const position = getControlPosition(event)

      // Get the current drag point from the event. This is used as the offset.
      if (!position) return // not possible but satisfies flow
      const { x, y } = position

      // let shouldUpdate = false;
      const newPosition = { left: 0, top: 0 }

      switch (event.type) {
        case 'dragstart': {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousInner.x = this.inner.x
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousInner.y = this.inner.y

          const parentRect = event.target.offsetParent.getBoundingClientRect()
          const clientRect = event.target.getBoundingClientRect()

          newPosition.left = clientRect.left - parentRect.left
          newPosition.top = clientRect.top - parentRect.top

          this.dragging = newPosition
          this.isDragging = true
          break
        }
        case 'dragend': {
          if (!this.isDragging) return
          const parentRect = event.target.offsetParent.getBoundingClientRect()
          const clientRect = event.target.getBoundingClientRect()

          newPosition.left = clientRect.left - parentRect.left
          newPosition.top = clientRect.top - parentRect.top

          this.dragging = null
          this.isDragging = false

          break
        }
        case 'dragmove': {
          const coreEvent = createCoreData(this.lastInner.x, this.lastInner.y, x, y)

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newPosition.left = this.dragging.left + coreEvent.deltaX
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newPosition.top = this.dragging.top + coreEvent.deltaY

          this.dragging = newPosition
          break
        }
      }

      // Get new XY
      const pos = this.calcXY(newPosition.top, newPosition.left)

      this.lastInner.x = x
      this.lastInner.y = y

      if (this.inner.x !== pos.x || this.inner.y !== pos.y) {
        this.$emit('move', this.i, pos.x, pos.y)
      }
      if (event.type === 'dragend' && (this.previousInner.x !== this.inner.x || this.previousInner.y !== this.inner.y)) {
        this.$emit('moved', this.i, pos.x, pos.y)
      }

      this.eventBus.emit('drag-event', [event.type, this.i, pos.x, pos.y, this.inner.h, this.inner.w])
    },
    handleResize (event: any) {
      if (this.static) return
      const position = getControlPosition(event)

      if (!position) return

      const { x, y } = position
      const newSize = { height: 0, width: 0 }

      let pos

      switch (event.type) {
        case 'resizestart': {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousInner.w = this.inner.w
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousInner.h = this.inner.h
          pos = this.calcPosition(this.inner.x, this.inner.y, this.inner.w, this.inner.h)
          newSize.width = pos.width
          newSize.height = pos.height

          this.resizing = newSize

          this.isResizing = true
          break
        }
        case 'resizemove': {
          const coreEvent = createCoreData(this.lastInner.x, this.lastInner.h, x, y)

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newSize.width = this.resizing.width + coreEvent.deltaX
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newSize.height = this.resizing.height + coreEvent.deltaY

          ///console.log("### resize => " + event.type + ", deltaX=" + coreEvent.deltaX + ", deltaY=" + coreEvent.deltaY);
          this.resizing = newSize
          break
        }
        case 'resizeend': {
          //console.log("### resize end => x=" +this.inner.x + " y=" + this.inner.y + " w=" + this.inner.w + " h=" + this.inner.h);
          pos = this.calcPosition(this.inner.x, this.inner.y, this.inner.w, this.inner.h)
          newSize.width = pos.width
          newSize.height = pos.height
          //                        console.log("### resize end => " + JSON.stringify(newSize));
          this.resizing = null
          this.isResizing = false
          break
        }
      }

      // Get new WH
      pos = this.calcWH(newSize.height, newSize.width)
      if (pos.w < this.minW) {
        pos.w = this.minW
      }
      if (pos.w > this.maxW) {
        pos.w = this.maxW
      }
      if (pos.h < this.minH) {
        pos.h = this.minH
      }
      if (pos.h > this.maxH) {
        pos.h = this.maxH
      }

      if (pos.h < 1) {
        pos.h = 1
      }
      if (pos.w < 1) {
        pos.w = 1
      }

      this.lastInner.x = x
      this.lastInner.h = y

      if (this.inner.w !== pos.w || this.inner.h !== pos.h) {
        this.$emit('resize', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }
      if (event.type === 'resizeend' && (this.previousInner.w !== this.inner.w || this.previousInner.h !== this.inner.h)) {
        this.$emit('resized', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }

      this.eventBus.emit('resize-event', [event.type, this.i, this.inner.x, this.inner.y, pos.h, pos.w])
    },
    setColNum (colNum: number) {
      this.cols = colNum
    },
    tryMakeDraggable () {
      if (!this.interactObj) {
        this.interactObj = interact(this.$refs.item)
      }
      if (this.isDraggable && !this.static) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.interactObj.draggable({ allowFrom: this.dragAllowFrom, ignoreFrom: this.dragIgnoreFrom })
        /*this.interactObj.draggable({allowFrom: '.vue-draggable-handle'});*/
        if (!this.dragEventSet) {
          this.dragEventSet = true
          this.interactObj.on('dragstart dragmove dragend', event => {
            this.handleDrag(event)
          })
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.interactObj.draggable({ enabled: false })
      }
    },
    tryMakeResizable () {
      if (!this.interactObj) {
        this.interactObj = interact(this.$refs.item)
      }

      if (this.isResizable && !this.static) {
        const { resizableHandleClass } = this.$options
        const selector = `.${stringReplacer(resizableHandleClass, ' ', '.')}`
        const maximum = this.calcPosition(0, 0, this.maxW, this.maxH)
        const minimum = this.calcPosition(0, 0, this.minW, this.minH)
        const opts = {
          edges: { bottom: selector, left: false, right: selector, top: false },
          ignoreFrom: this.resizeIgnoreFrom,
          restrictSize: {
            max: { height: maximum.height, width: maximum.width },
            min: { height: minimum.height, width: minimum.width }
          }
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.interactObj.resizable(opts)

        if (!this.resizeEventSet) {
          this.resizeEventSet = true

          this.interactObj.on('resizestart resizemove resizeend', event => {
            this.handleResize(event)
          })
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.interactObj.resizable({ enabled: false })
      }
    }
  }
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
      bottom: 0;
      right: 0;
      background-image: url('../assets/resize.svg');
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
