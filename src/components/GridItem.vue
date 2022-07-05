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
      :class="resizableHandleClass"
    />
    <!-- <span v-if="draggable" ref="dragHandle" class="vue-draggable-handle"></span> -->
  </div>
</template>

<script lang="ts">
import '@interactjs/auto-start'
import '@interactjs/actions/drag'
import '@interactjs/actions/resize'
import '@interactjs/modifiers'
import '@interactjs/dev-tools'

import { GridItemData } from '@/types/components'
import { getColsFromBreakpoint } from '@/helpers/responsiveUtils'
import interact from '@interactjs/interact'
import { Breakpoints, BreakpointsKeys, Layout } from '@/types/helpers'
import { PropType, defineComponent, toRef } from 'vue'
import { createCoreData, getControlPosition } from '@/helpers/draggableUtils'
import { setTopLeft, setTransform } from '@/helpers/utils'

export default defineComponent({
  name: 'GridItem',
  inject: ['layout'],
  props: {
    breakpointColsParent: {
      type: Object as PropType<Breakpoints>,
      required: true
    },
    colNumParent: {
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
      required: true
    },
    isDraggable: {
      type: Boolean,
      default: null
    },
    isResizable: {
      type: Boolean,
      default: null
    },
    lastBreakpoint: {
      type: String as PropType<BreakpointsKeys>,
      required: true
    },
    marginParent: {
      type: Array as PropType<number[]>,
      required: true
    },
    maxH: {
      type: Number,
      default: Infinity
    },
    maxRowsParent: {
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
    preserveAspectRatio: {
      type: Boolean,
      default: false
    },
    resizeIgnoreFrom: {
      type: String,
      required: false,
      default: 'a, button'
    },
    responsive: {
      type: Boolean,
      required: true
    },
    rowHeight: {
      type: Number,
      required: true
    },
    static: {
      type: Boolean,
      required: false,
      default: false
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
      cols: 1,
      dragEventSet: false,
      draggable: false,
      dragging: null,
      innerH: this.h,
      innerW: this.w,
      innerX: this.x,
      innerY: this.y,
      interactObj: null,
      isDragging: false,
      isResizing: false,
      lastH: NaN,
      lastW: NaN,
      lastX: NaN,
      lastY: NaN,
      margin: [10, 10],
      maxRows: Infinity,
      previousH: null,
      previousW: null,
      previousX: null,
      previousY: null,
      resizable: this.isResizable,
      resizeEventSet: false,
      resizing: null,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      style: {},
      useCssTransforms: true,
      useStyleCursor: true
    }
  },
  computed: {
    classObj () {
      return {
        cssTransforms : this.useCssTransforms,
        'disable-userselect': this.isDragging,
        'no-touch': this.isAndroid && this.draggableOrResizableAndNotStatic,
        resizing : this.isResizing,
        static: this.static,
        'vue-draggable-dragging' : this.isDragging,
        'vue-resizable' : this.resizableAndNotStatic
      }
    },
    draggableOrResizableAndNotStatic () {
      return (this.draggable || this.resizable) && !this.static
    },
    isAndroid () {
      return navigator.userAgent.toLowerCase().indexOf('android') !== -1
    },
    resizableAndNotStatic () {
      return this.resizable && !this.static
    },
    resizableHandleClass () {
      return 'vue-resizable-handle'
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
    draggable () {
      this.tryMakeDraggable()
    },
    h (newVal) {
      this.innerH = newVal
      this.createStyle()
      // this.emitContainerResized();
    },
    isDraggable () {
      this.draggable = this.isDraggable
    },
    isResizable () {
      this.resizable = this.isResizable
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
    resizable () {
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
      this.innerW = newVal
      this.createStyle()
      // this.emitContainerResized();
    },
    x (newVal) {
      this.innerX = newVal
      this.createStyle()
    },
    y (newVal) {
      this.innerY = newVal
      this.createStyle()
    }
  },
  created () {
    // Accessible refernces of functions for removing in beforeDestroy

    this.eventBus.on('update-width', this.updateWidthHandler)
    this.eventBus.on('compact', this.createStyle)
    this.eventBus.on('set-draggable', this.setDraggableHandler)
    this.eventBus.on('set-resizable', this.setResizableHandler)
    this.eventBus.on('set-max-rows', this.setMaxRowsHandler)
    this.eventBus.on('directionchange', this.createStyle)
    this.eventBus.on('set-col-num', this.setColNum)
    this.eventBus.on('changed:parent-margin', (margin: [number, number]) => {
      const [dataMargin1, dataMargin2] = this.margin
      const [parentMargin1, parentMargin2] = margin

      if (!margin || (parentMargin1 === dataMargin1 && parentMargin2 === dataMargin2)) {
        return
      }

      this.margin = [parentMargin1, parentMargin2]
      this.createStyle()
      this.emitContainerResized()
    })
  },
  beforeUnmount () {
    this.eventBus.off('update-width', this.updateWidthHandler)
    this.eventBus.off('compact', this.createStyle)
    this.eventBus.off('set-draggable', this.setDraggableHandler)
    this.eventBus.off('set-resizable', this.setResizableHandler)
    this.eventBus.off('set-max-rows', this.setMaxRowsHandler)
    this.eventBus.off('directionchange', this.createStyle)
    this.eventBus.off('set-col-num', this.setColNum)

    if (this.interactObj) {
      this.interactObj.unset()
    }
  },
  mounted () {
    if (this.responsive && this.lastBreakpoint) {
      this.cols = getColsFromBreakpoint(this.lastBreakpoint, this.breakpointColsParent)
    } else {
      this.cols = this.colNumParent
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.margin = this.marginParent ? this.marginParent : [10, 10]
    this.maxRows = this.maxRowsParent

    this.draggable = this.isDraggable
    this.resizable = this.isResizable
    // this.useStyleCursor = this.layout.useStyleCursor
    this.createStyle()
  },
  methods: {
    autoSize () {
      // ok here we want to calculate if a resize is needed
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.previousW = this.innerW
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.previousH = this.innerH

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line vue/require-slots-as-functions
      const newSize = this.$slots.default[0].elm.getBoundingClientRect()
      const pos = this.calcWH(newSize.height, newSize.width)

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

      // this.lastW = x; // basically, this is copied from resizehandler, but shouldn't be needed
      // this.lastH = y;

      if (this.innerW !== pos.w || this.innerH !== pos.h) {
        this.$emit('resize', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }
      if (this.previousW !== pos.w || this.previousH !== pos.h) {
        this.$emit('resized', this.i, pos.h, pos.w, newSize.height, newSize.width)
        this.eventBus.emit('resize-event', ['resizeend', this.i, this.innerX, this.innerY, pos.h, pos.w])
      }
    },
    calcColWidth () {
      const colWidth = (this.containerWidth - (this.margin[0] * (this.cols + 1))) / this.cols
      // console.log("### COLS=" + this.cols + " COL WIDTH=" + colWidth + " MARGIN " + this.margin[0]);

      return colWidth
    },
    calcPosition (x: number, y: number, w: number, h: number) {
      const colWidth = this.calcColWidth()

      return {
        height: h === Infinity ? h : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1]),
        left: Math.round(colWidth * x + (x + 1) * this.margin[0]),
        top: Math.round(this.rowHeight * y + (y + 1) * this.margin[1]),
        width: w === Infinity ? w : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0])
      }
    },
    calcWH (height: number, width: number) {
      const colWidth = this.calcColWidth()

      // width = colWidth * w - (margin * (w - 1))
      // ...
      // w = (width + margin) / (colWidth + margin)
      let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]))
      let h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]))

      // Capping
      w = Math.max(Math.min(w, this.cols - this.innerX), 0)
      h = Math.max(Math.min(h, this.maxRows - this.innerY), 0)
      return { h, w }
    },
    calcXY (top: number, left: number) {
      const colWidth = this.calcColWidth()

      // left = colWidth * x + margin * (x + 1)
      // l = cx + m(x+1)
      // l = cx + mx + m
      // l - m = cx + mx
      // l - m = x(c + m)
      // (l - m) / (c + m) = x
      // x = (left - margin) / (coldWidth + margin)
      let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]))
      let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]))

      // Capping
      x = Math.max(Math.min(x, this.cols - this.innerW), 0)
      y = Math.max(Math.min(y, this.maxRows - this.innerH), 0)

      return { x, y }
    },
    createStyle () {
      if (this.x + this.w > this.cols) {
        this.innerX = 0
        this.innerW = (this.w > this.cols) ? this.cols : this.w
      } else {
        this.innerX = this.x
        this.innerW = this.w
      }
      const pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)

      if (this.isDragging) {
        pos.top = this.dragging?.top ?? 0
        pos.left = this.dragging?.left ?? 0
      }

      if (this.isResizing) {
        pos.width = this.resizing?.width ?? 0
        pos.height = this.resizing?.height ?? 0
      }

      let style
      // CSS Transforms support (default)

      if (this.useCssTransforms) {
        style = setTransform(pos.top, pos.left, pos.width, pos.height)

      } else { // top,left (slow)
        style = setTopLeft(pos.top, pos.left, pos.width, pos.height)
      }

      this.style = style
    },
    emitContainerResized () {
      // this.style has width and height with trailing 'px'. The
      // resized event is without them
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
      if (position === null) return // not possible but satisfies flow
      const { x, y } = position

      // let shouldUpdate = false;
      const newPosition = { left: 0, top: 0 }

      switch (event.type) {
        case 'dragstart': {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousX = this.innerX
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousY = this.innerY

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
          const coreEvent = createCoreData(this.lastX, this.lastY, x, y)

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

      this.lastX = x
      this.lastY = y

      if (this.innerX !== pos.x || this.innerY !== pos.y) {
        this.$emit('move', this.i, pos.x, pos.y)
      }
      if (event.type === 'dragend' && (this.previousX !== this.innerX || this.previousY !== this.innerY)) {
        this.$emit('moved', this.i, pos.x, pos.y)
      }

      this.eventBus.emit('drag-event', [event.type, this.i, pos.x, pos.y, this.innerH, this.innerW])
    },
    handleResize (event: any) {
      if (this.static) return
      const position = getControlPosition(event)
      // Get the current drag point from the event. This is used as the offset.

      if (position === null) return // not possible but satisfies flow
      const { x, y } = position

      const newSize = { height: 0, width: 0 }
      let pos

      switch (event.type) {
        case 'resizestart': {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousW = this.innerW
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.previousH = this.innerH
          pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)
          newSize.width = pos.width
          newSize.height = pos.height
          this.resizing = newSize
          this.isResizing = true
          break
        }
        case 'resizemove': {
          //                        console.log("### resize => " + event.type + ", lastW=" + this.lastW + ", lastH=" + this.lastH);
          const coreEvent = createCoreData(this.lastW, this.lastH, x, y)

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
          //console.log("### resize end => x=" +this.innerX + " y=" + this.innerY + " w=" + this.innerW + " h=" + this.innerH);
          pos = this.calcPosition(this.innerX, this.innerY, this.innerW, this.innerH)
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

      this.lastW = x
      this.lastH = y

      if (this.innerW !== pos.w || this.innerH !== pos.h) {
        this.$emit('resize', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }
      if (event.type === 'resizeend' && (this.previousW !== this.innerW || this.previousH !== this.innerH)) {
        this.$emit('resized', this.i, pos.h, pos.w, newSize.height, newSize.width)
      }

      this.eventBus.emit('resize-event', [event.type, this.i, this.innerX, this.innerY, pos.h, pos.w])
    },
    setColNum (colNum: number) {
      this.cols = colNum
    },
    setDraggableHandler (isDraggable: boolean) {
      if (this.isDraggable === null) {
        this.draggable = isDraggable
      }
    },
    setMaxRowsHandler (maxRows: number) {
      this.maxRows = maxRows
    },
    setResizableHandler (isResizable: boolean) {
      if (this.isResizable === null) {
        this.resizable = isResizable
      }
    },
    tryMakeDraggable () {
      if (this.interactObj === null || this.interactObj === undefined) {
        this.interactObj = interact(this.$refs.item)
        if (!this.useStyleCursor) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.interactObj.styleCursor(false)
        }
      }
      if (this.draggable && !this.static) {
        const opts = {
          allowFrom: this.dragAllowFrom,
          ignoreFrom: this.dragIgnoreFrom
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.interactObj.draggable(opts)
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
        this.interactObj.draggable({
          enabled: false
        })
      }
    },
    tryMakeResizable () {
      if (this.interactObj === null || this.interactObj === undefined) {
        this.interactObj = interact(this.$refs.item)
        if (!this.useStyleCursor) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          this.interactObj.styleCursor(false)
        }
      }
      if (this.resizable && !this.static) {
        const maximum = this.calcPosition(0, 0, this.maxW, this.maxH)
        const minimum = this.calcPosition(0, 0, this.minW, this.minH)

        // console.log("### MAX " + JSON.stringify(maximum));
        // console.log("### MIN " + JSON.stringify(minimum));

        const opts = {
          // allowFrom: "." + this.resizableHandleClass.trim().replace(" ", "."),
          edges: {
            bottom: `.${  this.resizableHandleClass.trim().replace(' ', '.')}`,
            left: false,
            right: `.${  this.resizableHandleClass.trim().replace(' ', '.')}`,
            top: false
          },
          ignoreFrom: this.resizeIgnoreFrom,
          restrictSize: {
            max: {
              height: maximum.height,
              width: maximum.width
            },
            min: {
              height: minimum.height,
              width: minimum.width
            }
          }
        }

        if (this.preserveAspectRatio) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          opts.modifiers = [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            interact.modifiers.aspectRatio({
              ratio: 'preserve'
            })
          ]
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.interactObj.resizable(opts)
        if (!this.resizeEventSet) {
          this.resizeEventSet = true
          this.interactObj
            .on('resizestart resizemove resizeend', event => {
              this.handleResize(event)
            })
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.interactObj.resizable({
          enabled: false
        })
      }
    },
    updateWidth (width: number, colNum: number) {
      if (colNum !== undefined && colNum !== null) {
        this.cols = colNum
      }
    },
    updateWidthHandler (width: number) {
      this.updateWidth(width, this.colNumParent)
    }
  }
})
</script>

<style>
    .vue-grid-item {
        touch-action: none;
        box-sizing: border-box;
        transition: all 200ms ease;
        transition-property: left, top, right;
        background-color: #f2f2f2;
    }

    .vue-grid-item.no-touch {
        -ms-touch-action: none;
        touch-action: none;
    }

    .vue-grid-item.cssTransforms {
        transition-property: transform;
        left: 0;
        right: auto;
    }

    .vue-grid-item.resizing {
        opacity: 0.6;
        z-index: 3;
    }

    .vue-grid-item.vue-draggable-dragging {
        transition:none;
        z-index: 3;
    }

    .vue-grid-item.vue-grid-placeholder {
        background: red;
        opacity: 0.2;
        transition-duration: 100ms;
        z-index: 2;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

    .vue-grid-item > .vue-resizable-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        bottom: 0;
        right: 0;
        background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=');
        background-position: bottom right;
        padding: 0 3px 3px 0;
        background-repeat: no-repeat;
        background-origin: content-box;
        box-sizing: border-box;
        cursor: se-resize;
    }

    .vue-grid-item.disable-userselect {
        user-select: none;
    }
</style>
